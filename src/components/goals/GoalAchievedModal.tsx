"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

interface GoalAchievedModalProps {
  isOpen: boolean;
  rewardText: string;
  goalTitle: string;
  onClose: () => void;
}

function Particle({ index }: { index: number }) {
  const angle = (index / 24) * 360;
  const distance = 70 + Math.random() * 100;
  const tx = Math.cos((angle * Math.PI) / 180) * distance;
  const ty = Math.sin((angle * Math.PI) / 180) * distance;
  const colors = ["#ffd700", "#ff2e9a", "#ff9f43", "#ffffff", "#ffd700"];
  const color = colors[index % colors.length];
  const size = 4 + Math.random() * 7;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size, height: size,
        background: color,
        top: "50%", left: "50%",
        marginLeft: -size / 2, marginTop: -size / 2,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
      transition={{ duration: 0.9 + Math.random() * 0.6, ease: "easeOut", delay: Math.random() * 0.3 }}
    />
  );
}

export function GoalAchievedModal({ isOpen, rewardText, goalTitle, onClose }: GoalAchievedModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
      const timer = setTimeout(onClose, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.88)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Goal achieved celebration"
          onClick={onClose}
        >
          <motion.div
            className="relative cyber-card p-10 text-center max-w-sm mx-4"
            style={{
              border: "2px solid #ffd700",
              boxShadow: "0 0 40px #ffd70050, 0 0 80px #ff2e9a20",
            }}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(24)].map((_, i) => <Particle key={i} index={i} />)}
            </div>

            {/* Close */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-3 right-3 hover:opacity-70 transition-opacity"
              aria-label="Close"
            >
              <X size={18} style={{ color: "#6b7280" }} />
            </button>

            {/* Icon */}
            <motion.div
              className="flex items-center justify-center mx-auto mb-4 w-20 h-20 rounded-full"
              style={{ background: "linear-gradient(135deg, #ffd70020, #ff2e9a20)", border: "2px solid #ffd700" }}
              animate={{
                rotate: [0, 8, -8, 8, 0],
                boxShadow: ["0 0 20px #ffd70040", "0 0 44px #ffd700a0", "0 0 20px #ffd70040"],
              }}
              transition={{ duration: 0.6, delay: 0.3, boxShadow: { duration: 1.6, repeat: Infinity } }}
            >
              <Trophy size={40} style={{ color: "#ffd700" }} />
            </motion.div>

            {/* Labels */}
            <motion.p
              className="text-xs tracking-widest mb-1"
              style={{ color: "#ffd700", fontFamily: "var(--font-orbitron)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              // GOAL COMPLETE
            </motion.p>

            <motion.h2
              className="text-xl font-black mb-2"
              style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {goalTitle}
            </motion.h2>

            <motion.div
              className="p-3 rounded mb-4"
              style={{ background: "#ffd70012", border: "1px solid #ffd70030" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <p className="text-sm font-bold" style={{ color: "#ffd700" }}>
                {rewardText} is yours.
              </p>
            </motion.div>

            <motion.p
              className="text-xs"
              style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              YOU EARNED IT
            </motion.p>

            {/* Scan line */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(transparent, #ffd70008, transparent)", height: "30%" }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
