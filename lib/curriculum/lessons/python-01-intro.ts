/**
 * سازگاری UI برای PY-01
 */

import { getPython01IntroScenario } from '@/lib/curriculum/scenarios/loadScenario'
import fullLesson from '@/lib/curriculum/scenarios/python-01-intro/python-01-intro-full.json'
import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'

export type Py01Band = 'A' | 'B' | 'both'

export type Py01StepId =
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

export interface Py01Step {
  id: Py01StepId
  title: string
  band: Py01Band
  narrator?: string
  stageMission?: string
  brief?: string
  missionChecklist?: MissionGoal[]
  dialogueLines?: { speaker: string; text: string }[]
}

export interface Python01IntroLesson {
  id: 'python-01-intro'
  code: 'PY-01'
  title: string
  subtitle: string
  duration: string
  ages: { A: string; B: string }
  metaphor: { name: string; description: string }
  goals: string[]
  steps: Py01Step[]
  fullProcess: typeof fullLesson
}

function bandOf(step: ResolvedScenarioStep): Py01Band {
  if (step.track === 'A' || step.track === 'B') return step.track
  return 'both'
}

function mapStep(step: ResolvedScenarioStep): Py01Step {
  const id = step.id as Py01StepId
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

export function getPython01IntroLesson(): Python01IntroLesson {
  const scenario = getPython01IntroScenario()

  return {
    id: 'python-01-intro',
    code: 'PY-01',
    title: fullLesson.title,
    subtitle: fullLesson.metaphor.title,
    duration: `${fullLesson.durationMinutes}′`,
    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },
    metaphor: {
      name: fullLesson.metaphor.title,
      description: fullLesson.metaphor.fullDescription,
    },
    goals: [
      'یک خط کد را اجرا کند',
      'با print یک جمله را وادار کند مینی بگوید',
      'توضیح دهد چرا علامت جاافتاده مینی را قفل می‌کند',
    ],
    steps: scenario.steps.map(mapStep),
    fullProcess: fullLesson,
  }
}
