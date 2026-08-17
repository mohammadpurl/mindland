'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython10DictsLesson } from '@/lib/curriculum/lessons/python-10-dicts'

export function Python10DictsLessonView({ lang }: { lang: string }) {
  const lesson = getPython10DictsLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-10"
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
