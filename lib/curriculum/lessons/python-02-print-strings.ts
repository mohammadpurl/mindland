/**
 * سازگاری UI برای PY-02 — print و رشته‌ها
 */

import { getPython02PrintStringsScenario } from '@/lib/curriculum/scenarios/loadScenario'
import fullLesson from '@/lib/curriculum/scenarios/python-02-print-strings/python-02-print-strings-full.json'
import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'

export type Py02Band = 'A' | 'B' | 'both'

export type Py02StepId =
  | 'intro'
  | 'demo'
  | 'guided-practice'
  | 'challenge-a'
  | 'challenge-b'
  | 'wrap-up'

export interface MissionGoal {
  id: string
  label: string
}

export interface Py02Step {
  id: Py02StepId
  title: string
  band: Py02Band
  narrator?: string
  stageMission?: string
  brief?: string
  missionChecklist?: MissionGoal[]
  dialogueLines?: { speaker: string; text: string }[]
}

export interface Python02PrintStringsLesson {
  id: 'python-02-print-strings'
  code: 'PY-02'
  title: string
  subtitle: string
  duration: string
  ages: { A: string; B: string }
  metaphor: { name: string; description: string }
  goals: string[]
  steps: Py02Step[]
  fullProcess: typeof fullLesson
}

function bandOf(step: ResolvedScenarioStep): Py02Band {
  if (step.track === 'A' || step.track === 'B') return step.track
  return 'both'
}

function mapStep(step: ResolvedScenarioStep): Py02Step {
  const id = step.id as Py02StepId
  const fullStep = fullLesson.steps.find((s) => s.id === id)

  const brief =
    (step.dialogue && 'brief' in step.dialogue
      ? (step.dialogue as { brief?: string }).brief
      : undefined) ||
    (fullStep && 'brief' in fullStep ? (fullStep as { brief?: string }).brief : undefined) ||
    (step as { brief?: string }).brief

  const stageMission =
    (fullStep && 'stageMission' in fullStep
      ? (fullStep as { stageMission?: string }).stageMission
      : undefined) ||
    (step as { stageMission?: string }).stageMission ||
    brief

  let missionChecklist: MissionGoal[] | undefined
  if (fullStep && 'missionChecklist' in fullStep && Array.isArray(fullStep.missionChecklist)) {
    missionChecklist = fullStep.missionChecklist as MissionGoal[]
  } else if (
    step.dialogue &&
    'missionChecklist' in step.dialogue &&
    Array.isArray((step.dialogue as { missionChecklist?: MissionGoal[] }).missionChecklist)
  ) {
    missionChecklist = (step.dialogue as { missionChecklist: MissionGoal[] }).missionChecklist
  }

  return {
    id,
    title: step.title,
    band: bandOf(step),
    narrator: step.dialogue?.lines.find((l) => l.speaker === 'avatar')?.text,
    stageMission,
    brief,
    missionChecklist,
    dialogueLines: step.dialogue?.lines
      .filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')
      .map((l) => ({ speaker: 'avatar', text: l.text })),
  }
}

export function getPython02PrintStringsLesson(): Python02PrintStringsLesson {
  const scenario = getPython02PrintStringsScenario()

  return {
    id: 'python-02-print-strings',
    code: 'PY-02',
    title: fullLesson.title,
    subtitle: fullLesson.metaphor.title,
    duration: `${fullLesson.durationMinutes}′`,
    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },
    metaphor: {
      name: fullLesson.metaphor.title,
      description: fullLesson.metaphor.fullDescription,
    },
    goals: [
      'چند خط print پشت سر هم بنویسد',
      'نگهبان‌های جفت گیومه را درست به‌کار ببرد',
      'توضیح دهد چرا نگهبان ناجور وسط خط قفل می‌کند',
    ],
    steps: scenario.steps.map(mapStep),
    fullProcess: fullLesson,
  }
}
