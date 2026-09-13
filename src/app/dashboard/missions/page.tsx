import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MissionsClient } from "@/components/missions/MissionsClient";
import { MissionCardSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";

async function MissionsContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: tasks }, { data: profile }] = await Promise.all([
    supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  return (
    <MissionsClient
      initialTasks={tasks ?? []}
      initialProfile={profile ?? {
        id: user.id, username: null, level: 1, xp: 0, gold: 0,
        streak_count: 0, last_active_date: null,
        attributes: { strength: 0, intellect: 0, discipline: 0, creativity: 0 },
        created_at: new Date().toISOString(),
      }}
    />
  );
}

function MissionsSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-9 w-32 rounded" />
      </div>
      <div className="skeleton h-16 w-full rounded mb-6" />
      {[...Array(4)].map((_, i) => <MissionCardSkeleton key={i} />)}
    </div>
  );
}

export default function MissionsPage() {
  return (
    <Suspense fallback={<MissionsSkeleton />}>
      <MissionsContent />
    </Suspense>
  );
}
