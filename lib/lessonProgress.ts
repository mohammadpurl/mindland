/**
 * ذخیرهٔ پیشرفت تکمیل درس‌ها در localStorage (per-browser).
 */

const STORAGE_KEY = 'mindland:python-lesson-progress'

export type LessonProgressMap = Record<string, { completedAt: string; stepId?: string }>

export function loadLessonProgress(): LessonProgressMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as LessonProgressMap
  } catch {
    return {}
  }
}

export function markLessonCompleted(lessonId: string, stepId = 'wrap-up'): void {
  if (typeof window === 'undefined') return
  const map = loadLessonProgress()
  map[lessonId] = { completedAt: new Date().toISOString(), stepId }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    /* quota or private mode */
  }
}

export function isLessonCompleted(lessonId: string): boolean {
  return Boolean(loadLessonProgress()[lessonId])
}
