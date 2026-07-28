import type { TeacherState } from '@/lib/animation-types'

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
}
