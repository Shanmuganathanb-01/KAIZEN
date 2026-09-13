"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Trash2, Loader2, Clock } from "lucide-react";
import type { Task } from "@/types";

interface MissionCardProps {
  task: Task;
  onComplete: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const categoryConfig: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  strength:   { label: "STRENGTH",   color: "#ff003c", bg: "#ff003c20", emoji: "ZAP" },
  intellect:  { label: "INTELLECT",  color: "#00d4ff", bg: "#00d4ff20", emoji: "BRAIN" },
  discipline: { label: "DISCIPLINE", color: "#00ff9f", bg: "#00ff9f20", emoji: "TARGET" },
  creativity: { label: "CREATIVITY", color: "#ffd700", bg: "#ffd70020", emoji: "STAR" },
};

const difficultyConfig: Record<number, { label: string; color: string; bars: string }> = {
  1: { label: "GHOST",    color: "#00ff9f", bars: "I--" },
  2: { label: "OPERATOR", color: "#ffd700", bars: "II-" },
  3: { label: "LEGEND",   color: "#ff003c", bars: "III" },
};

export function MissionCard({ task, onComplete, onDelete }: MissionCardProps) {
  const [completing, setCompleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [optimisticDone, setOptimisticDone] = useState(false);

  const isDone = task.status === "completed" || optimisticDone;
  const cat = categoryConfig[task.category] ?? categoryConfig.discipline;
  const diff = difficultyConfig[task.difficulty] ?? difficultyConfig[1];

  async function handleComplete() {
    if (isDone || completing) return;
    setOptimisticDone(true);
    setCompleting(true);
    try {
      await onComplete(task.id);
    } catch {
      setOptimisticDone(false);
    } finally {
      setCompleting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try { await onDelete(task.id); } finally { setDeleting(false); }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDone ? 0.6 : 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="cyber-card p-4 relative overflow-hidden"
      style={{ border: "1px solid #1a1a2e" }}
    >
      {isDone && (
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 10px, #00ff9f05 10px, #00ff9f05 11px)" }} />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-tight mb-2"
             style={{ color: isDone ? "#6b7280" : "#e0e0e0", textDecoration: isDone ? "line-through" : "none" }}>
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="cyber-tag rounded"
                  style={{ background: cat.bg, color: cat.color, fontSize: "0.6rem" }}>
              [{cat.emoji}] {cat.label}
            </span>
            <span className="cyber-tag rounded"
                  style={{ color: diff.color, fontSize: "0.65rem" }}>
              {diff.bars} {diff.label}
            </span>
            <span className="text-xs" style={{ color: "#6b7280", fontSize: "0.65rem" }}>
              +{task.difficulty * 15} XP / +B{task.difficulty * 5}
            </span>
          </div>
          {isDone && task.completed_at && (
            <p className="mt-2 text-xs flex items-center gap-1" style={{ color: "#6b7280", fontSize: "0.6rem" }}>
              <Clock size={10} />
              {new Date(task.completed_at).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isDone && (
            <button
              id={`complete-${task.id}`}
              onClick={handleComplete}
              disabled={completing || isDone}
              className="btn-cyber btn-cyber-filled"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.65rem" }}
              aria-label={`Complete mission: ${task.title}`}
            >
              {completing ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={12} />
                  EXECUTE
                </>
              )}
            </button>
          )}
          {isDone && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "#00ff9f" }}>
              <CheckCircle2 size={14} />
              DONE
            </span>
          )}
          <button
            id={`delete-${task.id}`}
            onClick={handleDelete}
            disabled={deleting}
            className="btn-cyber btn-cyber-danger"
            style={{ padding: "0.4rem 0.5rem" }}
            aria-label={`Delete mission: ${task.title}`}
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          </button>
        </div>
      </div>
    </motion.li>
  );
}