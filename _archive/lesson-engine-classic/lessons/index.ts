import type { InteractiveLesson } from '@/lib/lesson-engine/types'
import { mathFractionsDemoLesson } from '@/lib/lessons/math-fractions-demo'

const LESSONS: Record<string, InteractiveLesson> = {
  [mathFractionsDemoLesson.id]: mathFractionsDemoLesson,
}

export function getLessonById(lessonId: string): InteractiveLesson | null {
  return LESSONS[lessonId] ?? null
}

export function getAllLessons(): InteractiveLesson[] {
  return Object.values(LESSONS)
}
