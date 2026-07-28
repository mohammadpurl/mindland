"use client";

/**
 * XPBar — Client island for the animated XP progress bar.
 *
 * Animates width 0% → percent% when the bar scrolls into view.
 * Everything around it (card shell, labels) stays server-rendered.
 */

import { motion } from "framer-motion";

interface XPBarProps {
  percent: number; /* 0–100 */
}

export function XPBar({ percent }: XPBarProps) {
  return (
    <div
      className="h-2 rounded-full"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
        initial={{ width: "0%" }}
        whileInView={{ width: `${percent}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />
    </div>
  );
}
