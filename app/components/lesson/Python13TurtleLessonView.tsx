'use client'

import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'
import { getPython13TurtleLesson } from '@/lib/curriculum/lessons/python-13-turtle'

export function Python13TurtleLessonView({ lang }: { lang: string }) {
  const lesson = getPython13TurtleLesson()
  return (
    <PythonMissionLessonView
      lang={lang}
      crumbLabel="PY-13"
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
