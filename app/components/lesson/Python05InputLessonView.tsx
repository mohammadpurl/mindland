'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython05InputLesson } from '@/lib/curriculum/lessons/python-05-input'

export function Python05InputLessonView({ lang }: { lang: string }) {
  const lesson = getPython05InputLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-05"
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
