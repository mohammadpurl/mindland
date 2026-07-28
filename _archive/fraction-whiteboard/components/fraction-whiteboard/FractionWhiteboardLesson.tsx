'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChatProvider } from '@/hooks/useChat'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { TeacherScene } from '@/app/components/TeacherScene'
import { LessonTeacherBubble } from '@/app/components/ui/lessons/LessonTeacherBubble'
import { useAvatarLessonSpeak } from '@/hooks/useAvatarLessonSpeak'
import { FRACTION_TEACHING_STEPS } from './teaching-steps'
import { FractionTeachingCanvas } from './FractionTeachingCanvas'
import { InteractiveFractionPizza, type FractionTarget } from './InteractiveFractionPizza'

type Mode = 'teaching' | 'practice'

const PRACTICE_TARGETS: FractionTarget[] = [
  { numerator: 1, denominator: 4 },
  { numerator: 2, denominator: 4 },
  { numerator: 3, denominator: 6 },
]

function FractionWhiteboardInner() {
  const [started, setStarted] = useState(false)
  const [mode, setMode] = useState<Mode>('teaching')
  const [stepIndex, setStepIndex] = useState(0)
  const [practiceIndex, setPracticeIndex] = useState(0)
  const [teacherMessage, setTeacherMessage] = useState('')
  const [teacherSpeaking, setTeacherSpeaking] = useState(false)

  const { speak, point, celebrate, encourage } = useAvatarLessonSpeak()

  const step = FRACTION_TEACHING_STEPS[stepIndex]
  const practiceTarget = PRACTICE_TARGETS[practiceIndex % PRACTICE_TARGETS.length]

  const runStepAvatar = useCallback(
    (index: number) => {
      const s = FRACTION_TEACHING_STEPS[index]
      if (!s) return
      setTeacherMessage(s.speak)
      setTeacherSpeaking(true)
      if (s.animation === 'Pointing') {
        point(s.speak)
      } else {
        speak(s.speak, { animation: s.animation, emotion: s.emotion })
      }
    },
    [point, speak]
  )

  useEffect(() => {
    if (!started || mode !== 'teaching') return
    runStepAvatar(stepIndex)
  }, [started, mode, stepIndex, runStepAvatar])

  useEffect(() => {
    if (!started) return
    const onEnd = () => setTeacherSpeaking(false)
    window.addEventListener('mindland:speech-ended', onEnd)
    return () => window.removeEventListener('mindland:speech-ended', onEnd)
  }, [started])

  const goNextStep = () => {
    if (stepIndex < FRACTION_TEACHING_STEPS.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setMode('practice')
      const msg = 'حالا تمرین تعاملی! پیتزا را مثل نمونه هدف درست کن.'
      setTeacherMessage(msg)
      speak(msg, { animation: 'StandingGreeting', emotion: 'encouraging' })
    }
  }

  const goPrevStep = () => setStepIndex((i) => Math.max(0, i - 1))

  const handlePracticeSpeak = useCallback(
    (text: string) => {
      setTeacherMessage(text)
      speak(text)
    },
    [speak]
  )

  const handlePracticeSuccess = useCallback(() => {
    celebrate('آفرین! دقیقاً درست کردی! 🎉')
    setTeacherMessage('آفرین! دقیقاً درست کردی!')
    setTimeout(() => {
      if (practiceIndex < PRACTICE_TARGETS.length - 1) {
        setPracticeIndex((i) => i + 1)
        const next = PRACTICE_TARGETS[practiceIndex + 1]
        speak(`حالا ${next.numerator} از ${next.denominator} را بساز!`, { animation: 'Pointing' })
      } else {
        celebrate('همه تمرین‌ها تمام شد! تو استاد کسر شدی! 🏆')
        setTeacherMessage('همه تمرین‌ها تمام شد! تو استاد کسر شدی!')
      }
    }, 1400)
  }, [celebrate, practiceIndex, speak])

  const handlePracticeWrong = useCallback(() => {
    encourage('نزدیک بود! تعداد برش‌های رنگی را بشمار و دوباره امتحان کن.')
    setTeacherMessage('نزدیک بود! دوباره امتحان کن.')
  }, [encourage])

  if (!started) {
    return (
      <div className="lesson-classroom lesson-classroom--intro">
        <h2 className="text-xl font-extrabold text-white mb-3">درس کسر — وایت‌برد تعاملی</h2>
        <p className="text-white/80 text-center mb-8 max-w-md leading-7 text-sm">
          معلم ۳D روی وایت‌برد Konva توضیح می‌دهد، بعد خودت با پیتزای تعاملی تمرین می‌کنی.
        </p>
        <button type="button" onClick={() => setStarted(true)} className="lesson-btn-primary">
          شروع درس
        </button>
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

        <section className="lesson-classroom__stage min-h-0" aria-label="وایت‌برد کسر">
          <div className="lesson-classroom__stage-inner !items-stretch !p-3 md:!p-4">
            <AnimatePresence mode="wait">
              {mode === 'teaching' && step && (
                <motion.div
                  key={`teach-${step.id}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="w-full"
                >
                  <FractionTeachingCanvas stepKind={step.kind} />
                  <div className="flex items-center justify-between gap-3 mt-4 px-1">
                    <button
                      type="button"
                      onClick={goPrevStep}
                      disabled={stepIndex === 0}
                      className="lesson-btn-secondary disabled:opacity-40"
                    >
                      قبلی
                    </button>
                    <span className="text-white/70 text-xs md:text-sm text-center flex-1">
                      {step.id}. {step.title}
                    </span>
                    <button type="button" onClick={goNextStep} className="lesson-btn-primary !py-2 !px-4 text-sm">
                      {stepIndex === FRACTION_TEACHING_STEPS.length - 1 ? 'شروع تمرین' : 'بعدی'}
                    </button>
                  </div>
                </motion.div>
              )}

              {mode === 'practice' && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <InteractiveFractionPizza
                    key={`practice-${practiceIndex}-${practiceTarget.numerator}-${practiceTarget.denominator}`}
                    target={practiceTarget}
                    onSpeak={handlePracticeSpeak}
                    onSuccess={handlePracticeSuccess}
                    onWrong={handlePracticeWrong}
                  />
                  <div className="text-center mt-4">
                    <button
                      type="button"
                      className="lesson-btn-secondary text-sm"
                      onClick={() => {
                        setMode('teaching')
                        setStepIndex(0)
                      }}
                    >
                      بازگشت به تدریس
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>

      <div className="lesson-classroom__progress mt-3">
        <div
          className="lesson-classroom__progress-fill"
          style={{
            width:
              mode === 'practice'
                ? '100%'
                : `${((stepIndex + 1) / FRACTION_TEACHING_STEPS.length) * 100}%`,
          }}
        />
      </div>
      <p className="lesson-classroom__progress-label">
        {mode === 'teaching'
          ? `فاز تدریس — مرحله ${stepIndex + 1} از ${FRACTION_TEACHING_STEPS.length}`
          : `فاز تمرین — ${practiceIndex + 1} از ${PRACTICE_TARGETS.length}`}
      </p>
    </div>
  )
}

/** درس کسر با وایت‌برد Konva + آواتار ۳D */
export function FractionWhiteboardLesson() {
  return (
    <ChatProvider>
      <LessonAvatarBridge />
      <FractionWhiteboardInner />
    </ChatProvider>
  )
}
