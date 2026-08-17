import type {
  ResolvedScenarioLesson,
  ResolvedScenarioStep,
  ScenarioDialogueFile,
  ScenarioLessonSkeleton,
} from './types'

import py00Lesson from './python-00-blocks/lesson.json'
import py00Intro from './python-00-blocks/dialogue/intro.json'
import py00Demo from './python-00-blocks/dialogue/demo.json'
import py00Guided from './python-00-blocks/dialogue/guided-practice.json'
import py00ChallengeA from './python-00-blocks/dialogue/challenge-a.json'
import py00ChallengeB from './python-00-blocks/dialogue/challenge-b.json'
import py00WrapUp from './python-00-blocks/dialogue/wrap-up.json'
import py00System from './python-00-blocks/dialogue/system-messages.json'

import py01Lesson from './python-01-intro/lesson.json'
import py01Intro from './python-01-intro/dialogue/intro.json'
import py01Demo from './python-01-intro/dialogue/demo.json'
import py01Guided from './python-01-intro/dialogue/guided-practice.json'
import py01ChallengeA from './python-01-intro/dialogue/challenge-a.json'
import py01ChallengeB from './python-01-intro/dialogue/challenge-b.json'
import py01WrapUp from './python-01-intro/dialogue/wrap-up.json'
import py01System from './python-01-intro/dialogue/system-messages.json'

import py02Lesson from './python-02-print-strings/lesson.json'
import py02Intro from './python-02-print-strings/dialogue/intro.json'
import py02Demo from './python-02-print-strings/dialogue/demo.json'
import py02Guided from './python-02-print-strings/dialogue/guided-practice.json'
import py02ChallengeA from './python-02-print-strings/dialogue/challenge-a.json'
import py02ChallengeB from './python-02-print-strings/dialogue/challenge-b.json'
import py02WrapUp from './python-02-print-strings/dialogue/wrap-up.json'
import py02System from './python-02-print-strings/dialogue/system-messages.json'

import py03Lesson from './python-03-variables/lesson.json'
import py03Intro from './python-03-variables/dialogue/intro.json'
import py03Demo from './python-03-variables/dialogue/demo.json'
import py03Guided from './python-03-variables/dialogue/guided-practice.json'
import py03ChallengeA from './python-03-variables/dialogue/challenge-a.json'
import py03ChallengeB from './python-03-variables/dialogue/challenge-b.json'
import py03WrapUp from './python-03-variables/dialogue/wrap-up.json'
import py03System from './python-03-variables/dialogue/system-messages.json'

import py04Lesson from './python-04-numbers/lesson.json'
import py04Intro from './python-04-numbers/dialogue/intro.json'
import py04Demo from './python-04-numbers/dialogue/demo.json'
import py04Guided from './python-04-numbers/dialogue/guided-practice.json'
import py04ChallengeA from './python-04-numbers/dialogue/challenge-a.json'
import py04ChallengeB from './python-04-numbers/dialogue/challenge-b.json'
import py04WrapUp from './python-04-numbers/dialogue/wrap-up.json'
import py04System from './python-04-numbers/dialogue/system-messages.json'

import py05Lesson from './python-05-input/lesson.json'
import py05Intro from './python-05-input/dialogue/intro.json'
import py05Demo from './python-05-input/dialogue/demo.json'
import py05Guided from './python-05-input/dialogue/guided-practice.json'
import py05ChallengeA from './python-05-input/dialogue/challenge-a.json'
import py05ChallengeB from './python-05-input/dialogue/challenge-b.json'
import py05WrapUp from './python-05-input/dialogue/wrap-up.json'
import py05System from './python-05-input/dialogue/system-messages.json'

import py06Lesson from './python-06-conditions/lesson.json'
import py06Intro from './python-06-conditions/dialogue/intro.json'
import py06Demo from './python-06-conditions/dialogue/demo.json'
import py06Guided from './python-06-conditions/dialogue/guided-practice.json'
import py06ChallengeA from './python-06-conditions/dialogue/challenge-a.json'
import py06ChallengeB from './python-06-conditions/dialogue/challenge-b.json'
import py06WrapUp from './python-06-conditions/dialogue/wrap-up.json'
import py06System from './python-06-conditions/dialogue/system-messages.json'

import py07Lesson from './python-07-for-loop/lesson.json'
import py07Intro from './python-07-for-loop/dialogue/intro.json'
import py07Demo from './python-07-for-loop/dialogue/demo.json'
import py07Guided from './python-07-for-loop/dialogue/guided-practice.json'
import py07ChallengeA from './python-07-for-loop/dialogue/challenge-a.json'
import py07ChallengeB from './python-07-for-loop/dialogue/challenge-b.json'
import py07WrapUp from './python-07-for-loop/dialogue/wrap-up.json'
import py07System from './python-07-for-loop/dialogue/system-messages.json'

import py08Lesson from './python-08-while-loop/lesson.json'
import py08Intro from './python-08-while-loop/dialogue/intro.json'
import py08Demo from './python-08-while-loop/dialogue/demo.json'
import py08Guided from './python-08-while-loop/dialogue/guided-practice.json'
import py08ChallengeA from './python-08-while-loop/dialogue/challenge-a.json'
import py08ChallengeB from './python-08-while-loop/dialogue/challenge-b.json'
import py08WrapUp from './python-08-while-loop/dialogue/wrap-up.json'
import py08System from './python-08-while-loop/dialogue/system-messages.json'

import py09Lesson from './python-09-lists/lesson.json'
import py09Intro from './python-09-lists/dialogue/intro.json'
import py09Demo from './python-09-lists/dialogue/demo.json'
import py09Guided from './python-09-lists/dialogue/guided-practice.json'
import py09ChallengeA from './python-09-lists/dialogue/challenge-a.json'
import py09ChallengeB from './python-09-lists/dialogue/challenge-b.json'
import py09WrapUp from './python-09-lists/dialogue/wrap-up.json'
import py09System from './python-09-lists/dialogue/system-messages.json'

import py10Lesson from './python-10-dicts/lesson.json'
import py10Intro from './python-10-dicts/dialogue/intro.json'
import py10Demo from './python-10-dicts/dialogue/demo.json'
import py10Guided from './python-10-dicts/dialogue/guided-practice.json'
import py10ChallengeA from './python-10-dicts/dialogue/challenge-a.json'
import py10ChallengeB from './python-10-dicts/dialogue/challenge-b.json'
import py10WrapUp from './python-10-dicts/dialogue/wrap-up.json'
import py10System from './python-10-dicts/dialogue/system-messages.json'

import py11Lesson from './python-11-functions/lesson.json'
import py11Intro from './python-11-functions/dialogue/intro.json'
import py11Demo from './python-11-functions/dialogue/demo.json'
import py11Guided from './python-11-functions/dialogue/guided-practice.json'
import py11ChallengeA from './python-11-functions/dialogue/challenge-a.json'
import py11ChallengeB from './python-11-functions/dialogue/challenge-b.json'
import py11WrapUp from './python-11-functions/dialogue/wrap-up.json'
import py11System from './python-11-functions/dialogue/system-messages.json'

import py12Lesson from './python-12-mini-project/lesson.json'
import py12Intro from './python-12-mini-project/dialogue/intro.json'
import py12Demo from './python-12-mini-project/dialogue/demo.json'
import py12Guided from './python-12-mini-project/dialogue/guided-practice.json'
import py12ChallengeA from './python-12-mini-project/dialogue/challenge-a.json'
import py12ChallengeB from './python-12-mini-project/dialogue/challenge-b.json'
import py12WrapUp from './python-12-mini-project/dialogue/wrap-up.json'
import py12System from './python-12-mini-project/dialogue/system-messages.json'

import py13Lesson from './python-13-turtle/lesson.json'
import py13Intro from './python-13-turtle/dialogue/intro.json'
import py13Demo from './python-13-turtle/dialogue/demo.json'
import py13Guided from './python-13-turtle/dialogue/guided-practice.json'
import py13ChallengeA from './python-13-turtle/dialogue/challenge-a.json'
import py13ChallengeB from './python-13-turtle/dialogue/challenge-b.json'
import py13WrapUp from './python-13-turtle/dialogue/wrap-up.json'
import py13System from './python-13-turtle/dialogue/system-messages.json'

import py14Lesson from './python-14-capstone/lesson.json'
import py14Intro from './python-14-capstone/dialogue/intro.json'
import py14Demo from './python-14-capstone/dialogue/demo.json'
import py14Guided from './python-14-capstone/dialogue/guided-practice.json'
import py14ChallengeA from './python-14-capstone/dialogue/challenge-a.json'
import py14ChallengeB from './python-14-capstone/dialogue/challenge-b.json'
import py14WrapUp from './python-14-capstone/dialogue/wrap-up.json'
import py14System from './python-14-capstone/dialogue/system-messages.json'

/** کلید: `{lessonId}/{dialogueFile}` */
const DIALOGUE_BY_KEY: Record<string, ScenarioDialogueFile> = {
  'python-00-blocks/dialogue/intro.json': py00Intro as ScenarioDialogueFile,
  'python-00-blocks/dialogue/demo.json': py00Demo as ScenarioDialogueFile,
  'python-00-blocks/dialogue/guided-practice.json': py00Guided as ScenarioDialogueFile,
  'python-00-blocks/dialogue/challenge-a.json': py00ChallengeA as ScenarioDialogueFile,
  'python-00-blocks/dialogue/challenge-b.json': py00ChallengeB as ScenarioDialogueFile,
  'python-00-blocks/dialogue/wrap-up.json': py00WrapUp as ScenarioDialogueFile,
  'python-00-blocks/dialogue/system-messages.json': py00System as ScenarioDialogueFile,

  'python-01-intro/dialogue/intro.json': py01Intro as ScenarioDialogueFile,
  'python-01-intro/dialogue/demo.json': py01Demo as ScenarioDialogueFile,
  'python-01-intro/dialogue/guided-practice.json': py01Guided as ScenarioDialogueFile,
  'python-01-intro/dialogue/challenge-a.json': py01ChallengeA as ScenarioDialogueFile,
  'python-01-intro/dialogue/challenge-b.json': py01ChallengeB as ScenarioDialogueFile,
  'python-01-intro/dialogue/wrap-up.json': py01WrapUp as ScenarioDialogueFile,
  'python-01-intro/dialogue/system-messages.json': py01System as ScenarioDialogueFile,

  'python-02-print-strings/dialogue/intro.json': py02Intro as ScenarioDialogueFile,
  'python-02-print-strings/dialogue/demo.json': py02Demo as ScenarioDialogueFile,
  'python-02-print-strings/dialogue/guided-practice.json': py02Guided as ScenarioDialogueFile,
  'python-02-print-strings/dialogue/challenge-a.json': py02ChallengeA as ScenarioDialogueFile,
  'python-02-print-strings/dialogue/challenge-b.json': py02ChallengeB as ScenarioDialogueFile,
  'python-02-print-strings/dialogue/wrap-up.json': py02WrapUp as ScenarioDialogueFile,
  'python-02-print-strings/dialogue/system-messages.json': py02System as ScenarioDialogueFile,

  'python-03-variables/dialogue/intro.json': py03Intro as ScenarioDialogueFile,
  'python-03-variables/dialogue/demo.json': py03Demo as ScenarioDialogueFile,
  'python-03-variables/dialogue/guided-practice.json': py03Guided as ScenarioDialogueFile,
  'python-03-variables/dialogue/challenge-a.json': py03ChallengeA as ScenarioDialogueFile,
  'python-03-variables/dialogue/challenge-b.json': py03ChallengeB as ScenarioDialogueFile,
  'python-03-variables/dialogue/wrap-up.json': py03WrapUp as ScenarioDialogueFile,
  'python-03-variables/dialogue/system-messages.json': py03System as ScenarioDialogueFile,

  'python-04-numbers/dialogue/intro.json': py04Intro as ScenarioDialogueFile,
  'python-04-numbers/dialogue/demo.json': py04Demo as ScenarioDialogueFile,
  'python-04-numbers/dialogue/guided-practice.json': py04Guided as ScenarioDialogueFile,
  'python-04-numbers/dialogue/challenge-a.json': py04ChallengeA as ScenarioDialogueFile,
  'python-04-numbers/dialogue/challenge-b.json': py04ChallengeB as ScenarioDialogueFile,
  'python-04-numbers/dialogue/wrap-up.json': py04WrapUp as ScenarioDialogueFile,
  'python-04-numbers/dialogue/system-messages.json': py04System as ScenarioDialogueFile,

  'python-05-input/dialogue/intro.json': py05Intro as ScenarioDialogueFile,
  'python-05-input/dialogue/demo.json': py05Demo as ScenarioDialogueFile,
  'python-05-input/dialogue/guided-practice.json': py05Guided as ScenarioDialogueFile,
  'python-05-input/dialogue/challenge-a.json': py05ChallengeA as ScenarioDialogueFile,
  'python-05-input/dialogue/challenge-b.json': py05ChallengeB as ScenarioDialogueFile,
  'python-05-input/dialogue/wrap-up.json': py05WrapUp as ScenarioDialogueFile,
  'python-05-input/dialogue/system-messages.json': py05System as ScenarioDialogueFile,

  'python-06-conditions/dialogue/intro.json': py06Intro as ScenarioDialogueFile,
  'python-06-conditions/dialogue/demo.json': py06Demo as ScenarioDialogueFile,
  'python-06-conditions/dialogue/guided-practice.json': py06Guided as ScenarioDialogueFile,
  'python-06-conditions/dialogue/challenge-a.json': py06ChallengeA as ScenarioDialogueFile,
  'python-06-conditions/dialogue/challenge-b.json': py06ChallengeB as ScenarioDialogueFile,
  'python-06-conditions/dialogue/wrap-up.json': py06WrapUp as ScenarioDialogueFile,
  'python-06-conditions/dialogue/system-messages.json': py06System as ScenarioDialogueFile,

  'python-07-for-loop/dialogue/intro.json': py07Intro as ScenarioDialogueFile,
  'python-07-for-loop/dialogue/demo.json': py07Demo as ScenarioDialogueFile,
  'python-07-for-loop/dialogue/guided-practice.json': py07Guided as ScenarioDialogueFile,
  'python-07-for-loop/dialogue/challenge-a.json': py07ChallengeA as ScenarioDialogueFile,
  'python-07-for-loop/dialogue/challenge-b.json': py07ChallengeB as ScenarioDialogueFile,
  'python-07-for-loop/dialogue/wrap-up.json': py07WrapUp as ScenarioDialogueFile,
  'python-07-for-loop/dialogue/system-messages.json': py07System as ScenarioDialogueFile,

  'python-08-while-loop/dialogue/intro.json': py08Intro as ScenarioDialogueFile,
  'python-08-while-loop/dialogue/demo.json': py08Demo as ScenarioDialogueFile,
  'python-08-while-loop/dialogue/guided-practice.json': py08Guided as ScenarioDialogueFile,
  'python-08-while-loop/dialogue/challenge-a.json': py08ChallengeA as ScenarioDialogueFile,
  'python-08-while-loop/dialogue/challenge-b.json': py08ChallengeB as ScenarioDialogueFile,
  'python-08-while-loop/dialogue/wrap-up.json': py08WrapUp as ScenarioDialogueFile,
  'python-08-while-loop/dialogue/system-messages.json': py08System as ScenarioDialogueFile,

  'python-09-lists/dialogue/intro.json': py09Intro as ScenarioDialogueFile,
  'python-09-lists/dialogue/demo.json': py09Demo as ScenarioDialogueFile,
  'python-09-lists/dialogue/guided-practice.json': py09Guided as ScenarioDialogueFile,
  'python-09-lists/dialogue/challenge-a.json': py09ChallengeA as ScenarioDialogueFile,
  'python-09-lists/dialogue/challenge-b.json': py09ChallengeB as ScenarioDialogueFile,
  'python-09-lists/dialogue/wrap-up.json': py09WrapUp as ScenarioDialogueFile,
  'python-09-lists/dialogue/system-messages.json': py09System as ScenarioDialogueFile,

  'python-10-dicts/dialogue/intro.json': py10Intro as ScenarioDialogueFile,
  'python-10-dicts/dialogue/demo.json': py10Demo as ScenarioDialogueFile,
  'python-10-dicts/dialogue/guided-practice.json': py10Guided as ScenarioDialogueFile,
  'python-10-dicts/dialogue/challenge-a.json': py10ChallengeA as ScenarioDialogueFile,
  'python-10-dicts/dialogue/challenge-b.json': py10ChallengeB as ScenarioDialogueFile,
  'python-10-dicts/dialogue/wrap-up.json': py10WrapUp as ScenarioDialogueFile,
  'python-10-dicts/dialogue/system-messages.json': py10System as ScenarioDialogueFile,

  'python-11-functions/dialogue/intro.json': py11Intro as ScenarioDialogueFile,
  'python-11-functions/dialogue/demo.json': py11Demo as ScenarioDialogueFile,
  'python-11-functions/dialogue/guided-practice.json': py11Guided as ScenarioDialogueFile,
  'python-11-functions/dialogue/challenge-a.json': py11ChallengeA as ScenarioDialogueFile,
  'python-11-functions/dialogue/challenge-b.json': py11ChallengeB as ScenarioDialogueFile,
  'python-11-functions/dialogue/wrap-up.json': py11WrapUp as ScenarioDialogueFile,
  'python-11-functions/dialogue/system-messages.json': py11System as ScenarioDialogueFile,

  'python-12-mini-project/dialogue/intro.json': py12Intro as ScenarioDialogueFile,
  'python-12-mini-project/dialogue/demo.json': py12Demo as ScenarioDialogueFile,
  'python-12-mini-project/dialogue/guided-practice.json': py12Guided as ScenarioDialogueFile,
  'python-12-mini-project/dialogue/challenge-a.json': py12ChallengeA as ScenarioDialogueFile,
  'python-12-mini-project/dialogue/challenge-b.json': py12ChallengeB as ScenarioDialogueFile,
  'python-12-mini-project/dialogue/wrap-up.json': py12WrapUp as ScenarioDialogueFile,
  'python-12-mini-project/dialogue/system-messages.json': py12System as ScenarioDialogueFile,

  'python-13-turtle/dialogue/intro.json': py13Intro as ScenarioDialogueFile,
  'python-13-turtle/dialogue/demo.json': py13Demo as ScenarioDialogueFile,
  'python-13-turtle/dialogue/guided-practice.json': py13Guided as ScenarioDialogueFile,
  'python-13-turtle/dialogue/challenge-a.json': py13ChallengeA as ScenarioDialogueFile,
  'python-13-turtle/dialogue/challenge-b.json': py13ChallengeB as ScenarioDialogueFile,
  'python-13-turtle/dialogue/wrap-up.json': py13WrapUp as ScenarioDialogueFile,
  'python-13-turtle/dialogue/system-messages.json': py13System as ScenarioDialogueFile,

  'python-14-capstone/dialogue/intro.json': py14Intro as ScenarioDialogueFile,
  'python-14-capstone/dialogue/demo.json': py14Demo as ScenarioDialogueFile,
  'python-14-capstone/dialogue/guided-practice.json': py14Guided as ScenarioDialogueFile,
  'python-14-capstone/dialogue/challenge-a.json': py14ChallengeA as ScenarioDialogueFile,
  'python-14-capstone/dialogue/challenge-b.json': py14ChallengeB as ScenarioDialogueFile,
  'python-14-capstone/dialogue/wrap-up.json': py14WrapUp as ScenarioDialogueFile,
  'python-14-capstone/dialogue/system-messages.json': py14System as ScenarioDialogueFile,
}

const LESSON_BY_ID: Record<string, ScenarioLessonSkeleton> = {
  'python-00-blocks': py00Lesson as ScenarioLessonSkeleton,
  'python-01-intro': py01Lesson as ScenarioLessonSkeleton,
  'python-02-print-strings': py02Lesson as ScenarioLessonSkeleton,
  'python-03-variables': py03Lesson as ScenarioLessonSkeleton,
  'python-04-numbers': py04Lesson as ScenarioLessonSkeleton,
  'python-05-input': py05Lesson as ScenarioLessonSkeleton,
  'python-06-conditions': py06Lesson as ScenarioLessonSkeleton,
  'python-07-for-loop': py07Lesson as ScenarioLessonSkeleton,
  'python-08-while-loop': py08Lesson as ScenarioLessonSkeleton,
  'python-09-lists': py09Lesson as ScenarioLessonSkeleton,
  'python-10-dicts': py10Lesson as ScenarioLessonSkeleton,
  'python-11-functions': py11Lesson as ScenarioLessonSkeleton,
  'python-12-mini-project': py12Lesson as ScenarioLessonSkeleton,
  'python-13-turtle': py13Lesson as ScenarioLessonSkeleton,
  'python-14-capstone': py14Lesson as ScenarioLessonSkeleton,
}

function resolveStep(
  lessonId: string,
  step: ScenarioLessonSkeleton['steps'][number]
): ResolvedScenarioStep {
  const key = step.dialogueFile ? `${lessonId}/${step.dialogueFile}` : null
  const dialogue = key && DIALOGUE_BY_KEY[key] ? DIALOGUE_BY_KEY[key] : null
  return { ...step, dialogue }
}

/**
 * بارگذاری اسکلت درس + فایل‌های دیالوگ کلاس.
 */
export function getScenarioLesson(lessonId: string): ResolvedScenarioLesson | null {
  const skeleton = LESSON_BY_ID[lessonId]
  if (!skeleton) return null
  return {
    ...skeleton,
    steps: skeleton.steps.map((s) => resolveStep(lessonId, s)),
  }
}

export function getPython00BlocksScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-00-blocks')
  if (!lesson) throw new Error('سناریوی python-00-blocks یافت نشد')
  return lesson
}

export function getPython01IntroScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-01-intro')
  if (!lesson) throw new Error('سناریوی python-01-intro یافت نشد')
  return lesson
}

export function getPython02PrintStringsScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-02-print-strings')
  if (!lesson) throw new Error('سناریوی python-02-print-strings یافت نشد')
  return lesson
}

export function getPython03VariablesScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-03-variables')
  if (!lesson) throw new Error('سناریوی python-03-variables یافت نشد')
  return lesson
}

export function getPython04NumbersScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-04-numbers')
  if (!lesson) throw new Error('سناریوی python-04-numbers یافت نشد')
  return lesson
}

export function getPython05InputScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-05-input')
  if (!lesson) throw new Error('سناریوی python-05-input یافت نشد')
  return lesson
}

export function getPython06ConditionsScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-06-conditions')
  if (!lesson) throw new Error('سناریوی python-06-conditions یافت نشد')
  return lesson
}

export function getPython07ForLoopScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-07-for-loop')
  if (!lesson) throw new Error('سناریوی python-07-for-loop یافت نشد')
  return lesson
}

export function getPython08WhileLoopScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-08-while-loop')
  if (!lesson) throw new Error('سناریوی python-08-while-loop یافت نشد')
  return lesson
}

export function getPython09ListsScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-09-lists')
  if (!lesson) throw new Error('سناریوی python-09-lists یافت نشد')
  return lesson
}

export function getPython10DictsScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-10-dicts')
  if (!lesson) throw new Error('سناریوی python-10-dicts یافت نشد')
  return lesson
}

export function getPython11FunctionsScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-11-functions')
  if (!lesson) throw new Error('سناریوی python-11-functions یافت نشد')
  return lesson
}

export function getPython12MiniProjectScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-12-mini-project')
  if (!lesson) throw new Error('سناریوی python-12-mini-project یافت نشد')
  return lesson
}

export function getPython13TurtleScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-13-turtle')
  if (!lesson) throw new Error('سناریوی python-13-turtle یافت نشد')
  return lesson
}

export function getPython14CapstoneScenario(): ResolvedScenarioLesson {
  const lesson = getScenarioLesson('python-14-capstone')
  if (!lesson) throw new Error('سناریوی python-14-capstone یافت نشد')
  return lesson
}

export function getPython00SystemMessages() {
  return (py00System as { systemMessages?: { id: string; text: string }[] }).systemMessages ?? []
}

export function listScenarioLessonIds(): string[] {
  return Object.keys(LESSON_BY_ID)
}
