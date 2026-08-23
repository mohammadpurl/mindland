const DEFAULT_BASE = '/lesson-media'

function mediaBase(): string {
  const env = process.env.NEXT_PUBLIC_LESSON_MEDIA_BASE?.trim()
  if (!env) return DEFAULT_BASE
  return env.replace(/\/$/, '')
}

/** Resolve stable mediaKey to public audio/lipsync URLs */
export function resolveLessonMediaUrl(mediaKey: string): {
  audioUrl: string
  lipsyncUrl: string
} {
  const base = mediaBase()
  const normalized = mediaKey.replace(/^\/+/, '').replace(/\.mp3$/, '')
  return {
    audioUrl: `${base}/${normalized}.mp3`,
    lipsyncUrl: `${base}/${normalized}.lipsync.json`,
  }
}

/** Fetch lipsync JSON for a mediaKey (cached by browser) */
export async function fetchLessonLipsync(mediaKey: string) {
  const { lipsyncUrl } = resolveLessonMediaUrl(mediaKey)
  const res = await fetch(lipsyncUrl)
  if (!res.ok) {
    throw new Error(`Failed to load lipsync: ${lipsyncUrl}`)
  }
  return res.json() as Promise<{ mouthCues: { start: number; end: number; value: string }[] }>
}

export interface ScenarioStepManifestItem {
  id: string
  source: string
  text: string
  dialogueFile: string
  audio: string
  lipsync: string
}

const stepManifestCache = new Map<string, Promise<ScenarioStepManifestItem[]>>()

/**
 * Pre-generated scenario audio/lipsync (from backEnd/scripts/generate_scenario_audio.py)
 * is written per lesson step to /audio/scenarios/<lessonId>/<stepId>/manifest.json,
 * in the same order as the avatar lines in the step's dialogue JSON.
 */
export async function fetchStepManifest(
  lessonId: string,
  stepId: string
): Promise<ScenarioStepManifestItem[]> {
  const key = `${lessonId}/${stepId}`
  let cached = stepManifestCache.get(key)
  if (!cached) {
    cached = fetch(`/audio/scenarios/${lessonId}/${stepId}/manifest.json`)
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data: { items?: ScenarioStepManifestItem[] }) => data.items ?? [])
      .catch(() => [])
    stepManifestCache.set(key, cached)
  }
  return cached
}

/** Resolve pre-generated audio/lipsync for a step's Nth avatar line, matched by text with index fallback */
export async function resolveStepLineMedia(
  lessonId: string,
  stepId: string,
  lineIndex: number,
  text: string
): Promise<{ audioUrl: string; lipsyncUrl: string } | null> {
  const items = await fetchStepManifest(lessonId, stepId)
  const item = items.find((it) => it.text === text) ?? items[lineIndex]
  if (!item) return null
  return { audioUrl: item.audio, lipsyncUrl: item.lipsync }
}
