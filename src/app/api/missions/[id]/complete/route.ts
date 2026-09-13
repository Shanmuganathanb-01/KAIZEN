import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { GoalWithProgress } from "@/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: taskId } = await params;

  // 1. Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Fetch task + verify ownership
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (taskError || !task) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  if (task.user_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (task.status === "completed") return NextResponse.json({ error: "Mission already completed" }, { status: 409 });

  // 3. Call atomic Postgres RPC via admin client (bypasses RLS)
  const admin = createAdminClient();
  const { data, error: rpcError } = await admin.rpc("complete_task", {
    p_task_id: taskId,
    p_user_id: user.id,
  });

  if (rpcError) {
    console.error("complete_task RPC error:", rpcError);
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  // 4. Goal check — find active goals for this task's category within current period
  const today = new Date().toISOString().split("T")[0];
  const achievedGoals: GoalWithProgress[] = [];

  try {
    const { data: activeGoals } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("category", task.category)
      .eq("status", "active")
      .lte("period_start", today)
      .gte("period_end", today);

    if (activeGoals && activeGoals.length > 0) {
      for (const goal of activeGoals) {
        // Compute live progress
        const { data: progressData } = await supabase
          .from("tasks")
          .select("metric_value")
          .eq("user_id", user.id)
          .eq("category", goal.category)
          .eq("status", "completed")
          .gte("completed_at", goal.period_start)
          .lte("completed_at", goal.period_end + "T23:59:59");

        const progress = (progressData ?? []).reduce(
          (sum, t) => sum + (Number(t.metric_value) || 0),
          0
        );
        const percentage = Math.min(100, Math.round((progress / goal.target_value) * 100));

        if (progress >= goal.target_value) {
          // Mark achieved
          await supabase
            .from("goals")
            .update({ status: "achieved", achieved_at: new Date().toISOString() })
            .eq("id", goal.id);

          achievedGoals.push({ ...goal, progress, percentage: 100, status: "achieved", achieved_at: new Date().toISOString() });
        }
      }
    }
  } catch (goalErr) {
    // Non-fatal — don't block the task completion response
    console.error("Goal check error:", goalErr);
  }

  return NextResponse.json({ ...data, achievedGoals });
}