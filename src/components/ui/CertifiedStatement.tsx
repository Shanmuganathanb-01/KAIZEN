import { ShieldCheck } from "lucide-react";

export function CertifiedStatement({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border backdrop-blur-md transition-all ${className}`}
      style={{
        background: "rgba(10, 12, 18, 0.8)",
        borderColor: "rgba(0, 229, 255, 0.25)",
        color: "#9ca3af",
        boxShadow: "0 0 16px rgba(0, 229, 255, 0.08)",
      }}
    >
      <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: "#00E5FF" }} />
      <span className="tracking-wide text-[11px] sm:text-xs">
        <strong style={{ color: "#e5e7eb" }}>Certified:</strong> Original work created by{" "}
        <span style={{ color: "#00E5FF", fontWeight: 600 }}>Shanmuganathan B</span> for Hackathon evaluation
      </span>
    </div>
  );
}
