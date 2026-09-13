import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CharacterSheet } from "@/components/character/CharacterSheet";
import { CharacterSheetSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";

async function CharacterContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <CharacterSheet profile={profile} userEmail={user.email ?? ""} />;
}

export default function CharacterPage() {
  return (
    <Suspense fallback={<CharacterSheetSkeleton />}>
      <CharacterContent />
    </Suspense>
  );
}
