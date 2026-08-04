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
}

const LESSON_BY_ID: Record<string, ScenarioLessonSkeleton> = {
  'python-00-blocks': py00Lesson as ScenarioLessonSkeleton,
  'python-01-intro': py01Lesson as ScenarioLessonSkeleton,
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

export function getPython00SystemMessages() {
  return (py00System as { systemMessages?: { id: string; text: string }[] }).systemMessages ?? []
}

export function listScenarioLessonIds(): string[] {
  return Object.keys(LESSON_BY_ID)
}
