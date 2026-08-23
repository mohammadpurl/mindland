/**
 * System message lines for PY-01 (from system-messages.json)
 */
import systemMessages from '@/lib/curriculum/scenarios/python-01-intro/dialogue/system-messages.json'
import type { Py01DialogueLine } from '@/lib/curriculum/lessons/python-01-intro'

export function getPy01SystemMessageLine(id: string): Py01DialogueLine | undefined {
  const msg = systemMessages.systemMessages?.find((m) => m.id === id)
  if (!msg) return undefined
  return {
    speaker: 'avatar',
    text: msg.text,
    mediaKey: msg.mediaKey,
    animation: 'Thinking',
    board: msg.board,
  }
}

export function findPy01LineByText(text: string): Py01DialogueLine | undefined {
  const trimmed = text.trim()
  return getPy01SystemMessageLines().find((l) => l.text === trimmed)
}

export function getPy01SystemMessageLines(): Py01DialogueLine[] {
  return (
    systemMessages.systemMessages?.map((m) => ({
      speaker: 'avatar',
      text: m.text,
      mediaKey: m.mediaKey,
      animation: 'Thinking',
      board: m.board,
    })) ?? []
  )
}
