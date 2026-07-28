import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/* DS §9 Layout
   - max-width: 1200px
   - centered layout
*/

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean; /* narrower 800px for text-heavy sections */
}

export function Container({ children, className, narrow }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-[800px]" : "max-w-[1200px]",
        className
      )}
    >
      {children}
    </div>
  );
}
