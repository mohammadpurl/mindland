import type { Curriculum, CurriculumLessonRef, CurriculumSubject, CurriculumTopic } from './types'
import curriculumData from './math-grade-6.json'
import type { OrchestratorLesson, OrchestratorLessonInput } from '../types'
import { resolveLessonSteps } from '../generators/resolve-practice'
import fraction01 from '../lessons/fraction-01-intro.json'
import fraction02 from '../lessons/fraction-02-numerator.json'
import fraction03 from '../lessons/fraction-03-compare.json'
import fraction04 from '../lessons/fraction-04-compare-practice.json'
import fraction05 from '../lessons/fraction-05-add-same-denom.json'
import fraction06Lcm from '../lessons/fraction-06-lcm-concept.json'
import fraction06 from '../lessons/fraction-06-common-denominator.json'
import fraction07 from '../lessons/fraction-07-add-diff-denom.json'
import fraction08 from '../lessons/fraction-08-subtract.json'
import fraction09 from '../lessons/fraction-09-textbook-add-sub.json'
import fraction10 from '../lessons/fraction-10-textbook-compare.json'
import fraction11 from '../lessons/fraction-11-textbook-multiply.json'
import geometry01 from '../lessons/geometry-01-area-friends.json'
import fractionCircleIntro from '../lessons/fraction-circle-intro.json'

const CURRICULUM = curriculumData as Curriculum

/** درس‌های خام JSON — ممکن است گام generator داشته باشند */
const LESSON_RAW: Record<string, OrchestratorLessonInput> = {
  [fraction01.id]: fraction01 as OrchestratorLessonInput,
  [fraction02.id]: fraction02 as OrchestratorLessonInput,
  [fraction03.id]: fraction03 as OrchestratorLessonInput,
  [fraction04.id]: fraction04 as OrchestratorLessonInput,
  [fraction05.id]: fraction05 as OrchestratorLessonInput,
  [fraction06Lcm.id]: fraction06Lcm as OrchestratorLessonInput,
  [fraction06.id]: fraction06 as OrchestratorLessonInput,
  [fraction07.id]: fraction07 as OrchestratorLessonInput,
  [fraction08.id]: fraction08 as OrchestratorLessonInput,
  [fraction09.id]: fraction09 as OrchestratorLessonInput,
  [fraction10.id]: fraction10 as OrchestratorLessonInput,
  [fraction11.id]: fraction11 as OrchestratorLessonInput,
  [geometry01.id]: geometry01 as OrchestratorLessonInput,
  [fractionCircleIntro.id]: fractionCircleIntro as OrchestratorLessonInput,
}

function resolveLesson(raw: OrchestratorLessonInput): OrchestratorLesson {
  return {
    ...raw,
    steps: resolveLessonSteps(raw.steps) as OrchestratorLesson['steps'],
  }
}

export function getCurriculum(): Curriculum {
  return CURRICULUM
}

export function getSubject(subjectId: string): CurriculumSubject | null {
  return CURRICULUM.subjects.find((s) => s.id === subjectId) ?? null
}

export function getTopic(subjectId: string, topicId: string): CurriculumTopic | null {
  const subject = getSubject(subjectId)
  return subject?.topics.find((t) => t.id === topicId) ?? null
}

export function getTopicLessons(subjectId: string, topicId: string): CurriculumLessonRef[] {
  const topic = getTopic(subjectId, topicId)
  if (!topic) return []
  return [...topic.lessons].sort((a, b) => a.order - b.order)
}

export function getLessonFromCurriculum(lessonId: string): OrchestratorLesson | null {
  const raw = LESSON_RAW[lessonId]
  if (!raw) return null
  return resolveLesson(raw)
}

export function getAllCurriculumLessons(): OrchestratorLesson[] {
  return Object.values(LESSON_RAW).map(resolveLesson)
}

/** درس بعدی در همان موضوع */
export function getNextLessonRef(
  subjectId: string,
  topicId: string,
  currentLessonId: string
): CurriculumLessonRef | null {
  const lessons = getTopicLessons(subjectId, topicId)
  const idx = lessons.findIndex((l) => l.id === currentLessonId)
  if (idx < 0 || idx >= lessons.length - 1) return null
  return lessons[idx + 1]
}
