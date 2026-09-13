import Link from "next/link";
import { KaizenLogo } from "@/components/ui/KaizenLogo";
import { CertifiedStatement } from "@/components/ui/CertifiedStatement";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
         style={{ background: "#050507" }}>
      {/* Top-Left App Name & Logo */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <Link href="/login" className="inline-block hover:opacity-90 transition-opacity" title="KAIZEN">
          <KaizenLogo
            size={36}
            layout="horizontal"
            autoPlay={true}
            showWordmark={true}
            showTagline={true}
            taglineText="LIFE RPG"
          />
        </Link>
      </div>
      {/* Neon radial glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(70% 50% at 50% 40%, rgba(154,76,255,0.14), transparent 70%)" }} />

      {/* Retro grid horizon */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
           style={{
             height: "42%",
             backgroundImage: "linear-gradient(rgba(255,46,154,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.2) 1px, transparent 1px)",
             backgroundSize: "100% 14%, 8% 100%",
             WebkitMaskImage: "linear-gradient(to top, black, transparent)",
             maskImage: "linear-gradient(to top, black, transparent)",
             transform: "perspective(220px) rotateX(55deg)",
             transformOrigin: "bottom",
             opacity: 0.4,
           }} />

      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px)",
             mixBlendMode: "overlay",
             zIndex: 3,
           }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: "radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)", zIndex: 1 }} />

      <div className="relative z-10 w-full max-w-md px-4 py-8 flex flex-col items-center">
        {children}
        <div className="mt-6 text-center">
          <CertifiedStatement />
        </div>
      </div>
    </div>
  );
}