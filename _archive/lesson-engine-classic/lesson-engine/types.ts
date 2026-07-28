import type { TeacherState } from '@/lib/animation-types'

export type LessonStepType = 'speak' | 'animate' | 'question' | 'activity' | 'wait'

export type AvatarAnimation =
  | 'Idle'
  | 'Talking'
  | 'Pointing'
  | 'ThumbsUp'
  | 'Clapping'
  | 'Thinking'
  | 'StandingGreeting'

export interface LessonOption {
  id: string
  label: string
  correct: boolean
}

export interface SpeakStep {
  type: 'speak'
  id: string
  message: string
  emotion?: TeacherState['emotion']
  animation?: AvatarAnimation
  /** میلی‌ثانیه قبل از رفتن به گام بعد — اگر autoAdvance فعال باشد */
  durationMs?: number
  autoAdvance?: boolean
}

export interface AnimateStep {
  type: 'animate'
  id: string
  /** شناسه انیمیشن GSAP ثبت‌شده در رجیستری */
  animationId: string
  message?: string
  emotion?: TeacherState['emotion']
}

export interface QuestionStep {
  type: 'question'
  id: string
  question: string
  options: LessonOption[]
  hint?: string
  correctMessage?: string
  wrongMessage?: string
  emotion?: TeacherState['emotion']
}

export interface ActivityStep {
  type: 'activity'
  id: string
  /** شناسه فعالیت تعاملی — مثلاً fraction-drag */
  activityId: string
  introMessage?: string
}

export interface WaitStep {
  type: 'wait'
  id: string
  durationMs: number
}

export type LessonStep =
  | SpeakStep
  | AnimateStep
  | QuestionStep
  | ActivityStep
  | WaitStep

export interface InteractiveLesson {
  id: string
  title: string
  subject: 'math' | 'science' | 'coding'
  description?: string
  steps: LessonStep[]
}

export interface LessonPlayerState {
  lessonId: string
  stepIndex: number
  totalSteps: number
  completed: boolean
  teacher: TeacherState
  avatarAnimation: AvatarAnimation
}

export interface AvatarBridgePayload {
  message: string
  emotion: TeacherState['emotion']
  animation: AvatarAnimation
  speaking: boolean
}
