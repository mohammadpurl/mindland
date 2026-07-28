'use client'

import dynamic from 'next/dynamic'
import type { OrchestratorLesson } from '@/lib/math-visual-engine/types'

const LessonOrchestratorClient = dynamic(
  () =>
    import('./LessonOrchestratorClient').then((m) => ({
      default: m.LessonOrchestratorClient,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] items-center justify-center text-slate-500">
        در حال بارگذاری درس…
      </div>
    ),
  }
)

interface Props {
  lesson: OrchestratorLesson
  nextLessonHref?: string | null
  nextLessonTitle?: string
  backToTopicHref?: string
}

export function MathVisualLessonShell({
  lesson,
  nextLessonHref,
  nextLessonTitle,
  backToTopicHref,
}: Props) {
  return (
    <LessonOrchestratorClient
      lesson={lesson}
      nextLessonHref={nextLessonHref}
      nextLessonTitle={nextLessonTitle}
      backToTopicHref={backToTopicHref}
    />
  )
}
