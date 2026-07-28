import { generateMouthCues } from '@/lib/lesson-tts/lipsync'
import { estimateSpeechDurationMs, estimateSpeechDurationSec } from '@/lib/lesson-tts/duration'

export const runtime = 'nodejs'

type Body = { text?: string; lang?: 'fa' | 'en' }

async function fetchGoogleTtsMp3(text: string, lang: 'fa' | 'en'): Promise<Buffer | null> {
  const tl = lang === 'fa' ? 'fa' : 'en'
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${tl}&q=${encodeURIComponent(text)}`

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })
    if (!res.ok) return null
    const buf = Buffer.from(await res.arrayBuffer())
    return buf.length > 100 ? buf : null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const text = body.text?.trim()
  const lang = body.lang === 'en' ? 'en' : 'fa'

  if (!text) {
    return Response.json({ error: 'text is required' }, { status: 400 })
  }

  const mp3 = await fetchGoogleTtsMp3(text.slice(0, 220), lang)

  if (!mp3) {
    const durationSec = estimateSpeechDurationSec(text, lang)
    return Response.json({
      lipsync: generateMouthCues(text, durationSec),
      durationMs: estimateSpeechDurationMs(text, lang),
      useBrowserTts: true,
    })
  }

  const durationSec = estimateSpeechDurationSec(text, lang)

  return Response.json({
    audio: mp3.toString('base64'),
    lipsync: generateMouthCues(text, durationSec),
    durationMs: estimateSpeechDurationMs(text, lang),
  })
}
