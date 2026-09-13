import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, category, difficulty, metric_value, metric_unit } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "Mission title cannot be empty" }, { status: 400 });
  }
  if (!["strength", "intellect", "discipline", "creativity"].includes(category)) {
    return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
  }
  if (![1, 2, 3].includes(Number(difficulty))) {
    return NextResponse.json({ error: "Difficulty must be 1, 2, or 3" }, { status: 400 });
  }

  const insertPayload: Record<string, unknown> = {
    user_id: user.id,
    title: title.trim(),
    category,
    difficulty: Number(difficulty),
    status: "pending",
  };

  if (metric_value != null && !isNaN(Number(metric_value))) {
    insertPayload.metric_value = Number(metric_value);
  }
  if (metric_unit && typeof metric_unit === "string" && metric_unit.trim()) {
    insertPayload.metric_unit = metric_unit.trim();
  }

  let { data, error } = await supabase
    .from("tasks")
    .insert(insertPayload)
    .select()
    .single();

  // If Supabase table hasn't migrated metric columns yet, fallback to base mission insert
  if (error && (error.message?.includes("metric_unit") || error.message?.includes("metric_value"))) {
    const fallback = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: title.trim(),
        category,
        difficulty: Number(difficulty),
        status: "pending",
      })
      .select()
      .single();
    data = fallback.data;
    error = fallback.error;
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data }, { status: 201 });
}
