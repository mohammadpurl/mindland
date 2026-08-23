'use client'

import { useCallback } from 'react'
import type { AvatarAnimation, AvatarBridgePayload } from '@/lib/avatar-bridge/types'
import type { TeacherState } from '@/lib/animation-types'
import type { ScenarioDialogueLine } from '@/lib/curriculum/scenarios/types'
import {
  fetchLessonLipsync,
  resolveLessonMediaUrl,
  resolveStepLineMedia,
} from '@/lib/lesson-media/resolveMedia'

export interface SpeakLineInput {
  text: string
  mediaKey?: string
  animation?: string
}

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
        audioUrl?: string
        lipsyncUrl?: string
        mediaKey?: string
      }
    ) => {
      const media =
        options?.mediaKey != null
          ? resolveLessonMediaUrl(options.mediaKey)
          : options?.audioUrl
            ? {
                audioUrl: options.audioUrl,
                lipsyncUrl: options.lipsyncUrl ?? '',
              }
            : null

      dispatch({
        message,
        emotion: options?.emotion ?? 'explaining',
        animation: options?.animation ?? 'Talking',
        speaking: options?.speaking ?? true,
        audioUrl: media?.audioUrl,
        lipsyncUrl: media?.lipsyncUrl || options?.lipsyncUrl,
      })
    },
    [dispatch]
  )

  const speakLine = useCallback(
    async (
      line: SpeakLineInput | ScenarioDialogueLine,
      options?: {
        emotion?: TeacherState['emotion']
        speaking?: boolean
      }
    ) => {
      const animation = (line.animation as AvatarAnimation | undefined) ?? 'Talking'
      const payload: AvatarBridgePayload = {
        message: line.text,
        emotion: options?.emotion ?? 'explaining',
        animation,
        speaking: options?.speaking ?? true,
      }

      if (line.mediaKey) {
        const { audioUrl, lipsyncUrl } = resolveLessonMediaUrl(line.mediaKey)
        payload.audioUrl = audioUrl
        payload.lipsyncUrl = lipsyncUrl
        try {
          payload.lipsync = await fetchLessonLipsync(line.mediaKey)
        } catch {
          /* bridge may fetch lipsyncUrl */
        }
      }

      dispatch(payload)
    },
    [dispatch]
  )

  /** پخش صدا/lipsync از پیش‌تولیدشده برای گفتهٔ Nام یک مرحله از سناریو */
  const speakStepLine = useCallback(
    async (
      lessonId: string,
      stepId: string,
      lineIndex: number,
      text: string,
      options?: {
        animation?: AvatarAnimation
        emotion?: TeacherState['emotion']
      }
    ) => {
      const media = await resolveStepLineMedia(lessonId, stepId, lineIndex, text)
      speak(text, {
        animation: options?.animation,
        emotion: options?.emotion,
        audioUrl: media?.audioUrl,
        lipsyncUrl: media?.lipsyncUrl,
      })
    },
    [speak]
  )

  const point = useCallback(
    (message: string, mediaKey?: string) =>
      speak(message, { animation: 'Pointing', mediaKey }),
    [speak]
  )

  const celebrate = useCallback(
    (message: string, mediaKey?: string) =>
      speak(message, { animation: 'ThumbsUp', emotion: 'celebrating', mediaKey }),
    [speak]
  )

  const encourage = useCallback(
    (message: string, mediaKey?: string) =>
      speak(message, { animation: 'Thinking', emotion: 'encouraging', mediaKey }),
    [speak]
  )

  return { speak, speakLine, speakStepLine, point, celebrate, encourage }
}
