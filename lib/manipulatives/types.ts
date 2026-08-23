/**
 * انواع پایه برای موتور عمومی «فضای کار» (Workspace) — بستری برای همهٔ
 * ابزارهای تعاملی آزاد (مثل کاشی کسر، بلوک پایه‌ده، …)، نه یک ویجت خاص.
 *
 * تفاوت با ویژوال‌های قبلی (FractionCircle و…): آن‌ها یک تسک بسته با یک
 * هدف ثابت بودند («این کسر مشخص را بساز»). اینجا کودک آزاد است هر تعداد
 * قطعه از قفسه بردارد، هرجای بوم بگذارد، کنار هم بچیند و دوباره بردارد —
 * دقیقاً همان چیزی که ابزارهای واقعیِ دستکاری (مثل Polypad) را «واقعی» می‌کند.
 */

export interface PieceTemplate<TData = Record<string, unknown>> {
  templateId: string
  label: string
  data: TData
}

export interface WorkspacePiece<TData = Record<string, unknown>> {
  id: string
  templateId: string
  x: number
  y: number
  data: TData
}

export interface PieceSize {
  width: number
  height: number
}
