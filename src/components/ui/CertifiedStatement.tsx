export function CertifiedStatement({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center text-xs font-mono tracking-widest text-zinc-500 select-none ${className}`}
    >
      <span>&copy; KAIZEN</span>
    </div>
  );
}
