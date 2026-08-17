'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython02PrintStringsLesson } from '@/lib/curriculum/lessons/python-02-print-strings'

export function Python02PrintStringsLessonView({ lang }: { lang: string }) {
  const lesson = getPython02PrintStringsLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-02"
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
