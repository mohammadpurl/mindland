'use client'

import { useState } from 'react'
import { ChatProvider } from '@/hooks/useChat'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { useLessonPlayer } from '@/hooks/useLessonPlayer'
import type { InteractiveLesson } from '@/lib/lesson-engine/types'
import { LessonClassroom } from './LessonClassroom'

interface Props {
  lesson: InteractiveLesson
}

export function InteractiveLessonPlayer({ lesson }: Props) {
  const [started, setStarted] = useState(false)
  const { state, currentStep, goNext, answerQuestion, completeActivity } = useLessonPlayer(
    lesson,
    { enabled: started }
  )

  if (!started) {
    return (
      <div className="w-full max-w-6xl mx-auto p-3 md:p-4" dir="rtl">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">{lesson.title}</h1>
          {lesson.description && (
            <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
          )}
        </div>
        <div className="lesson-classroom lesson-classroom--intro">
          <p className="text-white/85 text-center mb-8 max-w-md mx-auto leading-7">
            معلم مجازی و انیمیشن‌های درس کنار هم نمایش داده می‌شوند. برای شروع، دکمه زیر را بزنید.
          </p>
          <button type="button" onClick={() => setStarted(true)} className="lesson-btn-primary">
            شروع درس
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-4" dir="rtl">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">{lesson.title}</h1>
        {lesson.description && (
          <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
        )}
      </div>

      <ChatProvider>
        <LessonAvatarBridge />
        <div className="lesson-classroom-shell">
          <LessonClassroom
            lesson={lesson}
            state={state}
            currentStep={currentStep}
            onAnswer={answerQuestion}
            onCompleteActivity={completeActivity}
            onContinue={goNext}
          />
        </div>
      </ChatProvider>
    </div>
  )
}
