'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython03VariablesLesson } from '@/lib/curriculum/lessons/python-03-variables'

export function Python03VariablesLessonView({ lang }: { lang: string }) {
  const lesson = getPython03VariablesLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-03"
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
