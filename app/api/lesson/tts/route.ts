import { generateMouthCues } from '@/lib/lesson-tts/lipsync'
import { estimateSpeechDurationMs, estimateSpeechDurationSec } from '@/lib/lesson-tts/duration'

export const runtime = 'nodejs'

const MAX_TEXT_LEN = 220
const RATE_WINDOW_MS = 60_000
const RATE_MAX_PER_WINDOW = 30

type Body = { text?: unknown; lang?: unknown }

/** Best-effort in-memory rate limit (resets per serverless isolate). */
const rateBuckets = new Map<string, { count: number; resetAt: number }>()

function clientIp(request: Request): string {
  const xf = request.headers.get('x-forwarded-for')
  if (xf) return xf.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

function allowRequest(key: string): boolean {
  const now = Date.now()
  const bucket = rateBuckets.get(key)
  if (!bucket || now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (bucket.count >= RATE_MAX_PER_WINDOW) return false
  bucket.count += 1
  return true
}

function isAllowedOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== 'production') return true

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')
  if (!host) return false

  const allowedHosts = new Set<string>([host])
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (site) {
    try {
      allowedHosts.add(new URL(site).host)
    } catch {
      /* ignore */
    }
  }

  if (origin) {
    try {
      return allowedHosts.has(new URL(origin).host)
    } catch {
      return false
    }
  }

  if (referer) {
    try {
      return allowedHosts.has(new URL(referer).host)
    } catch {
      return false
    }
  }

  // Same-origin fetch from browser usually sends Origin; reject bare clients in prod
  return false
}

function parseBody(raw: Body): { text: string; lang: 'fa' | 'en' } | { error: string } {
  if (typeof raw.text !== 'string') return { error: 'text must be a string' }
  const text = raw.text.trim()
  if (!text) return { error: 'text is required' }
  if (text.length > MAX_TEXT_LEN) return { error: `text max length is ${MAX_TEXT_LEN}` }
  const lang = raw.lang === 'en' ? 'en' : 'fa'
  return { text: text.slice(0, MAX_TEXT_LEN), lang }
}

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
  if (!isAllowedOrigin(request)) {
    return Response.json({ error: 'Forbidden origin' }, { status: 403 })
  }

  const ip = clientIp(request)
  if (!allowRequest(`tts:${ip}`)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: Body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseBody(body)
  if ('error' in parsed) {
    return Response.json({ error: parsed.error }, { status: 400 })
  }

  const { text, lang } = parsed
  const mp3 = await fetchGoogleTtsMp3(text, lang)

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
