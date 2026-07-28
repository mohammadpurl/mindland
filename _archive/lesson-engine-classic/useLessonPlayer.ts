'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TeacherState } from '@/lib/animation-types'
import type {
  AvatarAnimation,
  AvatarBridgePayload,
  InteractiveLesson,
  LessonPlayerState,
  LessonStep,
} from '@/lib/lesson-engine/types'

const DEFAULT_TEACHER: TeacherState = {
  speaking: false,
  message: '',
  emotion: 'explaining',
}

function dispatchAvatarBridge(payload: AvatarBridgePayload) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('mindland:avatar', { detail: payload }))
}

export function useLessonPlayer(lesson: InteractiveLesson, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true
  const [stepIndex, setStepIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [teacher, setTeacher] = useState<TeacherState>(DEFAULT_TEACHER)
  const [avatarAnimation, setAvatarAnimation] = useState<AvatarAnimation>('Idle')
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const stepIndexRef = useRef(0)

  const currentStep = lesson.steps[stepIndex] as LessonStep | undefined

  useEffect(() => {
    stepIndexRef.current = stepIndex
  }, [stepIndex])

  const updateTeacher = useCallback(
    (partial: Partial<TeacherState>, animation: AvatarAnimation = 'Talking') => {
      setTeacher((prev) => {
        const next = { ...prev, ...partial }
        dispatchAvatarBridge({
          message: next.message,
          emotion: next.emotion,
          animation,
          speaking: Boolean(next.speaking),
        })
        return next
      })
      setAvatarAnimation(animation)
    },
    []
  )

  const applyStep = useCallback(
    (step: LessonStep) => {
      clearTimeout(timerRef.current)

      switch (step.type) {
        case 'speak':
          updateTeacher(
            {
              speaking: true,
              message: step.message,
              emotion: step.emotion ?? 'explaining',
            },
            step.animation ?? 'Talking'
          )
          if (step.autoAdvance !== false) {
            timerRef.current = setTimeout(() => {
              setStepIndex((i) => i + 1)
            }, step.durationMs ?? Math.max(2800, step.message.length * 100))
          }
          break

        case 'animate':
          updateTeacher(
            {
              speaking: Boolean(step.message),
              message: step.message ?? '',
              emotion: step.emotion ?? 'explaining',
            },
            'Pointing'
          )
          break

        case 'question':
          updateTeacher(
            {
              speaking: true,
              message: step.question,
              emotion: step.emotion ?? 'explaining',
            },
            'Pointing'
          )
          break

        case 'activity':
          updateTeacher(
            {
              speaking: true,
              message: step.introMessage ?? 'حالا نوبت تمرین عملی است!',
              emotion: 'encouraging',
            },
            'StandingGreeting'
          )
          break

        case 'wait':
          updateTeacher({ speaking: false, message: '', emotion: 'happy' }, 'Idle')
          timerRef.current = setTimeout(() => {
            setStepIndex((i) => i + 1)
          }, step.durationMs)
          break
      }
    },
    [updateTeacher]
  )

  useEffect(() => {
    if (!enabled) return

    if (!currentStep) {
      setCompleted(true)
      updateTeacher(
        { speaking: true, message: 'آفرین! درس را کامل کردی 🎉', emotion: 'celebrating' },
        'Clapping'
      )
      return
    }

    setCompleted(false)
    applyStep(currentStep)
    return () => clearTimeout(timerRef.current)
  }, [currentStep, applyStep, updateTeacher, enabled])

  // بعد از اتمام صحبت آواتار، گام speak خودکار جلو برود
  useEffect(() => {
    if (!enabled) return

    const onSpeechEnded = () => {
      const idx = stepIndexRef.current
      const step = lesson.steps[idx]
      if (step?.type === 'speak' && step.autoAdvance !== false) {
        clearTimeout(timerRef.current)
        setStepIndex(idx + 1)
      }
    }

    window.addEventListener('mindland:speech-ended', onSpeechEnded)
    return () => window.removeEventListener('mindland:speech-ended', onSpeechEnded)
  }, [enabled, lesson.steps])

  const goNext = useCallback(() => {
    setStepIndex((i) => i + 1)
  }, [])

  const answerQuestion = useCallback(
    (optionId: string) => {
      if (!currentStep || currentStep.type !== 'question') return false

      const selected = currentStep.options.find((o) => o.id === optionId)
      if (!selected) return false

      if (selected.correct) {
        updateTeacher(
          {
            speaking: true,
            message: currentStep.correctMessage ?? 'آفرین! درست جواب دادی 🎉',
            emotion: 'celebrating',
          },
          'ThumbsUp'
        )
        timerRef.current = setTimeout(goNext, 1200)
        return true
      }

      updateTeacher(
        {
          speaking: true,
          message: currentStep.wrongMessage ?? currentStep.hint ?? 'دوباره امتحان کن!',
          emotion: 'encouraging',
        },
        'Thinking'
      )
      return false
    },
    [currentStep, goNext, updateTeacher]
  )

  const completeActivity = useCallback(() => {
    updateTeacher(
      { speaking: true, message: 'عالی بود! بریم مرحله بعد.', emotion: 'celebrating' },
      'Clapping'
    )
    timerRef.current = setTimeout(goNext, 900)
  }, [goNext, updateTeacher])

  const reset = useCallback(() => {
    clearTimeout(timerRef.current)
    setStepIndex(0)
    setCompleted(false)
    setTeacher(DEFAULT_TEACHER)
    setAvatarAnimation('Idle')
  }, [])

  const state: LessonPlayerState = useMemo(
    () => ({
      lessonId: lesson.id,
      stepIndex,
      totalSteps: lesson.steps.length,
      completed,
      teacher,
      avatarAnimation,
    }),
    [lesson.id, lesson.steps.length, stepIndex, completed, teacher, avatarAnimation]
  )

  return {
    state,
    currentStep,
    goNext,
    answerQuestion,
    completeActivity,
    reset,
    updateTeacher,
  }
}
