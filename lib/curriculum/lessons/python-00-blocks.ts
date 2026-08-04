/**

 * سازگاری با UI — منبع حقیقت نسخه ۲:

 * - python-00-blocks-full.json → کل پروسهٔ درس

 * - dialogue/*.json → گفته‌ها + systemMessage

 * - lesson.json → ایندکس سبک

 */



import { getPython00BlocksScenario } from '@/lib/curriculum/scenarios/loadScenario'

import fullLesson from '@/lib/curriculum/scenarios/python-00-blocks/python-00-blocks-full.json'

import type { ResolvedScenarioLesson, ResolvedScenarioStep } from '@/lib/curriculum/scenarios/types'



export type BlockLessonBand = 'A' | 'B' | 'both'



export type BlockLessonStepId =

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



export interface BlockLessonStep {

  id: BlockLessonStepId

  title: string

  band: BlockLessonBand

  narrator?: string

  body: string[]

  bullets?: string[]

  challengePrompt?: string

  challengeGoal?: string

  stageMission?: string

  brief?: string

  missionChecklist?: MissionGoal[]

  dialogueLines?: { speaker: string; text: string }[]

  wrapUpLines?: string[]

}



export interface Python00BlocksLesson {

  id: 'python-00-blocks'

  code: 'PY-00'

  title: string

  subtitle: string

  duration: string

  optional: true

  ages: { A: string; B: string }

  metaphor: { name: string; description: string }

  goals: string[]

  forbiddenTerms: string[]

  steps: BlockLessonStep[]

  wrapUpLines: string[]

  systemMessages: { id: string; text: string }[]

  scratchHint: string

  fullProcess: typeof fullLesson

}



function bandOf(step: ResolvedScenarioStep): BlockLessonBand {

  if (step.track === 'A' || step.track === 'B') return step.track

  return 'both'

}



function narratorFrom(step: ResolvedScenarioStep): string | undefined {

  const firstAvatar = step.dialogue?.lines.find(

    (l) => l.speaker === 'avatar' || l.speaker === 'narrator'

  )

  return firstAvatar?.text ?? step.narratorScript

}



function bodyFrom(step: ResolvedScenarioStep): string[] {

  return (

    step.dialogue?.lines

      .filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')

      .map((l) => l.text) ?? []

  )

}



function mapStep(step: ResolvedScenarioStep): BlockLessonStep {

  const id = step.id as BlockLessonStepId

  const fullStep = fullLesson.steps.find((s) => s.id === id)



  const challengePrompt =

    fullStep && 'taskDescription' in fullStep && typeof fullStep.taskDescription === 'string'

      ? fullStep.taskDescription

      : undefined



  const briefFromDialogue =

    step.dialogue && 'brief' in step.dialogue && typeof (step.dialogue as { brief?: string }).brief === 'string'

      ? (step.dialogue as { brief: string }).brief

      : undefined



  const brief =

    briefFromDialogue ||

    (fullStep && 'brief' in fullStep && typeof fullStep.brief === 'string' ? fullStep.brief : undefined) ||

    (step as { brief?: string }).brief



  const stageMission =

    (fullStep && 'stageMission' in fullStep && typeof fullStep.stageMission === 'string'

      ? fullStep.stageMission

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

    narrator: narratorFrom(step),

    body: bodyFrom(step),

    challengePrompt: brief || challengePrompt,

    stageMission,

    brief,

    missionChecklist,

    dialogueLines: step.dialogue?.lines

      .filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')

      .map((l) => ({ speaker: 'avatar', text: l.text })),

    wrapUpLines:

      id === 'wrap-up'

        ? (step.dialogue?.lines

            .filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')

            .map((l) => l.text) ?? [])

        : undefined,

  }

}



function adapt(scenario: ResolvedScenarioLesson): Python00BlocksLesson {

  const wrapFromDialogue = scenario.steps

    .find((s) => s.id === 'wrap-up')

    ?.dialogue?.lines.filter((l) => l.speaker === 'avatar' || l.speaker === 'narrator')

    .map((l) => l.text)



  return {

    id: 'python-00-blocks',

    code: 'PY-00',

    title: fullLesson.title,

    subtitle: fullLesson.metaphor.title,

    duration: `${fullLesson.durationMinutes}′`,

    optional: true,

    ages: { A: '۹–۱۱ سال', B: '۱۲–۱۴ سال' },

    metaphor: {

      name: fullLesson.metaphor.title,

      description: fullLesson.metaphor.fullDescription,

    },

    goals: [

      'توالی‌ای بسازد که مینی بدون گیر کردن به لبه «آماده‌ام!» بگوید',

      'توضیح دهد چرا ترتیب اشتباه نمایش را خراب می‌کند',

      'به‌جای کپی‌های جدا، با یک بلوک تکرار همان کار را چندبار اجرا کند',
      'با قانون لبه از خرابی نمایش جلوگیری کند',

    ],

    forbiddenTerms: ['پایتون', 'متغیر', 'نوع داده', 'تایپ کد'],

    steps: scenario.steps.map(mapStep),

    wrapUpLines: wrapFromDialogue ?? [],

    systemMessages: fullLesson.systemMessages ?? [],

    scratchHint: fullLesson.productImplementationNotes.componentDependency,

    fullProcess: fullLesson,

  }

}



export function getPython00BlocksLesson(): Python00BlocksLesson {

  return adapt(getPython00BlocksScenario())

}



export function getPython00BlocksFullProcess() {

  return fullLesson

}



export { getPython00BlocksScenario }

