"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef } from "react";

/* DS §8 Buttons
   - Primary (gradient: 135deg #6C5CE7 → #3B82F6)
   - Secondary (outline)
   - Ghost
   - 44px minimum height
   - border-radius: 12px (rounded-xl)
   - hover scale: 1.02 via Framer Motion spring
*/

type Variant = "primary" | "secondary" | "ghost" | "accent";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    /* DS gradient: 135deg #6C5CE7 → #3B82F6 */
    "bg-hero-gradient text-white font-semibold shadow-glow " +
    "hover:opacity-95 active:opacity-90",
  secondary:
    "border border-primary/30 bg-transparent text-primary font-semibold " +
    "hover:bg-primary/5",
  ghost:
    "text-muted hover:text-foreground-dark hover:bg-bg-soft font-medium",
  accent:
    /* DS Accent: #00FFB2 */
    "bg-accent text-bg-dark font-bold " +
    "shadow-[0_4px_20px_rgba(0,255,178,0.35)] hover:opacity-90",
};

/* DS §8 — 44px minimum height, 12px radius */
const sizeStyles: Record<Size, string> = {
  sm: "h-11 px-5  text-sm  rounded-xl gap-1.5",   /* 44px */
  md: "h-12 px-7  text-base rounded-xl gap-2",    /* 48px */
  lg: "h-14 px-9  text-base rounded-xl gap-2.5",  /* 56px */
};

const MotionButton = motion.button;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <MotionButton
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "inline-flex items-center justify-center",
        "transition-colors duration-200",
        "disabled:opacity-50 disabled:pointer-events-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </MotionButton>
  )
);

Button.displayName = "Button";
