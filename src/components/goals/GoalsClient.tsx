"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Archive } from "lucide-react";
import { GoalCard } from "./GoalCard";
import { NewGoalModal } from "./NewGoalModal";
import { GoalAchievedModal } from "./GoalAchievedModal";
import { Toast, useToast } from "@/components/ui/Toast";
import type { GoalWithProgress } from "@/types";

interface GoalsClientProps {
  initialGoals: GoalWithProgress[];
}

export function GoalsClient({ initialGoals }: GoalsClientProps) {
  const [goals, setGoals] = useState<GoalWithProgress[]>(initialGoals);
  const [modalOpen, setModalOpen] = useState(false);
  const [achievedModal, setAchievedModal] = useState<GoalWithProgress | null>(null);
  const [tab, setTab] = useState<"active" | "past">("active");
  const { toasts, addToast, dismissToast } = useToast();

  const active = goals.filter((g) => g.status === "active");
  const past   = goals.filter((g) => g.status !== "active");
  const displayed = tab === "active" ? active : past;

  async function handleCreate(data: {
    title: string; category: string; target_value: number;
    metric_unit: string; period_start: string; period_end: string; reward_text: string;
  }) {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Failed to create goal");
    setGoals((prev) => [json.goal, ...prev]);
    addToast("Goal set — now go earn it.", "success");
  }

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
    if (!res.ok) { addToast("Failed to delete goal", "error"); return; }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    addToast("Goal removed", "info");
  }, [addToast]);

  // Called externally from MissionsClient when achievedGoals comes back from complete endpoint
  // Export so parent can call it — handled via page-level state instead (see GoalsClient usage in page.tsx)

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1
            className="text-2xl font-black mb-1"
            style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}
          >
            GOALS &amp; REWARDS
          </h1>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            &gt; {active.length} ACTIVE / {past.length} PAST
          </p>
        </div>
        <button
          id="new-goal-btn"
          onClick={() => setModalOpen(true)}
          className="btn-cyber shrink-0"
          style={{ borderColor: "#ffd700", color: "#ffd700" }}
          aria-label="Set new goal"
        >
          <Plus size={14} />
          NEW GOAL
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6" style={{ borderColor: "#1a1a2e" }} role="tablist">
        {(["active", "past"] as const).map((t) => (
          <button
            key={t}
            id={`goals-tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-bold tracking-wider transition-all ${tab === t ? "tab-active" : "tab-inactive"}`}
            style={{ fontFamily: "var(--font-orbitron)" }}
            aria-selected={tab === t}
            role="tab"
          >
            {t === "active" ? "ACTIVE" : "PAST"}
            <span
              className="ml-2 px-1.5 py-0.5 rounded text-xs"
              style={{ background: "#1a1a2e", color: "#6b7280", fontSize: "0.6rem" }}
            >
              {t === "active" ? active.length : past.length}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <ul className="space-y-4" role="list" aria-label={`${tab} goals`}>
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 ? (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              {tab === "active" ? (
                <>
                  <Target size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#ffd700" }} />
                  <p className="text-sm font-bold mb-2" style={{ fontFamily: "var(--font-orbitron)", color: "#6b7280" }}>
                    NO ACTIVE GOALS
                  </p>
                  <p className="text-xs mb-6" style={{ color: "#1a1a2e" }}>
                    // SET A TARGET AND DEFINE YOUR OWN REWARD
                  </p>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="btn-cyber mx-auto"
                    style={{ borderColor: "#ffd70040" }}
                  >
                    <Target size={14} />
                    SET FIRST GOAL
                  </button>
                </>
              ) : (
                <>
                  <Archive size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#6b7280" }} />
                  <p className="text-sm font-bold" style={{ fontFamily: "var(--font-orbitron)", color: "#6b7280" }}>
                    NO PAST GOALS
                  </p>
                </>
              )}
            </motion.li>
          ) : (
            displayed.map((goal) => (
              <motion.li key={goal.id} layout>
                <GoalCard goal={goal} onDelete={handleDelete} />
              </motion.li>
            ))
          )}
        </AnimatePresence>
      </ul>

      <NewGoalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <GoalAchievedModal
        isOpen={!!achievedModal}
        rewardText={achievedModal?.reward_text ?? ""}
        goalTitle={achievedModal?.title ?? ""}
        onClose={() => setAchievedModal(null)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
