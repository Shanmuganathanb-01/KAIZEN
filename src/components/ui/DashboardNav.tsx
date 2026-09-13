"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Swords, User, ShoppingBag, LogOut, Wifi, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { KaizenLogo } from "@/components/ui/KaizenLogo";
import type { Profile } from "@/types";

interface DashboardNavProps {
  profile: Profile | null;
  userEmail: string;
  mobile?: boolean;
}

const navItems = [
  { href: "/dashboard/missions", label: "MISSIONS",     icon: Swords },
  { href: "/dashboard/goals",    label: "GOALS",        icon: Target },
  { href: "/dashboard/character", label: "CHARACTER",   icon: User },
  { href: "/dashboard/shop",     label: "BLACK MARKET", icon: ShoppingBag },
];


export function DashboardNav({ profile, userEmail, mobile = false }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (mobile) {
    return (
      <div className="flex items-center justify-around py-2 px-1">
        {/* App Logo on left side of mobile tab bar */}
        <Link href="/dashboard/missions"
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all hover:opacity-80"
              aria-label="Kaizen Home">
          <KaizenLogo size={22} layout="vertical" autoPlay={false} showWordmark={false} />
          <span style={{ fontFamily: "var(--font-audiowide)", fontSize: "0.55rem", color: "#00E5FF", letterSpacing: "0.06em" }}>
            KAIZEN
          </span>
        </Link>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
                  className="flex flex-col items-center gap-1 px-4 py-2 transition-all"
                  style={{ color: active ? "#00E5FF" : "#6b7280" }}
                  aria-current={active ? "page" : undefined}>
              <Icon size={20} />
              <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.5rem", letterSpacing: "0.08em" }}>
                {label.split(" ")[0]}
              </span>
            </Link>
          );
        })}
        <button onClick={handleLogout}
                className="flex flex-col items-center gap-1 px-4 py-2 hover:opacity-70 transition-all"
                style={{ color: "#6b7280" }} aria-label="Log out">
          <LogOut size={20} />
          <span style={{ fontFamily: "var(--font-orbitron)", fontSize: "0.5rem" }}>EXIT</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4">
      {/* Top-Left App Brand Header */}
      <div className="mb-6 pt-1 pb-3 border-b border-[#1a1a2e]/80">
        <Link href="/dashboard/missions" className="inline-block hover:opacity-95 transition-opacity" title="Kaizen - Home">
          <KaizenLogo
            size={40}
            layout="horizontal"
            autoPlay={true}
            showWordmark={true}
            showTagline={true}
            taglineText="LIFE RPG"
          />
        </Link>
      </div>

      {/* Status bar */}
      <div className="mb-5 px-2 py-3 rounded"
           style={{ background: "#050507", border: "1px solid #1a1a2e" }}>
        <div className="flex items-center gap-2 mb-1">
          <Wifi size={11} style={{ color: "#00E5FF" }} />
          <span style={{ color: "#00E5FF", fontFamily: "var(--font-orbitron)", fontSize: "0.55rem", letterSpacing: "0.08em" }}>
            CONNECTED
          </span>
        </div>
        <p className="text-xs truncate" style={{ color: "#E9E6FF", fontSize: "0.7rem" }}>
          {profile?.username ?? userEmail}
        </p>
        <p style={{ color: "#8C86B8", fontSize: "0.6rem", fontFamily: "var(--font-orbitron)" }}>
          RANK {profile?.level ?? 1} OPERATIVE
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-5 p-3 rounded" style={{ background: "#050507", border: "1px solid #1a1a2e" }}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p style={{ color: "#8C86B8", fontFamily: "var(--font-orbitron)", fontSize: "0.5rem", letterSpacing: "0.05em" }}>
              NEURAL XP
            </p>
            <p className="font-bold text-sm" style={{ color: "#00E5FF" }}>{profile?.xp ?? 0}</p>
          </div>
          <div>
            <p style={{ color: "#8C86B8", fontFamily: "var(--font-orbitron)", fontSize: "0.5rem", letterSpacing: "0.05em" }}>
              CREDITS
            </p>
            <p className="font-bold text-sm" style={{ color: "#FF2E9A" }}>C{profile?.gold ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1" aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded transition-all"
                  style={{
                    color: active ? "#00E5FF" : "#8C86B8",
                    background: active ? "rgba(0,229,255,0.08)" : "transparent",
                    borderLeft: active ? "2px solid #00E5FF" : "2px solid transparent",
                    fontFamily: "var(--font-orbitron)",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                  }}
                  aria-current={active ? "page" : undefined}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded hover:opacity-70 transition-all mt-4"
              style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.65rem", letterSpacing: "0.08em" }}
              aria-label="Log out of Kaizen">
        <LogOut size={15} />
        DISCONNECT
      </button>

      <p className="text-center mt-3" style={{ color: "#1a1a2e", fontSize: "0.55rem", fontFamily: "var(--font-orbitron)" }}>
        KAIZEN v1.0.0
      </p>
    </div>
  );
}