"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, AlertCircle, Loader2, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard/missions");
      router.refresh();
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  const isOauthConfigError = error && error.toLowerCase().includes("unable to exchange external code");

  return (
    <div>
      <div className="cyber-card p-7" style={{ border: "1px solid rgba(0,229,255,0.2)" }}>
        <h1
          className="text-center text-sm font-bold mb-6 tracking-widest"
          style={{ fontFamily: "var(--font-orbitron)", color: "#8C86B8" }}
        >
          SYSTEM LOGIN
        </h1>

        {error && (
          <div
            className="flex flex-col gap-2 p-3 mb-5 rounded"
            style={{ background: "#ff003c15", border: "1px solid #ff003c50" }}
          >
            <div className="flex items-start gap-2">
              <AlertCircle size={16} style={{ color: "#ff003c", flexShrink: 0, marginTop: 1 }} />
              <p style={{ color: "#ff003c", fontSize: "0.75rem", wordBreak: "break-word" }}>
                {error}
              </p>
            </div>
            {isOauthConfigError && (
              <div
                className="mt-1 p-2 rounded text-[11px] leading-relaxed"
                style={{ background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.2)", color: "#E9E6FF" }}
              >
                <div className="flex items-center gap-1 mb-1 font-bold" style={{ color: "#00E5FF" }}>
                  <Info size={12} /> Google OAuth Setup Required:
                </div>
                In Google Cloud Console, ensure <b>Authorized redirect URIs</b> is set to:
                <code className="block my-1 px-1 py-0.5 bg-black/40 rounded text-[10px] text-[#00E5FF] select-all">
                  https://fqppemakanltnfednytb.supabase.co/auth/v1/callback
                </code>
                And verify that the Client ID and Secret in Supabase match Google Cloud Console.
              </div>
            )}
          </div>
        )}

        {/* Google OAuth Button */}
        <button
          id="google-login-btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 mb-4 rounded transition-all"
          style={{
            background: googleLoading ? "#1a1a2e" : "#0f1117",
            border: "1px solid rgba(0,229,255,0.3)",
            color: "#E9E6FF",
            fontSize: "0.8rem",
            fontFamily: "var(--font-jetbrains)",
            cursor: googleLoading ? "not-allowed" : "pointer",
            opacity: googleLoading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!googleLoading)
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.3)";
          }}
          aria-label="Sign in with Google"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          {googleLoading ? "CONNECTING..." : "CONTINUE WITH GOOGLE"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "#1a1a2e" }} />
          <span style={{ color: "#6b7280", fontSize: "0.65rem", fontFamily: "var(--font-orbitron)", letterSpacing: "0.1em" }}>
            OR
          </span>
          <div className="flex-1 h-px" style={{ background: "#1a1a2e" }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-2 tracking-wider" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }} htmlFor="login-email">
              AGENT ID (EMAIL)
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="cyber-input pl-9"
                placeholder="agent@grid.io"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-2 tracking-wider" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }} htmlFor="login-password">
              ACCESS CODE
            </label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="cyber-input pl-9"
                placeholder="........"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading || googleLoading}
            className="btn-cyber btn-cyber-filled w-full justify-center mt-2"
            style={{ padding: "0.75rem 1rem" }}
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> AUTHENTICATING...
              </>
            ) : (
              "JACK IN"
            )}
          </button>
        </form>

        <p className="text-center mt-5" style={{ color: "#6b7280", fontSize: "0.75rem" }}>
          NEW OPERATIVE?{" "}
          <Link href="/signup" className="hover:underline transition-colors" style={{ color: "#00E5FF" }}>
            REGISTER
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="cyber-card p-7 text-center text-xs text-[#8C86B8]">INITIALIZING...</div>}>
      <LoginForm />
    </Suspense>
  );
}