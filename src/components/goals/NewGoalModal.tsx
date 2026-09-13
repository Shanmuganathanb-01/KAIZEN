"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Loader2 } from "lucide-react";

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    target_value: number;
    metric_unit: string;
    period_start: string;
    period_end: string;
    reward_text: string;
  }) => Promise<void>;
}

const PROTOCOLS = [
  { value: "strength",   label: "STRENGTH",   emoji: "⚡", desc: "Physical / endurance" },
  { value: "intellect",  label: "INTELLECT",  emoji: "🧠", desc: "Learning / research" },
  { value: "discipline", label: "DISCIPLINE", emoji: "🎯", desc: "Habits / consistency" },
  { value: "creativity", label: "CREATIVITY", emoji: "✦", desc: "Art / innovation" },
];

function getWeekBounds() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().split("T")[0],
    end:   sunday.toISOString().split("T")[0],
  };
}

export function NewGoalModal({ isOpen, onClose, onSubmit }: NewGoalModalProps) {
  const week = getWeekBounds();
  const [title, setTitle]           = useState("");
  const [category, setCategory]     = useState("discipline");
  const [targetValue, setTargetValue] = useState("");
  const [metricUnit, setMetricUnit] = useState("");
  const [periodStart, setPeriodStart] = useState(week.start);
  const [periodEnd, setPeriodEnd]   = useState(week.end);
  const [rewardText, setRewardText] = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const w = getWeekBounds();
      setTitle(""); setCategory("discipline"); setTargetValue(""); setMetricUnit("");
      setPeriodStart(w.start); setPeriodEnd(w.end); setRewardText(""); setError(null);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Goal title cannot be empty"); return; }
    if (!targetValue || Number(targetValue) <= 0) { setError("Target value must be greater than 0"); return; }
    if (!rewardText.trim()) { setError("Describe your reward"); return; }
    if (periodEnd < periodStart) { setError("End date must be after start date"); return; }

    setLoading(true); setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        target_value: Number(targetValue),
        metric_unit: metricUnit.trim(),
        period_start: periodStart,
        period_end: periodEnd,
        reward_text: rewardText.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create goal");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    background: "#0a0a0f",
    border: "1px solid #1a1a2e",
    borderRadius: 6,
    color: "#e0e0e0",
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
  };

  const labelStyle = {
    display: "block" as const,
    fontSize: 11,
    marginBottom: 6,
    color: "#6b7280",
    fontFamily: "var(--font-orbitron)",
    letterSpacing: "0.08em",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-goal-title"
        >
          <motion.div
            className="cyber-card w-full max-w-lg p-6 overflow-y-auto"
            style={{ border: "1px solid #ffd70040", maxHeight: "90vh" }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Target size={18} style={{ color: "#ffd700" }} />
                <h2
                  id="new-goal-title"
                  className="font-bold text-lg"
                  style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}
                >
                  NEW GOAL
                </h2>
              </div>
              <button onClick={onClose} className="hover:opacity-70 transition-opacity" aria-label="Close">
                <X size={20} style={{ color: "#6b7280" }} />
              </button>
            </div>

            {error && (
              <div
                className="p-2 mb-4 text-xs rounded"
                style={{ background: "#ff003c10", border: "1px solid #ff003c40", color: "#ff003c" }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="goal-title" style={labelStyle}>GOAL TITLE *</label>
                <input
                  id="goal-title"
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. Cardio goal this week"
                  maxLength={120}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>PROTOCOL (WHICH STAT COUNTS)</label>
                <div className="grid grid-cols-2 gap-2">
                  {PROTOCOLS.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setCategory(p.value)}
                      className="flex items-start gap-2 p-3 rounded text-left transition-all"
                      style={{
                        border: category === p.value ? "1px solid #ffd700" : "1px solid #1a1a2e",
                        background: category === p.value ? "#ffd70010" : "#0a0a0f",
                      }}
                      aria-pressed={category === p.value}
                    >
                      <span>{p.emoji}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ fontFamily: "var(--font-orbitron)", color: category === p.value ? "#ffd700" : "#e0e0e0", fontSize: "0.65rem" }}>
                          {p.label}
                        </p>
                        <p className="text-xs" style={{ color: "#6b7280", fontSize: "0.65rem" }}>{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target + unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="goal-target" style={labelStyle}>TARGET AMOUNT *</label>
                  <input
                    id="goal-target"
                    type="number"
                    min="0.1"
                    step="any"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    style={inputStyle}
                    placeholder="20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goal-unit" style={labelStyle}>UNIT (OPTIONAL)</label>
                  <input
                    id="goal-unit"
                    type="text"
                    value={metricUnit}
                    onChange={(e) => setMetricUnit(e.target.value)}
                    style={inputStyle}
                    placeholder="km, pages, hrs..."
                    maxLength={20}
                  />
                </div>
              </div>

              {/* Date range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="goal-start" style={labelStyle}>FROM *</label>
                  <input
                    id="goal-start"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="goal-end" style={labelStyle}>TO *</label>
                  <input
                    id="goal-end"
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                    required
                  />
                </div>
              </div>

              {/* Reward text */}
              <div>
                <label htmlFor="goal-reward" style={labelStyle}>YOUR REWARD *</label>
                <input
                  id="goal-reward"
                  type="text"
                  value={rewardText}
                  onChange={(e) => setRewardText(e.target.value)}
                  style={inputStyle}
                  placeholder="e.g. One cheat day, Buy that game, Take Friday off..."
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-xs" style={{ color: "#6b7280", fontSize: "0.65rem" }}>
                  // What do you get when you hit the target? You define it.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-cyber flex-1 justify-center"
                  style={{ borderColor: "#1a1a2e", color: "#6b7280" }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cyber flex-1 justify-center"
                  style={{ borderColor: "#ffd700", color: "#ffd700", background: "#ffd70010" }}
                >
                  {loading ? <><Loader2 size={14} className="animate-spin" /> SAVING...</> : <><Target size={14} /> SET GOAL</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
