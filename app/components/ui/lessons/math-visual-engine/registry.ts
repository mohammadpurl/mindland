import type { ComponentType } from 'react'
import type { MathVisualComponentProps, MathVisualType } from '@/lib/math-visual-engine/types'
import { FractionCircle } from './visuals/FractionCircle'
import { NumberLinePlaceholder } from './visuals/PlaceholderVisuals'
import { PolygonVisual } from './visuals/PolygonVisual'

/**
 * رجیستری کامپوننت‌های بصری ریاضی.
 * برای افزودن ویژوال جدید: import کنید و به MAP اضافه کنید.
 */
export const MATH_VISUAL_REGISTRY: Record<MathVisualType, ComponentType<MathVisualComponentProps>> = {
  'fraction-circle': FractionCircle,
  'number-line': NumberLinePlaceholder,
  polygon: PolygonVisual,
}

export function isMathVisualType(value: string): value is MathVisualType {
  return value in MATH_VISUAL_REGISTRY
}
