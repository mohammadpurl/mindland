import type { OrchestratorLesson, OrchestratorLessonInput } from './types'
import { getLessonFromCurriculum, getAllCurriculumLessons } from './curriculum'
import { resolveLessonSteps } from './generators/resolve-practice'

export function getOrchestratorLesson(id: string): OrchestratorLesson | null {
  return getLessonFromCurriculum(id)
}

export function getAllOrchestratorLessons(): OrchestratorLesson[] {
  return getAllCurriculumLessons()
}

/**
 * بارگذاری درس از JSON خام (برای CMS یا import دینامیک).
 * اگر گام practice به generator اشاره کند، در همین‌جا resolve می‌شود
 * تا خروجی همیشه OrchestratorLesson با visual ثابت باشد.
 * درس‌های فعلی (fraction-01/02/03) بدون تغییر کار می‌کنند.
 */
export function parseOrchestratorLesson(
  json: unknown,
  options?: { seedOverride?: string | number }
): OrchestratorLesson {
  const lesson = json as OrchestratorLessonInput
  if (!lesson?.id || !Array.isArray(lesson.steps)) {
    throw new Error('فرمت JSON درس نامعتبر است')
  }
  return {
    ...lesson,
    steps: resolveLessonSteps(lesson.steps, options) as OrchestratorLesson['steps'],
  }
}

export * from './curriculum'
export * from './curriculum/types'
