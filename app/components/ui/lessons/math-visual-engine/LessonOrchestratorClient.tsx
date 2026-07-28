'use client'

import type { OrchestratorLesson } from '@/lib/math-visual-engine/types'
import { LessonOrchestrator } from './LessonOrchestrator'

interface Props {
  lesson: OrchestratorLesson
  nextLessonHref?: string | null
  nextLessonTitle?: string
  backToTopicHref?: string
}

export function LessonOrchestratorClient({
  lesson,
  nextLessonHref,
  nextLessonTitle,
  backToTopicHref,
}: Props) {
  return (
    <div className="lesson-classroom-shell" dir="rtl">
      <LessonOrchestrator
        lesson={lesson}
        nextLessonHref={nextLessonHref}
        nextLessonTitle={nextLessonTitle}
        backToTopicHref={backToTopicHref}
      />
    </div>
  )
}
