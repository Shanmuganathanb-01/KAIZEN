"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { KaizenLogo } from "@/components/ui/KaizenLogo";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setGoogleLoading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) { setError("Access code must be at least 6 characters"); return; }
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username }, emailRedirectTo: `${window.location.origin}/dashboard/missions` },
    });

    if (error) { setError(error.message); setLoading(false); return; }

    if (data.user && !data.session) {
      setSuccess(true); setLoading(false); return;
    }
    if (data.user) {
      await supabase.from("profiles").update({ username }).eq("id", data.user.id);
      router.push("/dashboard/missions");
      router.refresh();
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6">
        <KaizenLogo size={80} autoPlay showWordmark />
        <div className="cyber-card p-8 text-center w-full" style={{ border: "1px solid rgba(0,229,255,0.2)" }}>
          <CheckCircle size={40} className="mx-auto mb-4" style={{ color: "#00E5FF" }} />
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-orbitron)", color: "#E9E6FF" }}>
            NEURAL ID CREATED
          </h2>
          <p style={{ color: "#8C86B8", fontSize: "0.8rem" }}>
            Check your email to confirm your account, then{" "}
            <Link href="/login" style={{ color: "#00E5FF" }}>jack in</Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="cyber-card p-7" style={{ border: "1px solid rgba(154,76,255,0.25)" }}>
        <h1 className="text-center text-sm font-bold mb-6 tracking-widest"
            style={{ fontFamily: "var(--font-orbitron)", color: "#8C86B8" }}>
          REGISTER OPERATIVE
        </h1>

        {error && (
          <div className="flex items-start gap-2 p-3 mb-5 rounded"
               style={{ background: "#ff003c10", border: "1px solid #ff003c40" }}>
            <AlertCircle size={15} style={{ color: "#ff003c", flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#ff003c", fontSize: "0.75rem" }}>{error}</p>
          </div>
        )}

        {/* Google */}
        <button
          id="google-signup-btn"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 mb-4 rounded transition-all"
          style={{
            background: "#0f1117",
            border: "1px solid rgba(0,229,255,0.3)",
            color: "#E9E6FF",
            fontSize: "0.8rem",
            fontFamily: "var(--font-jetbrains)",
            cursor: googleLoading ? "not-allowed" : "pointer",
            opacity: googleLoading ? 0.7 : 1,
          }}
          onMouseEnter={e => { if (!googleLoading) (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.7)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,229,255,0.3)"; }}
          aria-label="Sign up with Google"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {googleLoading ? "CONNECTING..." : "CONTINUE WITH GOOGLE"}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "#1a1a2e" }} />
          <span style={{ color: "#6b7280", fontSize: "0.65rem", fontFamily: "var(--font-orbitron)", letterSpacing: "0.1em" }}>OR</span>
          <div className="flex-1 h-px" style={{ background: "#1a1a2e" }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-2 tracking-wider"
                   style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}
                   htmlFor="signup-username">OPERATIVE CODENAME</label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
              <input id="signup-username" type="text" value={username} onChange={e => setUsername(e.target.value)}
                     required className="cyber-input pl-9" placeholder="ghost_runner" autoComplete="username" />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-2 tracking-wider"
                   style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}
                   htmlFor="signup-email">AGENT ID (EMAIL)</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
              <input id="signup-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                     required className="cyber-input pl-9" placeholder="agent@grid.io" autoComplete="email" />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-2 tracking-wider"
                   style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}
                   htmlFor="signup-password">ACCESS CODE (MIN 6)</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6b7280" }} />
              <input id="signup-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                     required minLength={6} className="cyber-input pl-9" placeholder="........" autoComplete="new-password" />
            </div>
          </div>

          <button id="signup-submit" type="submit" disabled={loading || googleLoading}
                  className="btn-cyber btn-cyber-filled w-full justify-center mt-2"
                  style={{ padding: "0.75rem 1rem" }}>
            {loading ? (
              <><Loader2 size={14} className="animate-spin" /> INITIALIZING...</>
            ) : "CREATE NEURAL ID"}
          </button>
        </form>

        <p className="text-center mt-5" style={{ color: "#6b7280", fontSize: "0.75rem" }}>
          ALREADY ON THE GRID?{" "}
          <Link href="/login" className="hover:underline" style={{ color: "#00E5FF" }}>JACK IN</Link>
        </p>
      </div>
    </div>
  );
}