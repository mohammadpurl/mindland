import type { Lipsync } from '@/types/type'

const PERSIAN_VOWEL_VISEME: Record<string, string> = {
  ا: 'D',
  آ: 'D',
  و: 'F',
  ی: 'C',
  ئ: 'C',
  ى: 'C',
  ع: 'A',
  ه: 'A',
  ة: 'A',
}

const DEFAULT_VISEMES = ['D', 'C', 'E', 'A', 'F'] as const
const MIN_CUE_SEC = 0.14
const CHARS_PER_CUE = 4

function visemeForChunk(chunk: string, index: number): string {
  for (const char of chunk) {
    if (PERSIAN_VOWEL_VISEME[char]) return PERSIAN_VOWEL_VISEME[char]
  }
  return DEFAULT_VISEMES[index % DEFAULT_VISEMES.length]
}

function chunkText(text: string): string[] {
  const chars = [...text.trim()].filter((c) => c.trim().length > 0)
  const chunks: string[] = []
  for (let i = 0; i < chars.length; i += CHARS_PER_CUE) {
    chunks.push(chars.slice(i, i + CHARS_PER_CUE).join(''))
  }
  return chunks
}

/** mouthCues آرام‌تر — جلوگیری از لرزش صورت/بدن */
export function generateMouthCues(text: string, durationSec: number): Lipsync {
  const chunks = chunkText(text)
  if (chunks.length === 0 || durationSec <= 0) {
    return { mouthCues: [] }
  }

  const slot = Math.max(MIN_CUE_SEC, durationSec / chunks.length)

  return {
    mouthCues: chunks.map((chunk, i) => ({
      start: i * slot,
      end: (i + 1) * slot,
      value: visemeForChunk(chunk, i),
    })),
  }
}
