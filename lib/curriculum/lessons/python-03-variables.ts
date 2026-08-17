/**
 * سازگاری UI برای PY-03 — متغیرها
 */

import { getPython03VariablesScenario } from '@/lib/curriculum/scenarios/loadScenario'
import fullLesson from '@/lib/curriculum/scenarios/python-03-variables/python-03-variables-full.json'
import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'

export type Py03Band = 'A' | 'B' | 'both'

export type Py03StepId =
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

export interface Py03Step {
  id: Py03StepId
  title: string
  band: Py03Band
  narrator?: string
  stageMission?: string
  brief?: string
  missionChecklist?: MissionGoal[]
  dialogueLines?: { speaker: string; text: string }[]
}

export interface Python03VariablesLesson {
  id: 'python-03-variables'
  code: 'PY-03'
  title: string
  subtitle: string
  duration: string
  ages: { A: string; B: string }
  metaphor: { name: string; description: string }
  goals: string[]
  steps: Py03Step[]
  fullProcess: typeof fullLesson
}

function bandOf(step: ResolvedScenarioStep): Py03Band {
  if (step.track === 'A' || step.track === 'B') return step.track
  return 'both'
}

function mapStep(step: ResolvedScenarioStep): Py03Step {
  const id = step.id as Py03StepId
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

export function getPython03VariablesLesson(): Python03VariablesLesson {
  const scenario = getPython03VariablesScenario()

  return {
    id: 'python-03-variables',
    code: 'PY-03',
    title: fullLesson.title,
    subtitle: fullLesson.metaphor.title,
    duration: `${fullLesson.durationMinutes}′`,
    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },
    metaphor: {
      name: fullLesson.metaphor.title,
      description: fullLesson.metaphor.fullDescription,
    },
    goals: [
      'مقدار را در متغیر ذخیره و چندجا استفاده کند',
      'مقدار را وسط برنامه تغییر دهد',
      'جعبهٔ تعریف‌نشده را بشناسد',
    ],
    steps: scenario.steps.map(mapStep),
    fullProcess: fullLesson,
  }
}
