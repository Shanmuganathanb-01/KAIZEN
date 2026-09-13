import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShopClient } from "@/components/shop/ShopClient";
import { ShopItemSkeleton } from "@/components/ui/Skeleton";
import { Suspense } from "react";

async function ShopContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: items }, { data: profile }, { data: inventory }] = await Promise.all([
    supabase.from("shop_items").select("*").order("cost"),
    supabase.from("profiles").select("id, gold, username").eq("id", user.id).single(),
    supabase.from("user_inventory").select("item_id").eq("user_id", user.id),
  ]);

  const ownedIds = new Set((inventory ?? []).map((i: { item_id: string }) => i.item_id));

  return (
    <ShopClient
      items={(items ?? []).map(item => ({ ...item, owned: ownedIds.has(item.id) }))}
      gold={profile?.gold ?? 0}
    />
  );
}

function ShopSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton h-8 w-48 rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(5)].map((_, i) => <ShopItemSkeleton key={i} />)}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
