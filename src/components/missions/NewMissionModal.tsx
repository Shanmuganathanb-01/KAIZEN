"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; difficulty: number; metric_value?: number | null; metric_unit?: string | null }) => Promise<void>;
}

const PROTOCOLS = [
  { value: "strength", label: "STRENGTH", emoji: "?", desc: "Physical / endurance" },
  { value: "intellect", label: "INTELLECT", emoji: "??", desc: "Learning / research" },
  { value: "discipline", label: "DISCIPLINE", emoji: "??", desc: "Habits / consistency" },
  { value: "creativity", label: "CREATIVITY", emoji: "?", desc: "Art / innovation" },
];

export function NewMissionModal({ isOpen, onClose, onSubmit }: NewMissionModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("discipline");
  const [difficulty, setDifficulty] = useState(1);
  const [metricValue, setMetricValue] = useState("");
  const [metricUnit, setMetricUnit] = useState("");
  const [metricOpen, setMetricOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
      setTitle(""); setCategory("discipline"); setDifficulty(1);
      setMetricValue(""); setMetricUnit(""); setMetricOpen(false); setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Mission title cannot be empty"); return; }
    setLoading(true); setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        difficulty,
        metric_value: metricOpen && metricValue ? Number(metricValue) : null,
        metric_unit: metricOpen && metricUnit.trim() ? metricUnit.trim() : null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create mission");
    } finally {
      setLoading(false);
    }
  }

  const difficultyLabels = ["", "GHOST", "OPERATOR", "LEGEND"];
  const difficultyColors = ["", "#00ff9f", "#ffd700", "#ff003c"];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-mission-title"
        >
          <motion.div
            className="cyber-card w-full max-w-lg p-6"
            style={{ border: "1px solid #7928ca60" }}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 id="new-mission-title" className="font-bold text-lg"
                  style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
                NEW MISSION
              </h2>
              <button onClick={onClose} className="hover:opacity-70 transition-opacity"
                      aria-label="Close new mission modal">
                <X size={20} style={{ color: "#6b7280" }} />
              </button>
            </div>

            {error && (
              <div className="p-2 mb-4 text-xs rounded"
                   style={{ background: "#ff003c10", border: "1px solid #ff003c40", color: "#ff003c" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="mission-title" className="block text-xs mb-2 tracking-wider"
                       style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}>
                  MISSION OBJECTIVE *
                </label>
                <input
                  id="mission-title"
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="cyber-input"
                  placeholder="Describe your objective..."
                  maxLength={200}
                  required
                />
              </div>

              {/* Protocol */}
              <div>
                <label className="block text-xs mb-3 tracking-wider"
                       style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}>
                  PROTOCOL (ATTRIBUTE)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PROTOCOLS.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setCategory(p.value)}
                      className="flex items-start gap-2 p-3 rounded text-left transition-all"
                      style={{
                        border: category === p.value ? "1px solid #7928ca" : "1px solid #1a1a2e",
                        background: category === p.value ? "#7928ca15" : "#0a0a0f",
                      }}
                      aria-pressed={category === p.value}
                    >
                      <span>{p.emoji}</span>
                      <div>
                        <p className="text-xs font-bold" style={{ fontFamily: "var(--font-orbitron)", color: category === p.value ? "#9f46f0" : "#e0e0e0", fontSize: "0.65rem" }}>
                          {p.label}
                        </p>
                        <p className="text-xs" style={{ color: "#6b7280", fontSize: "0.65rem" }}>{p.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs mb-3 tracking-wider"
                       style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}>
                  THREAT LEVEL
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className="flex-1 py-3 rounded font-bold text-xs transition-all"
                      style={{
                        fontFamily: "var(--font-orbitron)",
                        border: difficulty === d ? `1px solid ${difficultyColors[d]}` : "1px solid #1a1a2e",
                        background: difficulty === d ? `${difficultyColors[d]}15` : "#0a0a0f",
                        color: difficulty === d ? difficultyColors[d] : "#6b7280",
                        fontSize: "0.6rem",
                      }}
                      aria-pressed={difficulty === d}
                      aria-label={`Difficulty ${difficultyLabels[d]}`}
                    >
                      {"?".repeat(d)}{"?".repeat(3-d)}
                      <br />{difficultyLabels[d]}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: "#6b7280", fontSize: "0.65rem" }}>
                  Rewards: +{difficulty * 15} Neural XP, +?{difficulty * 5} Credits, +{difficulty * 3} {category.toUpperCase()}
                </p>
              </div>

              {/* Optional metric section */}
              <div>
                <button
                  type="button"
                  onClick={() => setMetricOpen((o) => !o)}
                  className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
                  style={{ color: metricOpen ? "#00ff9f" : "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.65rem" }}
                >
                  <span style={{ fontSize: 10 }}>{metricOpen ? "▼" : "▶"}</span>
                  TRACK A METRIC? (links to goals)
                </button>
                {metricOpen && (
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="metric-value" className="block text-xs mb-1" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.65rem" }}>AMOUNT</label>
                      <input
                        id="metric-value"
                        type="number"
                        min="0"
                        step="any"
                        value={metricValue}
                        onChange={(e) => setMetricValue(e.target.value)}
                        className="cyber-input"
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div>
                      <label htmlFor="metric-unit" className="block text-xs mb-1" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.65rem" }}>UNIT</label>
                      <input
                        id="metric-unit"
                        type="text"
                        value={metricUnit}
                        onChange={(e) => setMetricUnit(e.target.value)}
                        className="cyber-input"
                        placeholder="km, pages, hrs..."
                        maxLength={20}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn-cyber flex-1 justify-center"
                        style={{ borderColor: "#1a1a2e", color: "#6b7280" }}>
                  CANCEL
                </button>
                <button type="submit" disabled={loading} className="btn-cyber btn-cyber-filled flex-1 justify-center">
                  {loading ? <><Loader2 size={14} className="animate-spin" /> UPLOADING...</> : <><Plus size={14} /> DEPLOY MISSION</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
