/**
 * سازگاری UI برای PY-13 — رسم با turtle
 */



import { getPython13TurtleScenario } from '@/lib/curriculum/scenarios/loadScenario'

import fullLesson from '@/lib/curriculum/scenarios/python-13-turtle/python-13-turtle-full.json'

import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'



export type Py13Band = 'A' | 'B' | 'both'



export type Py13StepId =

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



export interface Py13Step {

  id: Py13StepId

  title: string

  band: Py13Band

  narrator?: string

  stageMission?: string

  brief?: string

  missionChecklist?: MissionGoal[]

  dialogueLines?: { speaker: string; text: string }[]

  starterCode?: string

}



export interface Python13TurtleLesson {

  id: 'python-13-turtle'

  code: 'PY-13'

  title: string

  subtitle: string

  duration: string

  ages: { A: string; B: string }

  metaphor: { name: string; description: string }

  goals: string[]

  steps: Py13Step[]

  fullProcess: typeof fullLesson

}



function bandOf(step: ResolvedScenarioStep): Py13Band {

  if (step.track === 'A' || step.track === 'B') return step.track

  return 'both'

}



function mapStep(step: ResolvedScenarioStep): Py13Step {

  const id = step.id as Py13StepId

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



  const starterCode =

    (fullStep && 'starterCode' in fullStep

      ? (fullStep as { starterCode?: string }).starterCode

      : undefined) ||

    (step as { starterCode?: string }).starterCode



  return {

    id,

    title: step.title,

    band: bandOf(step),

    narrator: step.dialogue?.lines.find((l) => l.speaker === 'avatar')?.text,

    stageMission,

    brief,

    missionChecklist,

    starterCode,

    dialogueLines: step.dialogue?.lines

      .filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')

      .map((l) => ({ speaker: 'avatar', text: l.text })),

  }

}



export function getPython13TurtleLesson(): Python13TurtleLesson {

  const scenario = getPython13TurtleScenario()



  return {

    id: 'python-13-turtle',

    code: 'PY-13',

    title: fullLesson.title,

    subtitle: fullLesson.metaphor.title,

    duration: `${fullLesson.durationMinutes}′`,

    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },

    metaphor: {

      name: fullLesson.metaphor.title,

      description: fullLesson.metaphor.fullDescription,

    },

    goals: [
      'turtle import کند',
      'forward و turn استفاده کند',
      'شکل روی بوم بکشد',
    ],

    steps: scenario.steps.map(mapStep),

    fullProcess: fullLesson,

  }

}


