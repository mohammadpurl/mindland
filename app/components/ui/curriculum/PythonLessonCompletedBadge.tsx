'use client'

import { useEffect, useState } from 'react'
import { isLessonCompleted } from '@/lib/lessonProgress'

export function PythonLessonCompletedBadge({ lessonId }: { lessonId: string }) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(isLessonCompleted(lessonId))
  }, [lessonId])

  if (!done) return null

  return (
    <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">
      تکمیل شد ✓
    </span>
  )
}
