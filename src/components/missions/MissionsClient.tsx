"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Terminal, Zap } from "lucide-react";
import { MissionCard } from "@/components/missions/MissionCard";
import { NewMissionModal } from "@/components/missions/NewMissionModal";
import { MissionCardSkeleton } from "@/components/ui/Skeleton";
import { Toast, useToast } from "@/components/ui/Toast";
import { LevelUpModal } from "@/components/ui/LevelUpModal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { GoalAchievedModal } from "@/components/goals/GoalAchievedModal";
import type { Task, Profile, CompleteTaskResponse, GoalWithProgress } from "@/types";

interface MissionsClientProps {
  initialTasks: Task[];
  initialProfile: Profile;
}

function xpToNextLevel(level: number) {
  return Math.floor(50 * Math.pow(level, 1.5));
}

export function MissionsClient({ initialTasks, initialProfile }: MissionsClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [tab, setTab] = useState<"pending" | "completed">("pending");
  const [modalOpen, setModalOpen] = useState(false);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ old: 1, new: 1 });
  const [xpAnimation, setXpAnimation] = useState<number | null>(null);
  const [goalAchievedQueue, setGoalAchievedQueue] = useState<GoalWithProgress[]>([]);
  const { toasts, addToast, dismissToast } = useToast();

  const pending = tasks.filter(t => t.status === "pending");
  const completed = tasks.filter(t => t.status === "completed");
  const displayed = tab === "pending" ? pending : completed;

  async function handleCreate(data: { title: string; category: string; difficulty: number }) {
    const res = await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? "Failed to create mission");
    setTasks(prev => [json.task, ...prev]);
    addToast("Mission deployed successfully", "success");
  }

  const handleComplete = useCallback(async (taskId: string) => {
    const now = new Date().toISOString();
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: "completed" as const, completed_at: now } : t
    ));

    try {
      const res = await fetch(`/api/missions/${taskId}/complete`, { method: "POST" });
      const json: CompleteTaskResponse & { error?: string } = await res.json();

      if (!res.ok) {
        setTasks(prev => prev.map(t =>
          t.id === taskId ? { ...t, status: "pending" as const, completed_at: null } : t
        ));
        addToast(json.error ?? "Mission failed", "error");
        return;
      }

      setXpAnimation(json.xp_gained);
      setTimeout(() => setXpAnimation(null), 2000);

      const oldLevel = profile.level;
      setProfile(json.profile);

      if (json.leveled_up) {
        setLevelUpData({ old: oldLevel, new: json.new_level });
        setLevelUpOpen(true);
      } else {
        addToast(`+${json.xp_gained} Neural XP / +B${json.gold_gained} Credits`, "success");
      }

      // Trigger goal celebration if any goals were achieved
      if (json.achievedGoals && json.achievedGoals.length > 0) {
        setGoalAchievedQueue(json.achievedGoals);
      }
    } catch {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: "pending" as const, completed_at: null } : t
      ));
      addToast("Network error - mission rolled back", "error");
    }
  }, [profile.level, addToast]);

  const handleDelete = useCallback(async (taskId: string) => {
    const res = await fetch(`/api/missions/${taskId}`, { method: "DELETE" });
    if (!res.ok) {
      addToast("Failed to delete mission", "error");
      return;
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
    addToast("Mission terminated", "info");
  }, [addToast]);

  const nextLevelXp = xpToNextLevel(profile.level);

  return (
    <>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black mb-1"
              style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
            ACTIVE MISSIONS
          </h1>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            &gt; {pending.length} ACTIVE / {completed.length} COMPLETED
          </p>
        </div>
        <button
          id="new-mission-btn"
          onClick={() => setModalOpen(true)}
          className="btn-cyber btn-cyber-filled shrink-0"
          aria-label="Create new mission"
        >
          <Plus size={14} />
          NEW MISSION
        </button>
      </div>

      <div className="cyber-card p-4 mb-6">
        <div className="flex items-center justify-between mb-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold"
                  style={{ fontFamily: "var(--font-orbitron)", color: "#00ff9f", fontSize: "0.65rem" }}>
              RANK {profile.level}
            </span>
            <span className="text-xs" style={{ color: "#6b7280", fontSize: "0.65rem" }}>
              {profile.xp} / {nextLevelXp} XP
            </span>
          </div>
          <div className="flex items-center gap-3 relative">
            {xpAnimation !== null && (
              <motion.span
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.5 }}
                className="text-xs font-bold"
                style={{ color: "#00ff9f", position: "absolute", right: "100%" }}
              >
                +{xpAnimation} XP
              </motion.span>
            )}
            <span className="text-xs font-bold" style={{ color: "#ffd700", fontSize: "0.75rem" }}>
              B{profile.gold}
            </span>
            <span className="text-xs flex items-center gap-1"
                  style={{ color: profile.streak_count > 0 ? "#ff6b6b" : "#6b7280" }}>
              F{profile.streak_count}
            </span>
          </div>
        </div>
        <ProgressBar value={profile.xp} max={nextLevelXp} showText={false} />
      </div>

      <div className="flex border-b mb-6" style={{ borderColor: "#1a1a2e" }} role="tablist">
        {(["pending", "completed"] as const).map(t => (
          <button
            key={t}
            id={`tab-${t}`}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-bold tracking-wider transition-all ${tab === t ? "tab-active" : "tab-inactive"}`}
            style={{ fontFamily: "var(--font-orbitron)" }}
            aria-selected={tab === t}
            role="tab"
          >
            {t === "pending" ? "ACTIVE" : "COMPLETED"}
            <span className="ml-2 px-1.5 py-0.5 rounded text-xs"
                  style={{ background: "#1a1a2e", color: "#6b7280", fontSize: "0.6rem" }}>
              {t === "pending" ? pending.length : completed.length}
            </span>
          </button>
        ))}
      </div>

      <ul className="space-y-3" role="list" aria-label={`${tab} missions`}>
        <AnimatePresence mode="popLayout">
          {displayed.length === 0 ? (
            <motion.li
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-16 text-center"
            >
              <Terminal size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#00ff9f" }} />
              <p className="text-sm font-bold mb-2"
                 style={{ fontFamily: "var(--font-orbitron)", color: "#6b7280" }}>
                {tab === "pending" ? "NO ACTIVE MISSIONS" : "NO COMPLETED MISSIONS"}
              </p>
              <p className="text-xs" style={{ color: "#1a1a2e" }}>
                {tab === "pending"
                  ? "// DEPLOY A NEW MISSION TO BEGIN YOUR ASCENT"
                  : "// COMPLETE MISSIONS TO FILL THE ARCHIVE"}
              </p>
              {tab === "pending" && (
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn-cyber mt-6 mx-auto"
                  style={{ borderColor: "#00ff9f40" }}
                >
                  <Zap size={14} />
                  INITIALIZE FIRST MISSION
                </button>
              )}
            </motion.li>
          ) : (
            displayed.map(task => (
              <MissionCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onDelete={handleDelete}
              />
            ))
          )}
        </AnimatePresence>
      </ul>

      <NewMissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <LevelUpModal
        isOpen={levelUpOpen}
        oldLevel={levelUpData.old}
        newLevel={levelUpData.new}
        onClose={() => setLevelUpOpen(false)}
      />

      <GoalAchievedModal
        isOpen={goalAchievedQueue.length > 0}
        rewardText={goalAchievedQueue[0]?.reward_text ?? ""}
        goalTitle={goalAchievedQueue[0]?.title ?? ""}
        onClose={() => setGoalAchievedQueue((q) => q.slice(1))}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}