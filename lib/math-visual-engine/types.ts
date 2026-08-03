import type { AvatarAnimation } from '@/lib/avatar-bridge/types'
import type { TeacherState } from '@/lib/animation-types'

/** شناسه کامپوننت‌های بصری ریاضی — برای رجیستری */
export type MathVisualType = 'fraction-circle' | 'number-line' | 'polygon'

export type MathVisualMode = 'demo' | 'static' | 'interactive'

/** پارامترهای FractionCircle */
export interface FractionCircleParams {
  denominator?: number
  numerator?: number
  target?: { numerator: number; denominator: number }
  showTarget?: boolean
  divideAnimation?: boolean
  title?: string
  /** در تمرین: مخرج ثابت روی target (پیش‌فرض true در interactive) */
  lockDenominator?: boolean
  /** نمایش دو کسر کنار هم برای مقایسه (teach/static) */
  compareFractions?: Array<{
    numerator: number
    denominator: number
    label?: string
  }>
  /**
   * پاسخ صحیح مقایسه — اگر ست باشد، در mode=interactive
   * به‌جای drag، دکمه‌های «کدام بزرگ‌تر؟» نشان داده می‌شود.
   */
  comparisonAnswer?: 'lt' | 'eq' | 'gt'
  /** نماد عمل برای نمایش بین عملوندها */
  operationSymbol?: '+' | '−' | '×' | '÷' | '='
  /**
   * نمایش فرآیند ک.م.م (مخرج مشترک):
   * انیمیشن تبدیل دو کسر + در interactive پرسش مرحله‌به‌مرحله
   */
  commonDenomProcess?: boolean | { animate?: boolean }
  /**
   * فقط آموزش مفهوم ک.م.م (مضرب‌ها → مشترک → کوچک‌ترین)
   * از compareFractions[0].denominator و [1].denominator استفاده می‌کند
   * یا از lcmNumbers: { a, b }
   */
  lcmConcept?: boolean | { animate?: boolean; a?: number; b?: number }
  lcmNumbers?: { a: number; b: number }
}

/** شکل هندسی برای ویژوال Polygon */
export type PolygonShapeKind = 'triangle' | 'parallelogram' | 'square' | 'rectangle'

export interface PolygonShapeSpec {
  kind: PolygonShapeKind
  label?: string
  /** طول قاعده (واحد نمایشی) */
  base?: number
  /** ارتفاع (واحد نمایشی) */
  height?: number
  /** برجسته‌سازی بُعد */
  highlight?: 'base' | 'height' | 'area' | 'none'
  mood?: 'happy' | 'sad' | 'neutral' | 'curious'
}

export interface PolygonQuiz {
  kind: 'identify' | 'formula' | 'relation'
  prompt?: string
  options: string[]
  answerIndex: number
}

/** پارامترهای ویژوال هندسه (Polygon) */
export interface PolygonParams {
  title?: string
  shapes?: PolygonShapeSpec[]
  showDimensions?: boolean
  /** متن فرمول — مثلاً «مساحت = قاعده × ارتفاع» */
  formula?: string
  /** متوازی‌الاضلاع را با قطر به دو مثلث تقسیم کن */
  showTriangleSplit?: boolean
  /**
   * انیمیشن آموزشی: یک مثلث از دل متوازی‌الاضلاع بیرون می‌آید
   * تا نشان دهد متوازی‌الاضلاع = دو مثلث هم‌اندازه
   */
  splitReveal?: boolean | { animate?: boolean }
  quiz?: PolygonQuiz
}

/** پارامترهای آینده NumberLine */
export type MathVisualParams = FractionCircleParams | PolygonParams | Record<string, unknown>

export interface MathVisualConfig {
  type: MathVisualType
  mode: MathVisualMode
  params?: MathVisualParams
}

/** گام صحبت ساده */
export interface OrchestratorSpeakStep {
  type: 'speak'
  id: string
  message: string
  animation?: AvatarAnimation
  emotion?: TeacherState['emotion']
  autoAdvance?: boolean
}

/** گام تدریس — آواتار + نمایش بصری */
export interface OrchestratorTeachStep {
  type: 'teach'
  id: string
  title?: string
  speak: string
  animation?: AvatarAnimation
  emotion?: TeacherState['emotion']
  visual: MathVisualConfig
}

/** گام تمرین تعاملی — فرمت ثابت (فعلی) */
export interface OrchestratorPracticeStep {
  type: 'practice'
  id: string
  title?: string
  speak?: string
  animation?: AvatarAnimation
  emotion?: TeacherState['emotion']
  visual: MathVisualConfig
  successMessage?: string
  wrongMessage?: string
}

/**
 * گام تمرین پارامتری (generator) — backward-compatible با فرمت ثابت.
 * در runtime با resolvePracticeStep به OrchestratorPracticeStep تبدیل می‌شود.
 * تعریف کامل GeneratorKind / GeneratorParams در generators/types.ts است.
 */
export interface OrchestratorGeneratedPracticeStep {
  type: 'practice'
  id: string
  title?: string
  speak?: string
  animation?: AvatarAnimation
  emotion?: TeacherState['emotion']
  /** مثلاً "fraction-comparison" */
  generator: string
  params: {
    denominatorRange: [number, number]
    count: number
    allowImproperFractions: boolean
    seed?: string | number
  }
  expandToSteps?: boolean
  successMessage?: string
  wrongMessage?: string
  visual?: Partial<MathVisualConfig>
}

/** practice در JSON درس: ثابت یا generator */
export type OrchestratorPracticeStepInput =
  | OrchestratorPracticeStep
  | OrchestratorGeneratedPracticeStep

export type OrchestratorStep =
  | OrchestratorSpeakStep
  | OrchestratorTeachStep
  | OrchestratorPracticeStep

/** گام خام JSON قبل از resolve generatorها */
export type OrchestratorStepInput =
  | OrchestratorSpeakStep
  | OrchestratorTeachStep
  | OrchestratorPracticeStepInput

/** ساختار JSON درس برای LessonOrchestrator */
export interface OrchestratorLesson {
  id: string
  title: string
  description?: string
  subject?: 'math' | 'science' | 'coding'
  /** شناسه موضوع در برنامه درسی — مثلاً fractions */
  topicId?: string
  /** شناسه درس‌نامه — مثلاً math */
  subjectId?: string
  /** ترتیب در موضوع */
  order?: number
  /** سطح ۱–۵ */
  level?: number
  steps: OrchestratorStep[]
}

/**
 * درس خام از JSON — steps می‌توانند generator داشته باشند.
 * پس از resolveLessonSteps به OrchestratorLesson تبدیل می‌شود.
 */
export interface OrchestratorLessonInput
  extends Omit<OrchestratorLesson, 'steps'> {
  steps: OrchestratorStepInput[]
}

/** props مشترک همه کامپوننت‌های بصری ریاضی */
export interface MathVisualComponentProps {
  mode: MathVisualMode
  params: MathVisualParams
  width?: number
  height?: number
  onSpeak?: (text: string) => void
  setAnimation?: (name: string) => void
  onSuccess?: () => void
  onWrong?: () => void
}
