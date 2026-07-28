/** تخمین مدت زمان گفتار فارسی (ثانیه) */
export function estimateSpeechDurationSec(text: string, lang: 'fa' | 'en' = 'fa'): number {
  const trimmed = text.trim()
  if (!trimmed) return 0

  const chars = trimmed.replace(/\s+/g, '').length
  const msPerChar = lang === 'fa' ? 95 : 75
  const baseMs = lang === 'fa' ? 900 : 700

  return Math.min(28, Math.max(baseMs / 1000, (chars * msPerChar) / 1000))
}

export function estimateSpeechDurationMs(text: string, lang: 'fa' | 'en' = 'fa'): number {
  return Math.round(estimateSpeechDurationSec(text, lang) * 1000)
}
