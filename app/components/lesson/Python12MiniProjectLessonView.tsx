'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython12MiniProjectLesson } from '@/lib/curriculum/lessons/python-12-mini-project'

export function Python12MiniProjectLessonView({ lang }: { lang: string }) {
  const lesson = getPython12MiniProjectLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-12"
      lesson={{
        id: lesson.id,
        code: lesson.code,
        title: lesson.title,
        subtitle: lesson.subtitle,
        duration: lesson.duration,
        steps: lesson.steps,
      }}
    />
  )
}
