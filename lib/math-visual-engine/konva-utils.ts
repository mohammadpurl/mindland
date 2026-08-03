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
