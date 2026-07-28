import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "brand" | "accent" | "blue" | "neutral" | "outline";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  brand:
    "border border-violet-500/30 bg-violet-500/10 text-violet-300",
  accent:
    "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  blue:
    "border border-blue-500/30 bg-blue-500/10 text-blue-300",
  neutral:
    "border border-white/10 bg-white/[0.05] text-muted",
  outline:
    "border border-white/20 text-white/80",
};

export function Badge({
  children,
  variant = "brand",
  className,
  icon,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
