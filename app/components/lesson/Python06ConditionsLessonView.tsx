'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython06ConditionsLesson } from '@/lib/curriculum/lessons/python-06-conditions'

export function Python06ConditionsLessonView({ lang }: { lang: string }) {
  const lesson = getPython06ConditionsLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-06"
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
