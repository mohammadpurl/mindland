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

export type LessonUnlockState = 'completed' | 'current' | 'locked' | 'free'

/**
 * حالت تست: وقتی NEXT_PUBLIC_UNLOCK_ALL_LESSONS=true باشد، قفل ترتیبی درس‌ها
 * نادیده گرفته می‌شود تا بتوان مستقیم هر درسی را برای تست باز کرد. فقط برای
 * محیط توسعه/تست است — در .env.local تنظیم می‌شود، نه در کد.
 */
function unlockAllLessonsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_UNLOCK_ALL_LESSONS === 'true'
}

/**
 * وضعیت باز/بسته‌بودن یک درس در یک زنجیرهٔ ترتیبی.
 * - «free»: درس اصلاً بخشی از این زنجیره نیست (مثلاً بخش اختیاری) — همیشه باز است.
 * - «completed»: قبلاً تمام شده.
 * - «current»: قابل شروع همین الان — دو درس اول زنجیره همیشه پیش‌فرض باز هستند، از سومین
 *   درس به بعد فقط وقتی درس قبلی تمام شده باشد.
 * - «locked»: درس قبلیِ زنجیره هنوز تمام نشده.
 */
export function getLessonUnlockState(lessonId: string, sequence: string[]): LessonUnlockState {
  const idx = sequence.indexOf(lessonId)
  if (idx === -1) return 'free'
  if (isLessonCompleted(lessonId)) return 'completed'
  if (unlockAllLessonsEnabled()) return 'current'
  const prevId = sequence[idx - 1]
  if (idx <= 1 || (prevId && isLessonCompleted(prevId))) return 'current'
  return 'locked'
}
