import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LandingPage from "./landing/page";

export const metadata = {
  title: "Kaizen — Turn your life into a game you actually want to play",
  description: "Kaizen turns real tasks into RPG progression: XP, levels, streaks, and stats you can watch grow.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard/missions");
  return <LandingPage />;
}
