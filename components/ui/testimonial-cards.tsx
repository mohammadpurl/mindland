"use client";

/**
 * testimonial-cards.tsx
 *
 * Draggable stacked testimonial card component.
 * Drag the front card left/right (>100px) to shuffle to the next.
 * Works for both LTR and RTL layouts.
 *
 * Usage:
 *   import { ShuffleCards } from "@/components/ui/testimonial-cards";
 *   <ShuffleCards />
 *
 *   OR compose manually with TestimonialCard for custom data/styling.
 */

import * as React from "react";
import { motion, type PanInfo } from "framer-motion";

/* ── Types ──────────────────────────────────────────────── */
export type CardPosition = "front" | "middle" | "back";

export interface TestimonialData {
  id:          number;
  testimonial: string;
  author:      string;
}

export interface TestimonialCardProps extends TestimonialData {
  position:      CardPosition;
  handleShuffle: () => void;
}

/* ── TestimonialCard ────────────────────────────────────── */
export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  id,
  author,
}: TestimonialCardProps) {
  const isFront = position === "front";

  const zIndex: Record<CardPosition, string> = {
    front:  "2",
    middle: "1",
    back:   "0",
  };
  const rotate: Record<CardPosition, string> = {
    front:  "-6deg",
    middle: "0deg",
    back:   "6deg",
  };
  const xPos: Record<CardPosition, string> = {
    front:  "0%",
    middle: "33%",
    back:   "66%",
  };

  return (
    <motion.div
      style={{ zIndex: zIndex[position] }}
      animate={{ rotate: rotate[position], x: xPos[position] }}
      drag={isFront}
      dragElastic={0.35}
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      onDragEnd={(_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        /* Shuffle on >100px horizontal swipe — works RTL and LTR */
        if (Math.abs(info.offset.x) > 100) {
          handleShuffle();
        }
      }}
      transition={{ duration: 0.35 }}
      className={[
        "absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center",
        "space-y-6 rounded-2xl border-2 border-slate-700 bg-slate-800/20 p-6",
        "shadow-xl backdrop-blur-md",
        isFront ? "cursor-grab active:cursor-grabbing" : "",
      ].join(" ")}
    >
      <img
        src={`https://i.pravatar.cc/128?img=${id}`}
        alt={`Avatar of ${author}`}
        className="pointer-events-none mx-auto h-32 w-32 rounded-full border-2 border-slate-700 bg-slate-200 object-cover"
      />
      <span className="text-center text-lg italic text-slate-400">
        &ldquo;{testimonial}&rdquo;
      </span>
      <span className="text-center text-sm font-medium text-indigo-400">
        {author}
      </span>
    </motion.div>
  );
}

/* ── Default demo data ──────────────────────────────────── */
const defaultTestimonials: TestimonialData[] = [
  {
    id:          1,
    testimonial: "I feel like I've learned as much from X as I did completing my masters. It's the first thing I read every morning.",
    author:      "Jenn F. - Marketing Director @ Square",
  },
  {
    id:          2,
    testimonial: "My boss thinks I know what I'm doing. Honestly, I just read this newsletter.",
    author:      "Adrian Y. - Product Marketing @ Meta",
  },
  {
    id:          3,
    testimonial: "Can not believe this is free. If X was $5,000 a month, it would be worth every penny.",
    author:      "Devin R. - Growth Marketing Lead @ OpenAI",
  },
];

/* ── ShuffleCards (self-contained demo) ─────────────────── */
export function ShuffleCards({
  testimonials = defaultTestimonials,
}: {
  testimonials?: TestimonialData[];
}) {
  const [positions, setPositions] = React.useState<CardPosition[]>([
    "front",
    "middle",
    "back",
  ]);

  const handleShuffle = () => {
    setPositions((prev) => {
      const next = [...prev] as CardPosition[];
      const last = next.pop()!;
      next.unshift(last);
      return next;
    });
  };

  return (
    <div className="grid place-content-center overflow-hidden bg-slate-900 px-8 py-24 text-slate-50 min-h-screen h-full w-full">
      <div className="relative ml-[-100px] h-[450px] w-[350px] md:ml-[-175px]">
        {testimonials.map((t, index) => (
          <TestimonialCard
            key={t.id}
            {...t}
            handleShuffle={handleShuffle}
            position={positions[index]}
          />
        ))}
      </div>
    </div>
  );
}
