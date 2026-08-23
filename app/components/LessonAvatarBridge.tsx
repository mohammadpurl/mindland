'use client'

import { useCallback, useRef } from 'react'
import { useLessonAvatarBridge } from '@/hooks/useLessonAvatarBridge'
import { useChatContext } from '@/hooks/useChat'
import { MessageSender } from '@/types/type'
import type { AvatarBridgePayload } from '@/lib/avatar-bridge/types'
import { synthesizeSpeech } from '@/lib/lesson-tts/synthesize'
import type { Lipsync, Message } from '@/types/type'

const EMOTION_TO_EXPRESSION: Record<string, string> = {
  explaining: 'default',
  encouraging: 'smile',
  celebrating: 'smile',
  happy: 'smile',
  thinking: 'default',
}

async function loadLipsync(url?: string): Promise<Lipsync | undefined> {
  if (!url) return undefined
  try {
    const res = await fetch(url)
    if (!res.ok) return undefined
    return (await res.json()) as Lipsync
  } catch {
    return undefined
  }
}

/**
 * پل بین موتور درس و آواتار ۳بعدی — pre-recorded media یا TTS fallback.
 */
export function LessonAvatarBridge() {
  const { setMessages, setLastAvatarMessage, language } = useChatContext()
  const requestIdRef = useRef(0)

  const pushAvatarMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => [...prev, message])
      setLastAvatarMessage(message)
    },
    [setMessages, setLastAvatarMessage]
  )

  const handleCommand = useCallback(
    async (payload: AvatarBridgePayload) => {
      const requestId = ++requestIdRef.current

      if (!payload.speaking || !payload.message?.trim()) {
        return
      }

      const text = payload.message.trim()

      if (payload.audioUrl) {
        const lipsync =
          payload.lipsync ?? (await loadLipsync(payload.lipsyncUrl))

        if (requestId !== requestIdRef.current) return

        const message: Message = {
          id: `lesson_${Date.now()}`,
          text,
          sender: MessageSender.AVATAR,
          animation: payload.animation,
          facialExpression: EMOTION_TO_EXPRESSION[payload.emotion] ?? 'default',
          audioUrl: payload.audioUrl,
          lipsync,
          lipsyncUrl: payload.lipsyncUrl,
        }

        pushAvatarMessage(message)
        return
      }

      const speech = await synthesizeSpeech(text, language)

      if (requestId !== requestIdRef.current) return

      const message: Message = {
        id: `lesson_${Date.now()}`,
        text,
        sender: MessageSender.AVATAR,
        animation: payload.animation,
        facialExpression: EMOTION_TO_EXPRESSION[payload.emotion] ?? 'default',
        lipsync: speech.lipsync,
        audio: speech.audio,
        useBrowserTts: speech.useBrowserTts,
      }

      pushAvatarMessage(message)
    },
    [language, pushAvatarMessage]
  )

  useLessonAvatarBridge(handleCommand)

  return null
}
