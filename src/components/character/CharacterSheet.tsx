"use client";

import { motion } from "framer-motion";
import { Flame, Zap, Shield, User } from "lucide-react";
import { ProgressBar, AttributeBar } from "@/components/ui/ProgressBar";
import type { Profile } from "@/types";

interface CharacterSheetProps {
  profile: Profile | null;
  userEmail: string;
}

function xpToNextLevel(level: number) {
  return Math.floor(50 * Math.pow(level, 1.5));
}

function getRankTitle(level: number): string {
  if (level < 5) return "SCRIPT KIDDIE";
  if (level < 10) return "NETRUNNER";
  if (level < 20) return "GHOST OPERATIVE";
  if (level < 35) return "SHADOW BROKER";
  if (level < 50) return "APEX HACKER";
  return "NEURAL GOD";
}

export function CharacterSheet({ profile, userEmail }: CharacterSheetProps) {
  if (!profile) return (
    <div className="text-center py-16" style={{ color: "#6b7280" }}>
      <User size={48} className="mx-auto mb-4 opacity-20" />
      <p style={{ fontFamily: "var(--font-orbitron)" }}>LOADING NEURAL PROFILE...</p>
    </div>
  );

  const nextXp = xpToNextLevel(profile.level);
  const rankTitle = getRankTitle(profile.level);
  const attrs = profile.attributes ?? { strength: 0, intellect: 0, discipline: 0, creativity: 0 };
  const maxAttr = Math.max(100, ...Object.values(attrs));

  const totalMissions = Object.values(attrs).reduce((sum, v) => sum + Math.floor(v / 3), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black" style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
        NEURAL PROFILE
      </h1>

      {/* Identity card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="cyber-card p-6 relative overflow-hidden"
        style={{ border: "1px solid #00ff9f40" }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5"
             style={{ background: "radial-gradient(circle, #00ff9f, transparent)" }} />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded flex items-center justify-center shrink-0"
                 style={{ background: "linear-gradient(135deg, #7928ca20, #00ff9f20)", border: "2px solid #00ff9f40" }}>
              <User size={32} style={{ color: "#00ff9f" }} />
            </div>
            <div>
              <p className="font-black text-xl" style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
                {profile.username ?? userEmail.split("@")[0]}
              </p>
              <p className="text-xs tracking-widest mb-1" style={{ color: "#00ff9f", fontFamily: "var(--font-orbitron)", fontSize: "0.65rem" }}>
                {rankTitle}
              </p>
              <p className="text-xs" style={{ color: "#6b7280", fontSize: "0.7rem" }}>
                {userEmail}
              </p>
            </div>
          </div>

          {/* Rank badge */}
          <div className="text-center shrink-0">
            <div className="w-16 h-16 rounded flex items-center justify-center mb-1"
                 style={{ background: "linear-gradient(135deg, #7928ca, #00ff9f)", boxShadow: "0 0 20px #7928ca40" }}>
              <span className="font-black text-xl" style={{ fontFamily: "var(--font-orbitron)", color: "#0a0a0f" }}>
                {profile.level}
              </span>
            </div>
            <p className="text-xs" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.55rem" }}>
              RANK
            </p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-6">
          <ProgressBar
            value={profile.xp}
            max={nextXp}
            label="NEURAL XP"
          />
          <p className="text-xs mt-1 text-right" style={{ color: "#6b7280", fontSize: "0.65rem" }}>
            {nextXp - profile.xp} XP TO RANK {profile.level + 1}
          </p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "CREDITS", value: `?${profile.gold}`, icon: <Zap size={20} style={{ color: "#ffd700" }} />, color: "#ffd700" },
          {
            label: "STREAK",
            value: `${profile.streak_count}d`,
            icon: <Flame size={20} style={{ color: profile.streak_count > 0 ? "#ff6b6b" : "#6b7280" }} />,
            color: profile.streak_count > 0 ? "#ff6b6b" : "#6b7280",
          },
          { label: "MISSIONS", value: String(totalMissions), icon: <Shield size={20} style={{ color: "#7928ca" }} />, color: "#7928ca" },
        ].map(stat => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="cyber-card p-4 text-center"
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-lg font-black" style={{ fontFamily: "var(--font-orbitron)", color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.55rem" }}>
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Skillset / Attributes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="cyber-card p-6"
      >
        <h2 className="font-bold mb-4 text-sm" style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
          SKILLSET
        </h2>
        <div className="space-y-4">
          {Object.entries(attrs).map(([key, value]) => (
            <AttributeBar key={key} label={key} value={value} max={Math.max(100, maxAttr)} />
          ))}
        </div>
      </motion.div>

      {/* Member since */}
      <p className="text-center text-xs" style={{ color: "#1a1a2e", fontFamily: "var(--font-orbitron)" }}>
        OPERATIVE SINCE {new Date(profile.created_at).toLocaleDateString()}
      </p>
    </div>
  );
}
