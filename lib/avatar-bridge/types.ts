import type { TeacherState } from '@/lib/animation-types'
import type { Lipsync } from '@/types/type'

/** انیمیشن‌های GLB آواتار معلم — مشترک بین Math Visual Engine و bridge */
export type AvatarAnimation =
  | 'Idle'
  | 'Talking'
  | 'Pointing'
  | 'ThumbsUp'
  | 'Clapping'
  | 'Thinking'
  | 'StandingGreeting'

export interface AvatarBridgePayload {
  message: string
  emotion: TeacherState['emotion']
  animation: AvatarAnimation
  speaking: boolean
  /** Pre-recorded lesson media */
  audioUrl?: string
  lipsync?: Lipsync
  lipsyncUrl?: string
}
