import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/dashboard/missions";
  const errorParam = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // If Supabase returned an OAuth provider error
  if (errorParam || errorDescription) {
    const errorMsg = errorDescription || errorParam || "OAuth provider authentication failed";
    console.error("[OAuth Callback Error from Provider]:", errorMsg);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorMsg)}`, request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(new URL(next, request.url));
    }
    console.error("[OAuth Exchange Error]:", exchangeError.message);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url));
  }

  return NextResponse.redirect(new URL("/login?error=No+authentication+code+received", request.url));
}