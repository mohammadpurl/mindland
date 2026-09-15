"use client";

/**
 * DS §10 Animation System — Scroll Reveal utilities
 *
 * Reveal     : whileInView opacity 0→1, y 20→0, 0.6s
 * Stagger    : staggerChildren 0.12s
 * HoverCard  : whileHover scale 1.02, y -4 (spring)
 * MotionCard : configurable hover — for server-component card shells
 *
 * Content visibility never depends on the scroll trigger firing:
 *   - Users with `prefers-reduced-motion` get the final state immediately,
 *     with no motion wrapper animating opacity/transform at all.
 *   - Otherwise a short fallback timer force-shows the content shortly
 *     after mount even if the viewport IntersectionObserver never fires
 *     (backgrounded tab, headless crawler, in-view on first paint, etc.).
 *     When forced, the element snaps to the visible state and the
 *     `whileInView` trigger is dropped so framer-motion cannot hold it
 *     back at the initial (hidden) state.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

/** Safety net: guarantee visibility this long after mount even without a scroll trigger. */
const REVEAL_FALLBACK_MS = 1200;

function useRevealFallback() {
  const [forced, setForced] = useState(false);
  const firedRef = useRef(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!firedRef.current) setForced(true);
    }, REVEAL_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);
  return {
    forced,
    /** call when the real viewport trigger fires, so the fallback timer becomes a no-op */
    markFired: () => {
      firedRef.current = true;
    },
  };
}

/* ── Single scroll reveal ───────────────────────────────── */
interface RevealProps {
  children:   ReactNode;
  delay?:     number;
  className?: string;
  style?:     CSSProperties;
}

export function Reveal({ children, delay = 0, className, style }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const { forced, markFired } = useRevealFallback();

  if (reduceMotion) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const visible = { opacity: 1, y: 0 };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      {...(forced
        ? { animate: visible }
        : { whileInView: visible, onViewportEnter: markFired, viewport: { once: true, margin: "-80px" } })}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
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
  const reduceMotion = useReducedMotion();
  const { forced, markFired } = useRevealFallback();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      {...(forced
        ? { animate: "visible" }
        : { whileInView: "visible", onViewportEnter: markFired, viewport: { once: true, margin: "-80px" } })}
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
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

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
