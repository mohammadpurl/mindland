'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython08WhileLoopLesson } from '@/lib/curriculum/lessons/python-08-while-loop'

export function Python08WhileLoopLessonView({ lang }: { lang: string }) {
  const lesson = getPython08WhileLoopLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-08"
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
