'use client'

import { AnimatePresence, motion } from 'framer-motion'
import type { LessonStep } from '@/lib/lesson-engine/types'
import type { LessonPlayerState } from '@/lib/lesson-engine/types'
import { LessonAnimateStage } from './LessonAnimateStage'
import { QuestionStep } from './QuestionStep'
import { LessonActivity } from './LessonActivity'

interface Props {
  currentStep: LessonStep | undefined
  state: LessonPlayerState
  onAnswer: (id: string) => boolean
  onCompleteActivity: () => void
  onContinue: () => void
}

export function LessonStepPanel({
  currentStep,
  state,
  onAnswer,
  onCompleteActivity,
  onContinue,
}: Props) {
  if (!currentStep && state.completed) {
    return (
      <div className="lesson-stage-complete">
        <span className="text-4xl mb-3" aria-hidden>
          🎉
        </span>
        <p className="text-xl font-extrabold text-white">درس با موفقیت تمام شد!</p>
      </div>
    )
  }

  if (!currentStep) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep.id}
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.35 }}
        className="lesson-step-panel w-full"
      >
        {currentStep.type === 'speak' && (
          <div className="lesson-stage-speak">
            <div className="lesson-stage-speak__icon" aria-hidden>
              💬
            </div>
            <p className="text-white/90 text-center text-sm md:text-base leading-7 max-w-md">
              به حرف معلم گوش بده…
            </p>
            {currentStep.autoAdvance === false && (
              <button type="button" onClick={onContinue} className="lesson-btn-primary mt-6">
                ادامه
              </button>
            )}
          </div>
        )}

        {currentStep.type === 'animate' && (
          <div className="space-y-5">
            <LessonAnimateStage animationId={currentStep.animationId} />
            <div className="text-center">
              <button type="button" onClick={onContinue} className="lesson-btn-secondary">
                ادامه
              </button>
            </div>
          </div>
        )}

        {currentStep.type === 'question' && (
          <QuestionStep step={currentStep} onAnswer={onAnswer} />
        )}

        {currentStep.type === 'activity' && (
          <LessonActivity activityId={currentStep.activityId} onComplete={onCompleteActivity} />
        )}

        {currentStep.type === 'wait' && (
          <div className="lesson-stage-speak">
            <div className="lesson-stage-speak__icon animate-pulse" aria-hidden>
              ⏳
            </div>
            <p className="text-white/70 text-sm">یک لحظه صبر کن…</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
