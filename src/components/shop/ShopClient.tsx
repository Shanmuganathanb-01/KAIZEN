"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2, CheckCircle, Lock } from "lucide-react";
import { Toast, useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import type { ShopItem } from "@/types";

interface ShopItemWithOwned extends ShopItem { owned: boolean; }

interface ShopClientProps {
  items: ShopItemWithOwned[];
  gold: number;
}

const typeConfig: Record<string, { label: string; color: string; bg: string }> = {
  badge:  { label: "BADGE",  color: "#00ff9f", bg: "#00ff9f20" },
  frame:  { label: "FRAME",  color: "#7928ca", bg: "#7928ca20" },
  banner: { label: "BANNER", color: "#ffd700", bg: "#ffd70020" },
};

async function getAuthHeaders() {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    };
  } catch {
    return { "Content-Type": "application/json" };
  }
}

export function ShopClient({ items, gold: initialGold }: ShopClientProps) {
  const [gold, setGold] = useState(initialGold);
  const [inventory, setInventory] = useState(new Set(items.filter(i => i.owned).map(i => i.id)));
  const [loading, setLoading] = useState<string | null>(null);
  const { toasts, addToast, dismissToast } = useToast();

  async function handlePurchase(item: ShopItemWithOwned) {
    if (inventory.has(item.id) || gold < item.cost) return;
    setLoading(item.id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch("/api/shop/purchase", {
        method: "POST",
        headers,
        body: JSON.stringify({ item_id: item.id }),
      });
      if (res.status === 401) {
        window.location.href = "/login?error=Session+expired.+Please+log+in+again.";
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        addToast(json.error ?? "Purchase failed", "error");
      } else {
        setGold(g => g - item.cost);
        setInventory(prev => new Set([...prev, item.id]));
        addToast(`${item.name} acquired`, "success");
      }
    } catch {
      addToast("Network error", "error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black mb-1"
              style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
            BLACK MARKET
          </h1>
          <p className="text-xs" style={{ color: "#6b7280" }}>
            {'>'} SPEND YOUR HARD-EARNED CREDITS ON COSMETICS
          </p>
        </div>
        <div className="cyber-card px-4 py-2 flex items-center gap-2">
          <span className="text-xs" style={{ color: "#6b7280", fontFamily: "var(--font-orbitron)", fontSize: "0.6rem" }}>BALANCE</span>
          <span className="font-black text-lg" style={{ color: "#ffd700", fontFamily: "var(--font-orbitron)" }}>?{gold}</span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" style={{ color: "#7928ca" }} />
          <p style={{ fontFamily: "var(--font-orbitron)", color: "#6b7280" }}>MARKET OFFLINE</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, i) => {
            const owned = inventory.has(item.id);
            const canAfford = gold >= item.cost;
            const tc = typeConfig[item.type] ?? typeConfig.badge;
            const isLoading = loading === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="cyber-card p-5 relative overflow-hidden"
                style={{ border: owned ? "1px solid #00ff9f40" : "1px solid #1a1a2e", opacity: !owned && !canAfford ? 0.6 : 1 }}
              >
                {/* Type badge */}
                <span className="cyber-tag rounded mb-3 inline-block"
                      style={{ background: tc.bg, color: tc.color, fontSize: "0.6rem" }}>
                  {tc.label}
                </span>

                <h3 className="font-bold text-sm mb-1"
                    style={{ fontFamily: "var(--font-orbitron)", color: "#e0e0e0" }}>
                  {item.name}
                </h3>
                <p className="text-xs mb-4" style={{ color: "#6b7280", lineHeight: 1.5 }}>
                  {item.description ?? "A rare cosmetic upgrade for your neural profile."}
                </p>

                <div className="flex items-center justify-between">
                  <span className="font-black text-lg" style={{ fontFamily: "var(--font-orbitron)", color: "#ffd700" }}>
                    ?{item.cost}
                  </span>
                  {owned ? (
                    <span className="flex items-center gap-2 text-xs font-bold"
                          style={{ color: "#00ff9f", fontFamily: "var(--font-orbitron)", fontSize: "0.65rem" }}>
                      <CheckCircle size={14} /> INSTALLED
                    </span>
                  ) : (
                    <button
                      id={`buy-${item.id}`}
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford || isLoading}
                      className="btn-cyber"
                      style={{
                        borderColor: canAfford ? "#ffd700" : "#1a1a2e",
                        color: canAfford ? "#ffd700" : "#6b7280",
                        padding: "0.4rem 0.875rem",
                        fontSize: "0.65rem",
                      }}
                      aria-label={`Purchase ${item.name} for ${item.cost} credits`}
                    >
                      {isLoading ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : !canAfford ? (
                        <><Lock size={12} /> INSUFFICIENT</>
                      ) : (
                        "ACQUIRE"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
