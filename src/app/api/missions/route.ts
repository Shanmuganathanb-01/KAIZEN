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

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: title.trim(),
      category,
      difficulty: Number(difficulty),
      status: "pending",
      metric_value: metric_value != null ? Number(metric_value) : null,
      metric_unit: metric_unit?.trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data }, { status: 201 });
}
