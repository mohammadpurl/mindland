"use client";

/**
 * AnimateIn — Client island for mount (on-load) entrance animations.
 *
 * Use instead of motion.div with `animate` when the parent is a Server Component.
 * The children are server-rendered HTML; only the motion wrapper ships as JS.
 *
 * @example
 *   <AnimateIn delay={0.1}>
 *     <h1>دو دنیا. یک پلتفرم.</h1>   ← server-rendered, zero JS cost
 *   </AnimateIn>
 */

import { motion } from "framer-motion";
import type { ReactNode, CSSProperties } from "react";

interface AnimateInProps {
  children:   ReactNode;
  delay?:     number;
  className?: string;
  style?:     CSSProperties;
  y?:         number;
  x?:         number;
}

export function AnimateIn({
  children,
  delay     = 0,
  className,
  style,
  y         = 24,
  x         = 0,
}: AnimateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
