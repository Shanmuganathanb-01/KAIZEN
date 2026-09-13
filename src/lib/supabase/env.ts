/**
 * Safely sanitizes environment variables in case they were accidentally pasted
 * multiple times, surrounded by quotes, prefixed with 'Bearer ', or contain whitespace/newlines.
 */
export function sanitizeEnv(val?: string): string {
  if (!val) return "";
  let cleaned = val.trim().replace(/^["']|["']$/g, "");
  if (cleaned.toLowerCase().startsWith("bearer ")) {
    cleaned = cleaned.slice(7).trim();
  }
  const token = cleaned.split(/[\s\r\n]+/)[0] || "";
  return token.trim();
}

export function getSupabaseUrl(): string {
  const url = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_URL);
  return url.replace(/\/+$/, "");
}

export function getSupabaseAnonKey(): string {
  return sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseServiceRoleKey(): string {
  return sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
