'use client'

import type { MathVisualComponentProps } from '@/lib/math-visual-engine/types'

/** Placeholder برای NumberLine — فاز بعدی */
export function NumberLinePlaceholder(props: MathVisualComponentProps) {
  return (
    <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/80 text-slate-500 text-sm">
      NumberLine — به‌زودی (mode: {props.mode})
    </div>
  )
}

/** Placeholder برای Polygon — فاز بعدی */
export function PolygonPlaceholder(props: MathVisualComponentProps) {
  return (
    <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/80 text-slate-500 text-sm">
      Polygon — به‌زودی (mode: {props.mode})
    </div>
  )
}
