import type { AvatarAnimation } from '@/lib/avatar-bridge/types'
import type { TeacherState } from '@/lib/animation-types'

/** شناسه کامپوننت‌های بصری ریاضی — برای رجیستری */
export type MathVisualType =
  | 'fraction-circle'
  | 'number-line'
  | 'polygon'
  | 'coordinate-grid'
  | 'angle'
  | 'percent-bar'
  | 'divisibility'
  | 'division'
  | 'quiz'

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
export type PolygonShapeKind = 'triangle' | 'parallelogram' | 'square' | 'rectangle' | 'circle'

export interface PolygonShapeSpec {
  kind: PolygonShapeKind
  label?: string
  /** طول قاعده (واحد نمایشی) — برای مثلث/متوازی‌الاضلاع/مربع */
  base?: number
  /** ارتفاع (واحد نمایشی) — برای مثلث/متوازی‌الاضلاع/مربع */
  height?: number
  /** شعاع (واحد نمایشی) — فقط برای kind: 'circle' */
  radius?: number
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

/** یک نقطهٔ ثابت روی خط اعداد (demo / static) */
export interface NumberLinePoint {
  value: number
  label?: string
  color?: string
}

/** یک پرش (+/-) روی خط اعداد — برای نمایش جمع/تفریق */
export interface NumberLineJump {
  from: number
  to: number
  label?: string
}

/** پارامترهای ویژوال خط اعداد (NumberLine) */
export interface NumberLineParams {
  title?: string
  /** بازهٔ نمایش خط — اگر ندهید، از point/target/compareValues محاسبه می‌شود */
  min?: number
  max?: number
  /** نقطه(های) ثابت برای نمایش در demo/static */
  points?: NumberLinePoint[]
  /** پرش +/- برای نمایش جمع/تفریق (demo) — با انیمیشن حرکت نشانگر */
  jump?: NumberLineJump
  jumpAnimate?: boolean
  /** تمرین جای‌گذاری: نشانگر را با drag به این مقدار برسان */
  target?: number
  /** مقدار شروع نشانگر قبل از drag (پیش‌فرض 0) */
  startValue?: number
  /** تمرین مقایسه: کدام عدد بزرگ‌تر/کوچک‌تر/مساوی است */
  compareValues?: [number, number]
  comparisonAnswer?: 'lt' | 'eq' | 'gt'
}

/** یک نقطهٔ ثابت روی صفحهٔ مختصات (demo / static) */
export interface CoordinatePoint {
  x: number
  y: number
  label?: string
  color?: string
}

export type ReflectionAxis = 'x' | 'y'
export type RotationAngle = 90 | 180 | 270

/** پارامترهای ویژوال صفحهٔ مختصات (CoordinateGrid) — رسم نقطه، تقارن، دوران */
export interface CoordinateGridParams {
  title?: string
  /** بازهٔ نمایش هر دو محور: از −range تا +range (پیش‌فرض بر اساس نقاط محاسبه می‌شود) */
  range?: number
  /** نقطه(های) ثابت برای نمایش در demo/static */
  points?: CoordinatePoint[]
  /** تمرین جای‌گذاری ساده: نشانگر را به این مختصات برسان */
  target?: { x: number; y: number }
  /** مختصات شروع نشانگر (پیش‌فرض مبدأ) */
  startPoint?: { x: number; y: number }
  /**
   * تمرین/نمایش تقارن: نقطهٔ A ثابت + محور بازتاب —
   * در interactive نشانگر باید تصویر آینه‌ای A را پیدا کند؛
   * در demo با انیمیشن بازتاب آن نشان داده می‌شود.
   */
  reflect?: { point: { x: number; y: number }; axis: ReflectionAxis }
  /** تمرین/نمایش دوران حول مبدأ */
  rotate?: { point: { x: number; y: number }; angle: RotationAngle }
  /** پخش انیمیشن در حالت demo (پیش‌فرض true) */
  animate?: boolean
}

export type AngleRelation = 'complementary' | 'supplementary' | 'vertical' | 'free'

/** پارامترهای ویژوال زاویه (AngleVisual) — نمایش، متمم/مکمل، متقابل‌به‌رأس */
export interface AngleParams {
  title?: string
  /** زاویهٔ ثابت نمایشی برای demo/static ساده (درجه) */
  angle?: number
  /** نمایش دو خط متقاطع با ۴ زاویه — برای آموزش زاویه‌های متقابل‌به‌رأس */
  showVerticalPair?: boolean
  /** زاویهٔ مرجع که در ۴تایی متقابل‌به‌رأس نشان داده می‌شود (درجه) */
  verticalReferenceAngle?: number
  /**
   * تمرین: پرتوی آزاد را بکش تا زاویه‌اش دقیقاً برابر این مقدار شود (درجه).
   * زاویهٔ مرجع (اگر داده شود) کنار آن نشان داده می‌شود تا رابطه (متمم/مکمل/متقابل) روشن باشد.
   */
  target?: number
  /** زاویهٔ شروع پرتوی آزاد قبل از کشیدن (درجه) */
  startAngle?: number
  /** زاویهٔ مرجع کنار تمرین — فقط برای نمایش متن رابطه */
  referenceAngle?: number
  /** نوع رابطه — فقط برای متن راهنما */
  relation?: AngleRelation
}

/** پارامترهای ویژوال نوار درصد (PercentBar) — درصد یعنی چند از صد */
export interface PercentBarParams {
  title?: string
  /** درصد ثابت نمایشی برای demo/static (۰ تا ۱۰۰) */
  percent?: number
  /** برچسب کل — مثلاً «قیمت کتاب: ۱۷٬۰۰۰ تومان» */
  wholeLabel?: string
  /** برچسب بخش پرشده — اگر ندهید، از روی percent محاسبه و «٪» نشان داده می‌شود */
  partLabel?: string
  /** تمرین: نوار را بکش تا دقیقاً این درصد پر شود */
  target?: number
  /** درصد شروع قبل از کشیدن */
  startPercent?: number
  /**
   * عددِ هدف را در زیرنویس ننویس تا دانش‌آموز خودش آن را حساب کند
   * (مثلاً «۱۰۰٪ منهای تخفیف»). بازخورد خطا هم تشخیصی می‌شود:
   * اگر نزدیک متمم هدف رها کند، تذکر می‌دهد که «مقدار تخفیف» را کشیده نه «مبلغ پرداختی».
   */
  hideTargetValue?: boolean
}

/** یک گزینهٔ عددی در تمرین چندانتخابی بخش‌پذیری */
export interface DivisibilityCandidate {
  value: number
  /** آیا این عدد شرط قانون/مقسوم‌علیه را برآورده می‌کند */
  correct: boolean
}

/** یک گزینهٔ متنی در تمرین «کدام دلیل درست است؟» */
export interface DivisibilityChoice {
  label: string
  correct: boolean
}

/**
 * پارامترهای ویژوال آزمایشگاه بخش‌پذیری (DivisibilityLab) — کشف باقی‌مانده،
 * نشانه‌های رقم یکان/مجموع رقم‌ها، و تمرین چندانتخابی/انتخاب صحیح.
 */
export interface DivisibilityParams {
  title?: string
  /** عددی که بررسی می‌شود (برای نمایش تک‌عددی در teach/static) */
  number?: number
  /** مقسوم‌علیه — مثلاً ۲، ۳، ۵، ۹ یا ۱۰ */
  divisor?: number
  /** چه چیزی از عدد برجسته شود */
  highlight?:
    | 'remainder'
    | 'lastDigit'
    | 'digitSum'
    | 'lastTwo'
    | 'lastThree'
    | 'alternatingSum'
  /** تمرین: چند عدد که باید بر اساس divisor انتخاب شوند (چندانتخابی) */
  candidates?: DivisibilityCandidate[]
  /** تمرین: یک سؤال با گزینه‌های متنی (تک‌انتخابی) */
  choices?: DivisibilityChoice[]
  /** متن سؤال بالای گزینه‌ها (برای candidates یا choices) */
  prompt?: string
}

/**
 * پارامترهای ویژوال «مدل تقسیم» (DivisionModel) — پیش‌نیاز بخش‌پذیری.
 * پنج حالت مختلف با کلید `variant` انتخاب می‌شود.
 */
export interface DivisionParams {
  title?: string
  /**
   * - grouping: تقسیم اشیا بین گروه‌ها و کشف خارج‌قسمت/باقی‌مانده
   * - roles: شناخت چهار نقشِ مقسوم، مقسوم‌علیه، خارج‌قسمت، باقی‌مانده
   * - relation: بازسازی رابطهٔ «مقسوم = مقسوم‌علیه × خارج‌قسمت + باقی‌مانده»
   * - remainder-check: بررسی درستیِ یک جواب (قانون کوچک‌تر بودن باقی‌مانده)
   * - sort: دسته‌بندی تقسیم‌ها به «کامل» و «دارای باقی‌مانده»
   */
  variant?: 'grouping' | 'roles' | 'relation' | 'remainder-check' | 'sort'
  /** grouping — تعداد کل اشیا و تعداد گروه‌ها */
  total?: number
  groups?: number
  /** roles / relation / remainder-check — عددهای یک تقسیم */
  dividend?: number
  divisor?: number
  quotient?: number
  remainder?: number
  /** roles — کدام نقش‌ها و به چه ترتیبی پرسیده شوند (پیش‌فرض: هر چهار نقش) */
  asks?: Array<'dividend' | 'divisor' | 'quotient' | 'remainder'>
  /** relation — کدام عدد ناشناخته است و باید پیدا شود */
  missing?: 'dividend' | 'divisor' | 'quotient' | 'remainder'
  /** remainder-check — خارج‌قسمت و باقی‌ماندهٔ ادعاشده برای بررسی */
  claimQuotient?: number
  claimRemainder?: number
  /** sort — فهرست تقسیم‌ها (خارج‌قسمت/باقی‌مانده در صورت نبود، محاسبه می‌شود) */
  items?: Array<{
    dividend: number
    divisor: number
    quotient?: number
    remainder?: number
  }>
  /** متن سؤال بالای تمرین */
  prompt?: string
}

/** یک گزینه در ویژوال عمومی «کوییز» */
export interface QuizChoice {
  label: string
  correct: boolean
  /** توضیح کوتاه — بعد از انتخاب (چه درست، چه غلط) نمایش داده می‌شود */
  note?: string
}

/**
 * پارامترهای ویژوال عمومی «کوییز» (Quiz) — چندگزینه‌ای تک‌انتخابی یا چندانتخابی،
 * برای هر سؤالی که با کارت/دایره/محور به‌خوبی نمایش داده نمی‌شود (مثلاً «کدام محاسبه
 * درست است؟»، «در جای خالی چه عددی؟»، «کدام‌ها از بقیه بزرگ‌ترند؟»).
 */
export interface QuizParams {
  title?: string
  prompt?: string
  choices?: QuizChoice[]
  /** true یعنی چند گزینه هم‌زمان می‌توانند درست باشند (با دکمهٔ «بررسی کن») */
  multiSelect?: boolean
}

export type MathVisualParams =
  | FractionCircleParams
  | PolygonParams
  | NumberLineParams
  | CoordinateGridParams
  | AngleParams
  | PercentBarParams
  | DivisibilityParams
  | DivisionParams
  | QuizParams
  | Record<string, unknown>

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
