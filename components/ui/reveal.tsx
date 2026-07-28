"use client";

/**
 * DS §10 Animation System — Scroll Reveal utilities
 *
 * Reveal     : whileInView opacity 0→1, y 20→0, 0.6s
 * Stagger    : staggerChildren 0.12s
 * HoverCard  : whileHover scale 1.02, y -4 (spring)
 * MotionCard : configurable hover — for server-component card shells
 */

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

/* ── Single scroll reveal ───────────────────────────────── */
interface RevealProps {
  children:   ReactNode;
  delay?:     number;
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Stagger container ──────────────────────────────────── */
interface StaggerProps {
  children:  ReactNode;
  className?: string;
  delay?:    number;   /* delay before first child */
  stagger?:  number;   /* DS §10: 0.1–0.2s per child */
}

export function Stagger({
  children,
  className,
  delay   = 0,
  stagger = 0.12,
}: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Stagger item ───────────────────────────────────────── */
export function StaggerItem({
  children,
  className,
}: {
  children:   ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 20 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── HoverCard — fixed hover-lift ───────────────────────── */
export function HoverCard({
  children,
  className,
}: {
  children:   ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── MotionCard — configurable hover for server card shells  */
/**
 * Passes card-specific styles (background, border, boxShadow) as serializable
 * props across the server→client boundary, so the card markup itself stays
 * server-rendered. Only this thin motion wrapper ships as JS.
 */
export function MotionCard({
  children,
  className,
  style,
  hoverY     = -4,
  hoverScale = 1.01,
}: {
  children:    ReactNode;
  className?:  string;
  style?:      CSSProperties;
  hoverY?:     number;
  hoverScale?: number;
}) {
  return (
    <motion.div
      whileHover={{ y: hoverY, scale: hoverScale }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
