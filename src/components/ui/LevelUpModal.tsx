"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

function Particle({ index }: { index: number }) {
  const angle = (index / 20) * 360;
  const distance = 80 + Math.random() * 80;
  const tx = Math.cos((angle * Math.PI) / 180) * distance;
  const ty = Math.sin((angle * Math.PI) / 180) * distance;
  const colors = ["#00ff9f", "#7928ca", "#00d4ff", "#ffd700", "#ff003c"];
  const color = colors[index % colors.length];
  const size = 4 + Math.random() * 6;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        top: "50%",
        left: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
      transition={{ duration: 0.8 + Math.random() * 0.6, ease: "easeOut", delay: Math.random() * 0.2 }}
    />
  );
}

export function LevelUpModal({ isOpen, oldLevel, newLevel, onClose }: LevelUpModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus();
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Level up celebration"
          onClick={onClose}
        >
          <motion.div
            className="relative cyber-card p-10 text-center max-w-sm mx-4"
            style={{ border: "2px solid #00ff9f", boxShadow: "0 0 40px #00ff9f40, 0 0 80px #00ff9f20" }}
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => <Particle key={i} index={i} />)}
            </div>

            {/* Close button */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-3 right-3 hover:opacity-70 transition-opacity"
              aria-label="Close level up modal"
            >
              <X size={18} style={{ color: "#6b7280" }} />
            </button>

            {/* Icon */}
            <motion.div
              className="flex items-center justify-center mx-auto mb-4 w-20 h-20 rounded-full"
              style={{ background: "linear-gradient(135deg, #00ff9f20, #7928ca20)", border: "2px solid #00ff9f" }}
              animate={{ rotate: [0, 10, -10, 10, 0], boxShadow: ["0 0 20px #00ff9f40", "0 0 40px #00ff9f80", "0 0 20px #00ff9f40"] }}
              transition={{ duration: 0.6, delay: 0.3, boxShadow: { duration: 1.5, repeat: Infinity } }}
            >
              <Zap size={40} style={{ color: "#00ff9f" }} />
            </motion.div>

            {/* Text */}
            <motion.p
              className="text-xs tracking-widest mb-2"
              style={{ color: "#00ff9f", fontFamily: "var(--font-orbitron)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {"// RANK UPGRADED"}
            </motion.p>

            <motion.h2
              className="text-4xl font-black mb-1"
              style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              RANK {newLevel}
            </motion.h2>

            <motion.p
              className="text-sm mb-6"
              style={{ color: "#6b7280" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              PROMOTED FROM RANK {oldLevel}
            </motion.p>

            <motion.div
              className="text-xs"
              style={{ color: "#00ff9f", fontFamily: "var(--font-orbitron)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              NEURAL PATHWAYS EXPANDED
            </motion.div>

            {/* Scanning line effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(transparent, #00ff9f10, transparent)", height: "30%" }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
