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
import fraction12 from '../lessons/fraction-12-reciprocal.json'
import fraction13 from '../lessons/fraction-13-equal-fractions.json'
import fraction14 from '../lessons/fraction-14-textbook-multiply-2.json'
import fraction15 from '../lessons/fraction-15-textbook-divide-2.json'
import fraction16 from '../lessons/fraction-16-compare-order-advanced.json'
import fraction17 from '../lessons/fraction-17-advanced-compare.json'
import fraction18 from '../lessons/fraction-18-advanced-between.json'
import fraction19 from '../lessons/fraction-19-mixed-hour-axis.json'
import fraction20 from '../lessons/fraction-20-gcd-euclidean.json'
import geometry01 from '../lessons/geometry-01-area-friends.json'
import fractionCircleIntro from '../lessons/fraction-circle-intro.json'
import integer01 from '../lessons/integer-01-number-line-intro.json'
import integer02 from '../lessons/integer-02-compare.json'
import integer03 from '../lessons/integer-03-add-subtract.json'
import integer04 from '../lessons/integer-04-patterns.json'
import integer05 from '../lessons/integer-05-multiply-divide.json'
import integer06 from '../lessons/integer-06-order-of-operations.json'
import integer07 from '../lessons/integer-07-parentheses.json'
import coord01 from '../lessons/coord-01-plot-points.json'
import coord02 from '../lessons/coord-02-reflection.json'
import coord03 from '../lessons/coord-03-rotation.json'
import geometry02 from '../lessons/geometry-02-angles.json'
import geometry03 from '../lessons/geometry-03-circle-area.json'
import ratio01 from '../lessons/ratio-01-percent-intro.json'
import ratio02 from '../lessons/ratio-02-percent-discount.json'
import divisibility01 from '../lessons/divisibility-01-concept.json'
import divisibility02 from '../lessons/divisibility-02-rule-2-5-10.json'
import divisibility03 from '../lessons/divisibility-03-rule-3-9.json'
import divisibility04 from '../lessons/divisibility-04-detective-challenge.json'

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
  [fraction12.id]: fraction12 as OrchestratorLessonInput,
  [fraction13.id]: fraction13 as OrchestratorLessonInput,
  [fraction14.id]: fraction14 as OrchestratorLessonInput,
  [fraction15.id]: fraction15 as OrchestratorLessonInput,
  [fraction16.id]: fraction16 as OrchestratorLessonInput,
  [fraction17.id]: fraction17 as OrchestratorLessonInput,
  [fraction18.id]: fraction18 as OrchestratorLessonInput,
  [fraction19.id]: fraction19 as OrchestratorLessonInput,
  [fraction20.id]: fraction20 as OrchestratorLessonInput,
  [geometry01.id]: geometry01 as OrchestratorLessonInput,
  [fractionCircleIntro.id]: fractionCircleIntro as OrchestratorLessonInput,
  [integer01.id]: integer01 as OrchestratorLessonInput,
  [integer02.id]: integer02 as OrchestratorLessonInput,
  [integer03.id]: integer03 as OrchestratorLessonInput,
  [integer04.id]: integer04 as OrchestratorLessonInput,
  [integer05.id]: integer05 as OrchestratorLessonInput,
  [integer06.id]: integer06 as OrchestratorLessonInput,
  [integer07.id]: integer07 as OrchestratorLessonInput,
  [coord01.id]: coord01 as OrchestratorLessonInput,
  [coord02.id]: coord02 as OrchestratorLessonInput,
  [coord03.id]: coord03 as OrchestratorLessonInput,
  [geometry02.id]: geometry02 as OrchestratorLessonInput,
  [geometry03.id]: geometry03 as OrchestratorLessonInput,
  [ratio01.id]: ratio01 as OrchestratorLessonInput,
  [ratio02.id]: ratio02 as OrchestratorLessonInput,
  [divisibility01.id]: divisibility01 as OrchestratorLessonInput,
  [divisibility02.id]: divisibility02 as OrchestratorLessonInput,
  [divisibility03.id]: divisibility03 as OrchestratorLessonInput,
  [divisibility04.id]: divisibility04 as OrchestratorLessonInput,
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
