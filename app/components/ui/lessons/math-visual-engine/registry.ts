import type { ComponentType } from 'react'
import type { MathVisualComponentProps, MathVisualType } from '@/lib/math-visual-engine/types'
import { AngleVisual } from './visuals/AngleVisual'
import { CoordinateGrid } from './visuals/CoordinateGrid'
import { DivisibilityLab } from './visuals/DivisibilityLab'
import { FractionCircle } from './visuals/FractionCircle'
import { NumberLine } from './visuals/NumberLine'
import { PercentBar } from './visuals/PercentBar'
import { PolygonVisual } from './visuals/PolygonVisual'
import { QuizVisual } from './visuals/QuizVisual'

/**
 * رجیستری کامپوننت‌های بصری ریاضی.
 * برای افزودن ویژوال جدید: import کنید و به MAP اضافه کنید.
 */
export const MATH_VISUAL_REGISTRY: Record<MathVisualType, ComponentType<MathVisualComponentProps>> = {
  'fraction-circle': FractionCircle,
  'number-line': NumberLine,
  polygon: PolygonVisual,
  'coordinate-grid': CoordinateGrid,
  angle: AngleVisual,
  'percent-bar': PercentBar,
  divisibility: DivisibilityLab,
  quiz: QuizVisual,
}

export function isMathVisualType(value: string): value is MathVisualType {
  return value in MATH_VISUAL_REGISTRY
}
