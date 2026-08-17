'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython04NumbersLesson } from '@/lib/curriculum/lessons/python-04-numbers'

export function Python04NumbersLessonView({ lang }: { lang: string }) {
  const lesson = getPython04NumbersLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-04"
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
