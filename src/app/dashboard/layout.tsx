import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/ui/DashboardNav";
import { KaizenLogo } from "@/components/ui/KaizenLogo";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r sticky top-0 h-screen overflow-y-auto"
             style={{ background: "#0f1117", borderColor: "#1a1a2e" }}>
        <DashboardNav profile={profile} userEmail={user.email ?? ""} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen pb-20 md:pb-0" role="main"
            style={{ background: "#0a0a0f" }}>
        {/* Mobile Top Header - App name & logo in top-left */}
        <header className="md:hidden flex items-center justify-between px-4 py-2.5 border-b sticky top-0 z-30"
                style={{ background: "rgba(15, 17, 23, 0.95)", backdropFilter: "blur(12px)", borderColor: "#1a1a2e" }}>
          <Link href="/dashboard/missions" className="inline-block hover:opacity-90 transition-opacity">
            <KaizenLogo size={30} layout="horizontal" autoPlay={true} showWordmark={true} showTagline={false} />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold"
                  style={{ background: "rgba(0, 229, 255, 0.1)", color: "#00E5FF", border: "1px solid rgba(0, 229, 255, 0.3)" }}>
              LVL {profile?.level ?? 1}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold"
                  style={{ background: "rgba(255, 46, 154, 0.1)", color: "#FF2E9A", border: "1px solid rgba(255, 46, 154, 0.3)" }}>
              C{profile?.gold ?? 0}
            </span>
          </div>
        </header>

        <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t z-40"
           style={{ background: "#0f1117", borderColor: "#1a1a2e" }}
           aria-label="Mobile navigation">
        <DashboardNav profile={profile} userEmail={user.email ?? ""} mobile />
      </nav>
    </div>
  );
}
