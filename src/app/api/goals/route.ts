import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GoalWithProgress } from "@/types";

// Helper: compute live progress for a list of goals
async function computeProgress(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  goals: GoalWithProgress[]
): Promise<GoalWithProgress[]> {
  if (goals.length === 0) return [];

  const results = await Promise.all(
    goals.map(async (goal) => {
      const { data } = await supabase
        .from("tasks")
        .select("metric_value")
        .eq("user_id", userId)
        .eq("category", goal.category)
        .eq("status", "completed")
        .gte("completed_at", goal.period_start)
        .lte("completed_at", goal.period_end + "T23:59:59");

      const progress = (data ?? []).reduce(
        (sum, t) => sum + (Number(t.metric_value) || 0),
        0
      );
      const percentage = Math.min(100, Math.round((progress / goal.target_value) * 100));
      return { ...goal, progress, percentage };
    })
  );
  return results;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];

  // Mark expired goals first (past end date, still active, not achieved)
  await supabase
    .from("goals")
    .update({ status: "expired" })
    .eq("user_id", user.id)
    .eq("status", "active")
    .lt("period_end", today);

  const { data: goals, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const withProgress = await computeProgress(supabase, user.id, (goals ?? []) as GoalWithProgress[]);
  return NextResponse.json({ goals: withProgress });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, category, target_value, metric_unit, period_start, period_end, reward_text } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Goal title cannot be empty" }, { status: 400 });
  if (!["strength", "intellect", "discipline", "creativity"].includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!target_value || Number(target_value) <= 0) {
    return NextResponse.json({ error: "Target value must be greater than 0" }, { status: 400 });
  }
  if (!period_start || !period_end || period_end < period_start) {
    return NextResponse.json({ error: "Invalid date range" }, { status: 400 });
  }
  if (!reward_text?.trim()) return NextResponse.json({ error: "Reward text cannot be empty" }, { status: 400 });

  const { data, error } = await supabase
    .from("goals")
    .insert({
      user_id: user.id,
      title: title.trim(),
      category,
      target_value: Number(target_value),
      metric_unit: metric_unit?.trim() || null,
      period_start,
      period_end,
      reward_text: reward_text.trim(),
      status: "active",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return with progress = 0
  return NextResponse.json(
    { goal: { ...data, progress: 0, percentage: 0 } as GoalWithProgress },
    { status: 201 }
  );
}
