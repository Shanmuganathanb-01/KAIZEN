interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
  showText?: boolean;
  height?: number;
}

export function ProgressBar({ value, max, label, color = "linear-gradient(90deg, #00ff9f, #00d4ff)", showText = true, height = 8 }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {(label || showText) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-xs tracking-wider" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}>
              {label}
            </span>
          )}
          {showText && (
            <span className="text-xs" style={{ color: "#e0e0e0" }}>
              {value.toLocaleString()} / {max.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div
        className="progress-track rounded-sm"
        style={{ height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label ?? "Progress"}
      >
        <div
          className="progress-fill rounded-sm"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function AttributeBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const colors: Record<string, string> = {
    strength: "linear-gradient(90deg, #ff003c, #ff6b6b)",
    intellect: "linear-gradient(90deg, #00d4ff, #7928ca)",
    discipline: "linear-gradient(90deg, #00ff9f, #00cc7e)",
    creativity: "linear-gradient(90deg, #ffd700, #ff9f00)",
  };
  const icons: Record<string, string> = {
    strength: "?",
    intellect: "??",
    discipline: "??",
    creativity: "?",
  };
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs flex items-center gap-1 tracking-wider"
              style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}>
          {icons[label.toLowerCase()]} {label.toUpperCase()}
        </span>
        <span className="text-xs font-bold" style={{ color: "#e0e0e0" }}>{value}</span>
      </div>
      <div className="progress-track rounded-sm" style={{ height: 6 }}
           role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}
           aria-label={`${label} attribute`}>
        <div className="progress-fill rounded-sm"
             style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: colors[label.toLowerCase()] ?? "linear-gradient(90deg, #00ff9f, #00d4ff)" }} />
      </div>
    </div>
  );
}
