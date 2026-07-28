'use client'

import { useCallback } from 'react'
import type { AvatarAnimation, AvatarBridgePayload } from '@/lib/avatar-bridge/types'
import type { TeacherState } from '@/lib/animation-types'

/** ارسال دستور صحبت/انیمیشن به آواتار ۳D از طریق LessonAvatarBridge */
export function useAvatarLessonSpeak() {
  const dispatch = useCallback((payload: AvatarBridgePayload) => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('mindland:avatar', { detail: payload }))
  }, [])

  const speak = useCallback(
    (
      message: string,
      options?: {
        animation?: AvatarAnimation
        emotion?: TeacherState['emotion']
        speaking?: boolean
      }
    ) => {
      dispatch({
        message,
        emotion: options?.emotion ?? 'explaining',
        animation: options?.animation ?? 'Talking',
        speaking: options?.speaking ?? true,
      })
    },
    [dispatch]
  )

  const point = useCallback(
    (message: string) => speak(message, { animation: 'Pointing' }),
    [speak]
  )

  const celebrate = useCallback(
    (message: string) => speak(message, { animation: 'ThumbsUp', emotion: 'celebrating' }),
    [speak]
  )

  const encourage = useCallback(
    (message: string) => speak(message, { animation: 'Thinking', emotion: 'encouraging' }),
    [speak]
  )

  return { speak, point, celebrate, encourage }
}
