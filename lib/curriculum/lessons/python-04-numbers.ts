/**
 * سازگاری UI برای PY-04 — اعداد و عملیات
 */

import { getPython04NumbersScenario } from '@/lib/curriculum/scenarios/loadScenario'
import fullLesson from '@/lib/curriculum/scenarios/python-04-numbers/python-04-numbers-full.json'
import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'

export type Py04Band = 'A' | 'B' | 'both'

export type Py04StepId =
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

export interface Py04Step {
  id: Py04StepId
  title: string
  band: Py04Band
  narrator?: string
  stageMission?: string
  brief?: string
  missionChecklist?: MissionGoal[]
  dialogueLines?: { speaker: string; text: string }[]
}

export interface Python04NumbersLesson {
  id: 'python-04-numbers'
  code: 'PY-04'
  title: string
  subtitle: string
  duration: string
  ages: { A: string; B: string }
  metaphor: { name: string; description: string }
  goals: string[]
  steps: Py04Step[]
  fullProcess: typeof fullLesson
}

function bandOf(step: ResolvedScenarioStep): Py04Band {
  if (step.track === 'A' || step.track === 'B') return step.track
  return 'both'
}

function mapStep(step: ResolvedScenarioStep): Py04Step {
  const id = step.id as Py04StepId
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

export function getPython04NumbersLesson(): Python04NumbersLesson {
  const scenario = getPython04NumbersScenario()

  return {
    id: 'python-04-numbers',
    code: 'PY-04',
    title: fullLesson.title,
    subtitle: fullLesson.metaphor.title,
    duration: `${fullLesson.durationMinutes}′`,
    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },
    metaphor: {
      name: fullLesson.metaphor.title,
      description: fullLesson.metaphor.fullDescription,
    },
    goals: [
      'چهار عمل اصلی را با اعداد واقعی بنویسد',
      'فرق متن عددی و عدد واقعی را بفهمد',
      'پرانتز و باقی‌مانده را به‌کار ببرد (رده B)',
    ],
    steps: scenario.steps.map(mapStep),
    fullProcess: fullLesson,
  }
}
