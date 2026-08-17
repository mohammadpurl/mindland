'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython11FunctionsLesson } from '@/lib/curriculum/lessons/python-11-functions'

export function Python11FunctionsLessonView({ lang }: { lang: string }) {
  const lesson = getPython11FunctionsLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-11"
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
