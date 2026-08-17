'use client'



import { PythonMissionLessonView } from '@/app/components/lesson/PythonMissionLessonView'

import { getPython09ListsLesson } from '@/lib/curriculum/lessons/python-09-lists'



export function Python09ListsLessonView({ lang }: { lang: string }) {

  const lesson = getPython09ListsLesson()

  return (

    <PythonMissionLessonView

      lang={lang}

      crumbLabel="PY-09"

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

