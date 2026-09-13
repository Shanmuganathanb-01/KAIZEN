import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoalsClient } from "@/components/goals/GoalsClient";
import { Suspense } from "react";
import type { GoalWithProgress } from "@/types";

async function GoalsContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Auto-expire past goals
  const today = new Date().toISOString().split("T")[0];
  await supabase
    .from("goals")
    .update({ status: "expired" })
    .eq("user_id", user.id)
    .eq("status", "active")
    .lt("period_end", today);

  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Compute live progress for each goal
  const withProgress: GoalWithProgress[] = await Promise.all(
    (goals ?? []).map(async (goal) => {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("metric_value")
        .eq("user_id", user.id)
        .eq("category", goal.category)
        .eq("status", "completed")
        .gte("completed_at", goal.period_start)
        .lte("completed_at", goal.period_end + "T23:59:59");

      const progress = (tasks ?? []).reduce(
        (sum, t) => sum + (Number(t.metric_value) || 0),
        0
      );
      const percentage = Math.min(100, Math.round((progress / goal.target_value) * 100));
      return { ...goal, progress, percentage } as GoalWithProgress;
    })
  );

  return <GoalsClient initialGoals={withProgress} />;
}

function GoalsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-8 w-56 rounded" />
        <div className="skeleton h-9 w-28 rounded" />
      </div>
      <div className="skeleton h-10 w-48 rounded mb-6" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton h-36 w-full rounded" />
      ))}
    </div>
  );
}

export default function GoalsPage() {
  return (
    <Suspense fallback={<GoalsSkeleton />}>
      <GoalsContent />
    </Suspense>
  );
}
