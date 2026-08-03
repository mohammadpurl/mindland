/** رنگ‌های آموزشی هندسه — محدود و پایدار برای کودک */
export const GEO_COLORS = {
  triangle: '#F59E0B',
  triangleStroke: '#B45309',
  parallelogram: '#0EA5E9',
  parallelogramStroke: '#0369A1',
  square: '#10B981',
  squareStroke: '#047857',
  base: '#DC2626',
  height: '#7C3AED',
  split: '#94A3B8',
  face: '#1E293B',
  empty: '#FFF7ED',
} as const

export function shapeFill(kind: string): string {
  if (kind === 'triangle') return GEO_COLORS.triangle
  if (kind === 'square' || kind === 'rectangle') return GEO_COLORS.square
  return GEO_COLORS.parallelogram
}

export function shapeStroke(kind: string): string {
  if (kind === 'triangle') return GEO_COLORS.triangleStroke
  if (kind === 'square' || kind === 'rectangle') return GEO_COLORS.squareStroke
  return GEO_COLORS.parallelogramStroke
}

/** رأس‌های مثلث متساوی‌الساقین روی قاعده */
export function trianglePoints(cx: number, cy: number, base: number, height: number): number[] {
  const half = base / 2
  return [cx, cy - height / 2, cx + half, cy + height / 2, cx - half, cy + height / 2]
}

/** رأس‌های متوازی‌الاضلاع (شیب ملایم تا ارتفاع داخل شکل بماند) */
export function parallelogramPoints(
  cx: number,
  cy: number,
  base: number,
  height: number,
  skew = 28
): number[] {
  const halfB = base / 2
  const halfH = height / 2
  return [
    cx - halfB + skew / 2,
    cy - halfH,
    cx + halfB + skew / 2,
    cy - halfH,
    cx + halfB - skew / 2,
    cy + halfH,
    cx - halfB - skew / 2,
    cy + halfH,
  ]
}

/** دو مثلث حاصل از قطر متوازی‌الاضلاع (رأس‌های ۰→۲) */
export function parallelogramSplitTriangles(points: number[]): {
  stay: number[]
  leave: number[]
  diagonal: [number, number, number, number]
} {
  const x0 = points[0]!
  const y0 = points[1]!
  const x1 = points[2]!
  const y1 = points[3]!
  const x2 = points[4]!
  const y2 = points[5]!
  const x3 = points[6]!
  const y3 = points[7]!
  return {
    /** مثلثی که سر جایش می‌ماند */
    stay: [x0, y0, x2, y2, x3, y3],
    /** مثلثی که بیرون می‌آید */
    leave: [x0, y0, x1, y1, x2, y2],
    diagonal: [x0, y0, x2, y2],
  }
}

/** مرکز هندسی چندضلعی ساده (میانگین رأس‌ها) */
export function polygonCentroid(points: number[]): { x: number; y: number } {
  let sx = 0
  let sy = 0
  const n = points.length / 2
  for (let i = 0; i < points.length; i += 2) {
    sx += points[i]!
    sy += points[i + 1]!
  }
  return { x: sx / n, y: sy / n }
}

/** مربع */
export function squarePoints(cx: number, cy: number, size: number): number[] {
  const h = size / 2
  return [cx - h, cy - h, cx + h, cy - h, cx + h, cy + h, cx - h, cy + h]
}
