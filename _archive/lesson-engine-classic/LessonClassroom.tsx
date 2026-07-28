'use client'

import { TeacherScene } from '@/app/components/TeacherScene'
import { GameHUD } from '@/app/components/ui/GameHUD'
import { LessonTeacherBubble } from './LessonTeacherBubble'
import { LessonStepPanel } from './LessonStepPanel'
import type { InteractiveLesson, LessonStep } from '@/lib/lesson-engine/types'
import type { LessonPlayerState } from '@/lib/lesson-engine/types'

interface Props {
  lesson: InteractiveLesson
  state: LessonPlayerState
  currentStep: LessonStep | undefined
  onAnswer: (id: string) => boolean
  onCompleteActivity: () => void
  onContinue: () => void
}

/**
 * چیدمان یکپارچه کلاس: آواتار ۳D + حباب معلم + صحنه انیمیشن/سوال/فعالیت
 */
export function LessonClassroom({
  lesson,
  state,
  currentStep,
  onAnswer,
  onCompleteActivity,
  onContinue,
}: Props) {
  return (
    <div className="lesson-classroom">
      <GameHUD
        state={{
          score: state.stepIndex * 20,
          stars: state.completed ? 3 : Math.min(3, Math.floor(state.stepIndex / 2) + 1),
          errors: 0,
          currentLevel: state.stepIndex,
          totalLevels: state.totalSteps,
          completed: state.completed,
          timeSpent: 0,
        }}
        levelLabel={`گام ${Math.min(state.stepIndex + 1, state.totalSteps)}`}
      />

      <div className="lesson-classroom__grid">
        {/* ستون آواتار */}
        <aside className="lesson-classroom__avatar-col">
          <TeacherScene
            height="min(42vh, 360px)"
            className="lesson-classroom__avatar w-full border border-white/15 shadow-2xl"
            withChatProvider={false}
            withBridge={false}
          />
          <LessonTeacherBubble
            message={state.teacher.message}
            emotion={state.teacher.emotion}
            speaking={state.teacher.speaking}
          />
        </aside>

        {/* صحنه درس */}
        <section className="lesson-classroom__stage" aria-label="محتوای درس">
          <div className="lesson-classroom__stage-inner">
            <LessonStepPanel
              currentStep={currentStep}
              state={state}
              onAnswer={onAnswer}
              onCompleteActivity={onCompleteActivity}
              onContinue={onContinue}
            />
          </div>
        </section>
      </div>

      {/* نوار پیشرفت */}
      <div className="lesson-classroom__progress" role="progressbar" aria-valuenow={state.stepIndex} aria-valuemin={0} aria-valuemax={state.totalSteps}>
        <div
          className="lesson-classroom__progress-fill"
          style={{
            width: `${state.totalSteps ? Math.min(100, (state.stepIndex / state.totalSteps) * 100) : 0}%`,
          }}
        />
      </div>
      <p className="lesson-classroom__progress-label">
        {lesson.title} — {Math.min(state.stepIndex + 1, state.totalSteps)} از {state.totalSteps}
      </p>
    </div>
  )
}
