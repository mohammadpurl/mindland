/** انواع اسکلت سناریوی درس (JSON-driven) */

export type ScenarioTrack = 'A' | 'B'

export type ScenarioStepType = 'teach' | 'practice'

export type DialogueSpeaker = 'avatar' | 'narrator'

/** یادداشت تولید/معلم — روی صفحه دانش‌آموز خوانده نمی‌شود */
export interface ScenarioProductionNote {
  text: string
  beat?: string
}

export interface ScenarioDialogueLine {
  /** فقط گفتهٔ کاراکتر GLB */
  speaker: DialogueSpeaker
  text: string
  beat?: string
  animation?: string
}

export interface ScenarioDialogueFile {
  stepId: string
  title?: string
  track?: ScenarioTrack
  maxDurationMinutes?: number
  /** آنچه کاراکتر می‌گوید — منبع UI و TTS (یا بعداً بک‌اند) */
  lines: ScenarioDialogueLine[]
  /** نکات تولید؛ نمایش داده نمی‌شود */
  productionNotes?: Array<string | ScenarioProductionNote>
  /** پیام‌های سیستم نمایش — نه دیالوگ معلم */
  systemMessages?: { id: string; when?: string; text: string }[]
  missionChecklist?: { id: string; label: string }[]
  brief?: string
  errorScripts?: { when: string; say: string; why?: string; errorId?: string }[]
  toneRule?: string
  successCriteria?: string[]
  pedagogicalGoal?: string
  ageRange?: string
  demoBlocks?: Record<string, unknown> | Array<Record<string, unknown>>
}

export interface ScenarioConcept {
  id: string
  label: string
  introducedAt: string
  note?: string
}

export interface ScenarioMetaphor {
  title: string
  description: string
}

export interface ScenarioCommonError {
  error: string
  cause: string
  teacherResponse: string
}

export interface ScenarioStepBase {
  id: string
  type: ScenarioStepType
  title: string
  /** مسیر نسبی داخل پوشهٔ سناریو، مثلاً dialogue/intro.json */
  dialogueFile?: string
  track?: ScenarioTrack
  description?: string
  goal?: string
  maxDurationMinutes?: number
  narratorScript?: string
  instructions?: string[]
  stageMission?: string
  brief?: string
  requiredConcepts?: string[]
  commonErrors?: ScenarioCommonError[]
  media?: {
    type: string
    provider?: string
    note?: string
  }
  starterProject?: {
    hasCharacter?: boolean
    availableBlocks?: string[]
    emptyStage?: boolean
  }
  actions?: { order: number; block: string; narratorNote?: string }[]
  orderSwapDemo?: { description: string; narratorScript: string }
  additionalBlocks?: {
    concept: string
    block: string
    narratorScript: string
  }[]
}

export interface ScenarioLessonSkeleton {
  id: string
  title: string
  order: number
  optional: boolean
  prerequisite: string | null
  durationMinutes: number
  tracks: ScenarioTrack[]
  goal: string
  metaphor: ScenarioMetaphor & { fullDescription?: string }
  note?: string
  sourceFile?: string
  measurableOutcomes?: string[]
  concepts?: ScenarioConcept[]
  excludedConcepts?: string[]
  productNotes?: {
    componentDependency?: string
    skipMechanism?: string
    nextLesson?: string | null
  }
  productImplementationNotes?: {
    componentDependency?: string
    skipMechanism?: string
    nextLessonId?: string | null
  }
  dialogueDir?: string
  steps: ScenarioStepBase[]
}

/** اسکلت + دیالوگِ resolve‌شدهٔ هر مرحله */
export interface ResolvedScenarioStep extends ScenarioStepBase {
  dialogue: ScenarioDialogueFile | null
}

export interface ResolvedScenarioLesson extends Omit<ScenarioLessonSkeleton, 'steps'> {
  steps: ResolvedScenarioStep[]
}
