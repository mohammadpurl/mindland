'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython14CapstoneLesson } from '@/lib/curriculum/lessons/python-14-capstone'

export function Python14CapstoneLessonView({ lang }: { lang: string }) {
  const lesson = getPython14CapstoneLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-14"
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
