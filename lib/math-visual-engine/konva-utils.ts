/** ابزارهای هندسی مشترک Konva برای همه ویژوال‌های ریاضی */

export function sliceAngle(denominator: number): number {
  return 360 / denominator
}

export function sliceRotation(index: number, denominator: number): number {
  return -90 + index * sliceAngle(denominator)
}

export function polarToSliceIndex(dx: number, dy: number, denominator: number): number {
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI
  const fromTop = (angle + 90 + 360) % 360
  const slice = 360 / denominator
  return Math.min(denominator - 1, Math.floor(fromTop / slice))
}

export function sliceChipPosition(
  index: number,
  denominator: number,
  radius: number,
  factor = 0.58
): { x: number; y: number } {
  const mid = sliceRotation(index, denominator) + sliceAngle(denominator) / 2
  const rad = (mid * Math.PI) / 180
  return { x: Math.cos(rad) * radius * factor, y: Math.sin(rad) * radius * factor }
}

/**
 * رنگ‌های آموزشی کسر — عمداً محدود.
 * داخل یک دایره همهٔ برش‌های گرفته‌شده یک رنگ‌اند تا کودک
 * فکر نکند هر قطعه «نوع» متفاوتی است؛ تمایز فقط با تعداد است.
 */
export const FRACTION_COLORS = {
  /** صورت کسر / قسمت انتخاب‌شده */
  selected: '#F97316',
  selectedStroke: '#C2410C',
  /** مخرج خالی / قسمت انتخاب‌نشده */
  empty: '#FFF7ED',
  emptyStroke: '#D6D3D1',
  /** مقایسهٔ دو کسر: هر دایره یک رنگ یکنواخت */
  compareA: '#6366F1',
  compareB: '#0EA5E9',
} as const

/** @deprecated از FRACTION_COLORS.selected استفاده کنید */
export const PIE_COLORS = [FRACTION_COLORS.selected]

/** رنگ‌های خط اعداد */
export const NUMBER_LINE_COLORS = {
  axis: '#334155',
  tick: '#94A3B8',
  zeroTick: '#0F172A',
  negative: '#F97316',
  positive: '#0EA5E9',
  token: '#6366F1',
  tokenStroke: '#4338CA',
  target: '#10B981',
  targetStroke: '#047857',
} as const

/** رنگ‌های صفحهٔ مختصات */
export const COORDINATE_COLORS = {
  axis: '#334155',
  grid: '#E2E8F0',
  originDot: '#0F172A',
  token: '#6366F1',
  tokenStroke: '#4338CA',
  fixedPoint: '#F97316',
  fixedPointStroke: '#C2410C',
  target: '#10B981',
  targetStroke: '#047857',
  mirrorLine: '#EC4899',
  rotationArc: '#8B5CF6',
} as const

/** رنگ‌های ویژوال زاویه */
export const ANGLE_COLORS = {
  fixedRay: '#334155',
  freeRay: '#6366F1',
  freeRayStroke: '#4338CA',
  arc: '#F97316',
  arcFill: 'rgba(249,115,22,0.15)',
  correctArc: '#10B981',
  correctFill: 'rgba(16,185,129,0.18)',
  vertical1: '#F97316',
  vertical2: '#0EA5E9',
} as const

/** رنگ‌های نوار درصد */
export const PERCENT_BAR_COLORS = {
  track: '#F1F5F9',
  trackStroke: '#CBD5E1',
  fill: '#6366F1',
  fillStroke: '#4338CA',
  correctFill: '#10B981',
  correctStroke: '#047857',
  handle: '#FFFFFF',
  tick: '#94A3B8',
} as const

export function gridLines(width: number, height: number, step = 28) {
  const lines: { points: number[]; key: string }[] = []
  for (let x = 0; x <= width; x += step) {
    lines.push({ points: [x, 0, x, height], key: `v${x}` })
  }
  for (let y = 0; y <= height; y += step) {
    lines.push({ points: [0, y, width, y], key: `h${y}` })
  }
  return lines
}
