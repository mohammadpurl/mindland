/**
 * سازگاری UI برای PY-14 — پروژه پایانی
 */



import { getPython14CapstoneScenario } from '@/lib/curriculum/scenarios/loadScenario'

import fullLesson from '@/lib/curriculum/scenarios/python-14-capstone/python-14-capstone-full.json'

import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'



export type Py14Band = 'A' | 'B' | 'both'



export type Py14StepId =

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



export interface Py14Step {

  id: Py14StepId

  title: string

  band: Py14Band

  narrator?: string

  stageMission?: string

  brief?: string

  missionChecklist?: MissionGoal[]

  dialogueLines?: { speaker: string; text: string }[]

  starterCode?: string

}



export interface Python14CapstoneLesson {

  id: 'python-14-capstone'

  code: 'PY-14'

  title: string

  subtitle: string

  duration: string

  ages: { A: string; B: string }

  metaphor: { name: string; description: string }

  goals: string[]

  steps: Py14Step[]

  fullProcess: typeof fullLesson

}



function bandOf(step: ResolvedScenarioStep): Py14Band {

  if (step.track === 'A' || step.track === 'B') return step.track

  return 'both'

}



function mapStep(step: ResolvedScenarioStep): Py14Step {

  const id = step.id as Py14StepId

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



export function getPython14CapstoneLesson(): Python14CapstoneLesson {

  const scenario = getPython14CapstoneScenario()



  return {

    id: 'python-14-capstone',

    code: 'PY-14',

    title: fullLesson.title,

    subtitle: fullLesson.metaphor.title,

    duration: `${fullLesson.durationMinutes}′`,

    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },

    metaphor: {

      name: fullLesson.metaphor.title,

      description: fullLesson.metaphor.fullDescription,

    },

    goals: [
      'پروژهٔ خودش را طراحی و بسازد',
      'حداقل تابع + ساختار داده داشته باشد',
      'توضیح کوتاه در کامنت بنویسد',
    ],

    steps: scenario.steps.map(mapStep),

    fullProcess: fullLesson,

  }

}


