import type { Lipsync } from '@/types/type'
import { estimateSpeechDurationMs, estimateSpeechDurationSec } from './duration'
import { generateMouthCues } from './lipsync'

export interface SpeechSynthesisResult {
  audio?: string
  lipsync: Lipsync
  durationMs: number
  useBrowserTts?: boolean
}

const MAX_TTS_CHARS = 220

function trimForTts(text: string): string {
  const t = text.trim()
  if (t.length <= MAX_TTS_CHARS) return t
  return `${t.slice(0, MAX_TTS_CHARS - 1)}…`
}

/** TTS از API سرور (mp3 + lipsync) */
async function fetchServerTts(text: string, lang: 'fa' | 'en'): Promise<SpeechSynthesisResult | null> {
  try {
    const res = await fetch('/api/lesson/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as SpeechSynthesisResult
    if (!data.lipsync?.mouthCues?.length) return null
    return data
  } catch {
    return null
  }
}

/** fallback مرورگر — بدون فایل صوتی؛ Avatar از speechSynthesis استفاده می‌کند */
function browserTtsFallback(text: string, lang: 'fa' | 'en'): SpeechSynthesisResult {
  const durationSec = estimateSpeechDurationSec(text, lang)
  return {
    lipsync: generateMouthCues(text, durationSec),
    durationMs: estimateSpeechDurationMs(text, lang),
    useBrowserTts: true,
  }
}

/** سنتز گفتار برای آواتار درس / چت */
export async function synthesizeSpeech(
  text: string,
  lang: 'fa' | 'en' = 'fa'
): Promise<SpeechSynthesisResult> {
  const safeText = trimForTts(text)
  if (!safeText) {
    return { lipsync: { mouthCues: [] }, durationMs: 0 }
  }

  const fromServer = await fetchServerTts(safeText, lang)
  if (fromServer?.audio) return fromServer

  return browserTtsFallback(safeText, lang)
}
