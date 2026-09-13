"use client";

import { motion } from "framer-motion";
import { Trophy, Trash2, Clock } from "lucide-react";
import type { GoalWithProgress } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  strength:   "#ff6b6b",
  intellect:  "#7928ca",
  discipline: "#00ff9f",
  creativity: "#ffd700",
};

const CATEGORY_LABELS: Record<string, string> = {
  strength:   "STRENGTH",
  intellect:  "INTELLECT",
  discipline: "DISCIPLINE",
  creativity: "CREATIVITY",
};

interface GoalCardProps {
  goal: GoalWithProgress;
  onDelete: (id: string) => void;
}

function ProgressRing({ percentage, color }: { percentage: number; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percentage / 100) * circ;

  return (
    <svg width={88} height={88} viewBox="0 0 88 88" aria-hidden="true">
      {/* Track */}
      <circle cx={44} cy={44} r={r} fill="none" stroke="#1a1a2e" strokeWidth={8} />
      {/* Fill */}
      <motion.circle
        cx={44} cy={44} r={r}
        fill="none"
        stroke={percentage >= 100 ? "#ffd700" : color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        transform="rotate(-90 44 44)"
        style={{
          filter: `drop-shadow(0 0 6px ${percentage >= 100 ? "#ffd700" : color}80)`,
        }}
      />
      {/* Percentage text */}
      <text
        x={44} y={44}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight="bold"
        fill={percentage >= 100 ? "#ffd700" : color}
        style={{ fontFamily: "var(--font-orbitron)" }}
      >
        {percentage}%
      </text>
    </svg>
  );
}

function daysLeft(periodEnd: string): number {
  const end = new Date(periodEnd);
  const now = new Date();
  end.setHours(23, 59, 59);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
  const color = CATEGORY_COLORS[goal.category] ?? "#00ff9f";
  const isAchieved = goal.status === "achieved";
  const isExpired  = goal.status === "expired";
  const days = daysLeft(goal.period_end);

  const borderColor = isAchieved ? "#ffd700" : isExpired ? "#2a2a3a" : `${color}40`;
  const bgGlow = isAchieved ? "rgba(255,215,0,0.04)" : "transparent";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="cyber-card p-5"
      style={{ border: `1px solid ${borderColor}`, background: `#0a0a0f`, boxShadow: isAchieved ? `0 0 24px #ffd70020` : undefined }}
      aria-label={`Goal: ${goal.title}`}
    >
      <div className="flex gap-4 items-start">
        {/* Progress ring */}
        <div className="shrink-0">
          <ProgressRing percentage={goal.percentage} color={color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="font-bold text-sm truncate"
              style={{ fontFamily: "var(--font-orbitron)", color: isExpired ? "#6b7280" : "#e0e0e0" }}
            >
              {goal.title}
            </h3>
            {!isAchieved && (
              <button
                onClick={() => onDelete(goal.id)}
                className="shrink-0 hover:opacity-70 transition-opacity"
                aria-label={`Delete goal ${goal.title}`}
              >
                <Trash2 size={14} style={{ color: "#6b7280" }} />
              </button>
            )}
          </div>

          {/* Category badge */}
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-2"
            style={{
              fontFamily: "var(--font-orbitron)",
              background: `${color}15`,
              color: isExpired ? "#6b7280" : color,
              fontSize: "0.6rem",
            }}
          >
            {CATEGORY_LABELS[goal.category]}
          </span>

          {/* Progress text */}
          <p className="text-xs mb-1" style={{ color: "#6b7280" }}>
            <span style={{ color: isExpired ? "#6b7280" : "#e0e0e0", fontWeight: 600 }}>
              {goal.progress.toFixed(goal.progress % 1 === 0 ? 0 : 1)}
            </span>
            {" / "}
            {goal.target_value}
            {goal.metric_unit ? ` ${goal.metric_unit}` : ""}
          </p>

          {/* Reward text — always visible */}
          <div
            className="flex items-start gap-1.5 mt-2 p-2 rounded"
            style={{ background: isAchieved ? "#ffd70010" : "#ffffff06", border: `1px solid ${isAchieved ? "#ffd70030" : "#ffffff0a"}` }}
          >
            <Trophy
              size={12}
              className="shrink-0 mt-0.5"
              style={{ color: isAchieved ? "#ffd700" : "#6b7280" }}
            />
            <p className="text-xs" style={{ color: isAchieved ? "#ffd700" : "#8b8fa3" }}>
              {isAchieved ? (
                <><strong>REWARD UNLOCKED:</strong> {goal.reward_text}</>
              ) : goal.reward_text}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-2 flex items-center gap-1" style={{ color: "#6b7280" }}>
            <Clock size={11} />
            <span className="text-xs" style={{ fontSize: "0.65rem" }}>
              {isAchieved
                ? "ACHIEVED"
                : isExpired
                ? "NOT REACHED THIS TIME"
                : days === 0
                ? "ENDS TODAY"
                : `${days}d remaining`}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
