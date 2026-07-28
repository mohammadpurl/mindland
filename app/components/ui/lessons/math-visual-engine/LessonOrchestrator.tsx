'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatProvider } from '@/hooks/useChat'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { TeacherScene } from '@/app/components/TeacherScene'
import { LessonTeacherBubble } from '@/app/components/ui/lessons/LessonTeacherBubble'
import { useAvatarLessonSpeak } from '@/hooks/useAvatarLessonSpeak'
import type {
  OrchestratorLesson,
  OrchestratorPracticeStep,
  OrchestratorSpeakStep,
  OrchestratorStep,
  OrchestratorTeachStep,
} from '@/lib/math-visual-engine/types'
import { MathVisualRenderer } from './MathVisualRenderer'
import Link from 'next/link'

interface Props {
  lesson: OrchestratorLesson
  /** لینک درس بعدی در همان موضوع */
  nextLessonHref?: string | null
  nextLessonTitle?: string
  /** لینک بازگشت به لیست درس‌های موضوع */
  backToTopicHref?: string
}

function isSpeakStep(s: OrchestratorStep): s is OrchestratorSpeakStep {
  return s.type === 'speak'
}
function isTeachStep(s: OrchestratorStep): s is OrchestratorTeachStep {
  return s.type === 'teach'
}
function isPracticeStep(s: OrchestratorStep): s is OrchestratorPracticeStep {
  return s.type === 'practice'
}

function stepPhaseLabel(s: OrchestratorStep): string {
  if (isSpeakStep(s)) return 'مقدمه'
  if (isTeachStep(s)) return 'تدریس'
  if (isPracticeStep(s)) return 'تمرین'
  return ''
}

function OrchestratorInner({ lesson, nextLessonHref, nextLessonTitle, backToTopicHref }: Props) {
  const [started, setStarted] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [teacherMessage, setTeacherMessage] = useState('')
  const [teacherSpeaking, setTeacherSpeaking] = useState(false)
  const [practiceDone, setPracticeDone] = useState(false)
  const [lessonFinished, setLessonFinished] = useState(false)

  const { speak, point, celebrate, encourage } = useAvatarLessonSpeak()

  const step = lesson.steps[stepIndex]
  const totalSteps = lesson.steps.length
  const isLast = stepIndex >= totalSteps - 1

  const avatarSpeak = useCallback(
    (message: string, animation?: OrchestratorSpeakStep['animation'], emotion?: OrchestratorSpeakStep['emotion']) => {
      setTeacherMessage(message)
      setTeacherSpeaking(true)
      speak(message, { animation: animation ?? 'Talking', emotion: emotion ?? 'explaining' })
    },
    [speak]
  )

  const avatarAnimate = useCallback(
    (name: string) => {
      speak(teacherMessage, {
        animation: name as OrchestratorSpeakStep['animation'],
        speaking: false,
      })
    },
    [speak, teacherMessage]
  )

  const runStep = useCallback(
    (index: number) => {
      const s = lesson.steps[index]
      if (!s) return
      setPracticeDone(false)

      if (isSpeakStep(s)) {
        avatarSpeak(s.message, s.animation, s.emotion)
        if (s.autoAdvance !== false) {
          const ms = Math.max(2800, s.message.length * 90)
          setTimeout(() => setTeacherSpeaking(false), ms)
        }
        return
      }

      if (isTeachStep(s)) {
        if (s.animation === 'Pointing') point(s.speak)
        else avatarSpeak(s.speak, s.animation, s.emotion)
        return
      }

      if (isPracticeStep(s)) {
        const msg = s.speak ?? 'حالا خودت امتحان کن!'
        if (s.animation === 'Pointing') point(msg)
        else avatarSpeak(msg, s.animation, s.emotion)
      }
    },
    [lesson.steps, avatarSpeak, point]
  )

  useEffect(() => {
    if (!started) return
    runStep(stepIndex)
  }, [started, stepIndex, runStep])

  useEffect(() => {
    if (!started) return
    const onEnd = () => setTeacherSpeaking(false)
    window.addEventListener('mindland:speech-ended', onEnd)
    return () => window.removeEventListener('mindland:speech-ended', onEnd)
  }, [started])

  const teachCount = lesson.steps.filter((s) => s.type === 'teach').length
  const practiceCount = lesson.steps.filter((s) => s.type === 'practice').length

  const goNext = useCallback(() => {
    if (isPracticeStep(step!) && !practiceDone) return
    if (!isLast) {
      setStepIndex((i) => i + 1)
      return
    }
    setLessonFinished(true)
    celebrate('درس تمام شد! آفرین به تو! 🎉')
    setTeacherMessage('درس تمام شد! آفرین به تو!')
  }, [step, practiceDone, isLast, celebrate])

  const goPrev = () => setStepIndex((i) => Math.max(0, i - 1))

  const handlePracticeSuccess = useCallback(() => {
    if (!step || !isPracticeStep(step)) return
    setPracticeDone(true)
    celebrate(step.successMessage ?? 'آفرین! درست بود!')
    setTeacherMessage(step.successMessage ?? 'آفرین!')
  }, [step, celebrate])

  const handlePracticeWrong = useCallback(() => {
    if (!step || !isPracticeStep(step)) return
    encourage(step.wrongMessage ?? 'دوباره امتحان کن!')
    setTeacherMessage(step.wrongMessage ?? 'دوباره امتحان کن!')
  }, [step, encourage])

  const stepTitle = useMemo(() => {
    if (!step) return ''
    if (isSpeakStep(step)) return step.message.slice(0, 40) + (step.message.length > 40 ? '…' : '')
    return step.title ?? `مرحله ${stepIndex + 1}`
  }, [step, stepIndex])

  const phaseLabel = step ? stepPhaseLabel(step) : ''

  if (!started) {
    return (
      <div className="lesson-classroom lesson-classroom--intro">
        <h2 className="text-xl font-extrabold text-white mb-2">{lesson.title}</h2>
        {lesson.description ? (
          <p className="text-white/75 text-center mb-4 max-w-md text-sm leading-7">{lesson.description}</p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-2 mb-8 text-xs">
          {teachCount > 0 && (
            <span className="bg-sky-500/20 text-sky-200 px-3 py-1 rounded-full">📖 {teachCount} بخش تدریس</span>
          )}
          {practiceCount > 0 && (
            <span className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full">✋ {practiceCount} بخش تمرین</span>
          )}
        </div>
        <button type="button" onClick={() => setStarted(true)} className="lesson-btn-primary">
          شروع درس
        </button>
        {backToTopicHref ? (
          <Link href={backToTopicHref} className="block mt-4 text-white/50 text-sm hover:text-white/80">
            ← بازگشت به لیست درس‌ها
          </Link>
        ) : null}
      </div>
    )
  }

  if (lessonFinished) {
    return (
      <div className="lesson-classroom lesson-classroom--intro">
        <h2 className="text-xl font-extrabold text-white mb-3">🎉 درس تمام شد!</h2>
        <p className="text-white/80 text-center mb-6 text-sm">{lesson.title}</p>
        <div className="flex flex-col gap-3 items-center">
          {nextLessonHref ? (
            <Link href={nextLessonHref} className="lesson-btn-primary">
              درس بعدی: {nextLessonTitle ?? 'ادامه'}
            </Link>
          ) : null}
          {backToTopicHref ? (
            <Link href={backToTopicHref} className="lesson-btn-secondary text-sm">
              بازگشت به لیست {lesson.topicId === 'fractions' ? 'کسرها' : 'درس‌ها'}
            </Link>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="lesson-classroom">
      <div className="lesson-classroom__grid">
        <aside className="lesson-classroom__avatar-col">
          <TeacherScene
            height="min(38vh, 320px)"
            className="lesson-classroom__avatar w-full border border-white/15"
            withChatProvider={false}
            withBridge={false}
          />
          <LessonTeacherBubble message={teacherMessage} speaking={teacherSpeaking} />
        </aside>

        <section className="lesson-classroom__stage min-h-0" aria-label={lesson.title}>
          <div className="lesson-classroom__stage-inner !items-stretch !p-3 md:!p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step?.id ?? stepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="w-full"
              >
                {/* فقط speak — بدون ویژوال */}
                {step && isSpeakStep(step) && (
                  <div className="flex flex-col items-center justify-center min-h-[200px] text-white/80 text-center px-4">
                    <p className="text-lg leading-8">{step.message}</p>
                  </div>
                )}

                {/* teach یا practice — ویژوال Konva */}
                {step && (isTeachStep(step) || isPracticeStep(step)) && (
                  <MathVisualRenderer
                    key={step.id}
                    config={step.visual}
                    onSpeak={(text) => {
                      setTeacherMessage(text)
                      speak(text)
                    }}
                    setAnimation={avatarAnimate}
                    onSuccess={isPracticeStep(step) ? handlePracticeSuccess : undefined}
                    onWrong={isPracticeStep(step) ? handlePracticeWrong : undefined}
                  />
                )}

                <div className="flex items-center justify-between gap-3 mt-4 px-1">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={stepIndex === 0}
                    className="lesson-btn-secondary disabled:opacity-40 text-sm"
                  >
                    قبلی
                  </button>
                  <span className="text-white/70 text-xs text-center flex-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ml-1 ${
                        phaseLabel === 'تمرین'
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : phaseLabel === 'تدریس'
                            ? 'bg-sky-500/30 text-sky-200'
                            : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {phaseLabel}
                    </span>
                    {stepTitle}
                  </span>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isPracticeStep(step!) && !practiceDone}
                    className="lesson-btn-primary !py-2 !px-4 text-sm disabled:opacity-40"
                  >
                    {isLast ? 'پایان درس' : 'بعدی'}
                  </button>
                </div>

                {step && isPracticeStep(step) && !practiceDone && (
                  <p className="text-center text-white/50 text-xs mt-2">تمرین را کامل کن تا بتوانی به مرحله بعد بروی</p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>

      <div className="lesson-classroom__progress mt-3">
        <div
          className="lesson-classroom__progress-fill"
          style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
        />
      </div>
      <p className="lesson-classroom__progress-label">
        {lesson.title} — گام {stepIndex + 1} از {totalSteps}
        {practiceCount > 0 ? ` · ${practiceCount} تمرین` : ''}
      </p>
    </div>
  )
}

/**
 * Lesson Orchestrator — خواندن درس از JSON، هماهنگی آواتار + Math Visual Engine
 */
export function LessonOrchestrator({ lesson, nextLessonHref, nextLessonTitle, backToTopicHref }: Props) {
  return (
    <ChatProvider>
      <LessonAvatarBridge />
      <OrchestratorInner
        lesson={lesson}
        nextLessonHref={nextLessonHref}
        nextLessonTitle={nextLessonTitle}
        backToTopicHref={backToTopicHref}
      />
    </ChatProvider>
  )
}
