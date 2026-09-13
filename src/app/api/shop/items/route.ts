import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [{ data: items }, { data: inventory }] = await Promise.all([
    supabase.from("shop_items").select("*").order("cost"),
    supabase.from("user_inventory").select("item_id").eq("user_id", user.id),
  ]);

  const ownedIds = new Set((inventory ?? []).map((i: { item_id: string }) => i.item_id));
  const enriched = (items ?? []).map((item: Record<string, unknown>) => ({
    ...item,
    owned: ownedIds.has(item.id as string),
  }));

  return NextResponse.json({ items: enriched });
}
