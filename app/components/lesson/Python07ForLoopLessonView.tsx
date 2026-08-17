'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython07ForLoopLesson } from '@/lib/curriculum/lessons/python-07-for-loop'

export function Python07ForLoopLessonView({ lang }: { lang: string }) {
  const lesson = getPython07ForLoopLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-07"
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
