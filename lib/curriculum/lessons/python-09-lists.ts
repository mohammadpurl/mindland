/**

 * سازگاری UI برای PY-09 — لیست‌ها

 */



import { getPython09ListsScenario } from '@/lib/curriculum/scenarios/loadScenario'

import fullLesson from '@/lib/curriculum/scenarios/python-09-lists/python-09-lists-full.json'

import type { ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'



export type Py09Band = 'A' | 'B' | 'both'



export type Py09StepId =

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



export interface Py09Step {

  id: Py09StepId

  title: string

  band: Py09Band

  narrator?: string

  stageMission?: string

  brief?: string

  missionChecklist?: MissionGoal[]

  dialogueLines?: { speaker: string; text: string }[]

  starterCode?: string

}



export interface Python09ListsLesson {

  id: 'python-09-lists'

  code: 'PY-09'

  title: string

  subtitle: string

  duration: string

  ages: { A: string; B: string }

  metaphor: { name: string; description: string }

  goals: string[]

  steps: Py09Step[]

  fullProcess: typeof fullLesson

}



function bandOf(step: ResolvedScenarioStep): Py09Band {

  if (step.track === 'A' || step.track === 'B') return step.track

  return 'both'

}



function mapStep(step: ResolvedScenarioStep): Py09Step {

  const id = step.id as Py09StepId

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



export function getPython09ListsLesson(): Python09ListsLesson {

  const scenario = getPython09ListsScenario()



  return {

    id: 'python-09-lists',

    code: 'PY-09',

    title: fullLesson.title,

    subtitle: fullLesson.metaphor.title,

    duration: `${fullLesson.durationMinutes}′`,

    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },

    metaphor: {

      name: fullLesson.metaphor.title,

      description: fullLesson.metaphor.fullDescription,

    },

    goals: [

      'لیست بسازد و با append عضو اضافه کند',

      'با for روی لیست چاپ کند',

      'با in جست‌وجو کند و عضو را عوض کند (رده B)',

    ],

    steps: scenario.steps.map(mapStep),

    fullProcess: fullLesson,

  }

}


