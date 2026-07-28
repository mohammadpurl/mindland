import { z } from 'zod'

/** کلید namespaced برای localStorage — نسخه‌دار برای migrate آینده */
export const PROGRESS_STORAGE_KEY = 'mindland:progress:v1'

/** آستانه‌های پیش‌فرض موضوع درسی */
export const DEFAULT_TOPIC_PROGRESS_CONFIG = {
  passThreshold: 0.7,
  maxRetries: 3,
  relaxedThreshold: 0.55,
  allowAssistedPass: true,
} as const

// ─── Visual (همان ساختار درس — برای سؤال‌های بصری کوئیز) ───────────────────

export const MathVisualTypeSchema = z.enum(['fraction-circle', 'number-line', 'polygon'])

export const MathVisualModeSchema = z.enum(['demo', 'static', 'interactive'])

export const MathVisualConfigSchema = z.object({
  type: MathVisualTypeSchema,
  mode: MathVisualModeSchema,
  params: z.record(z.string(), z.unknown()).optional(),
})

// ─── Quiz ───────────────────────────────────────────────────────────────────

/**
 * سؤال چهارگزینه‌ای — فاز ۱.
 * سؤال «متنی» = همین نوع بدون فیلد visual.
 * variant free-text در فاز بعدی به union اضافه می‌شود.
 */
export const QuizChoiceQuestionSchema = z
  .object({
    type: z.literal('choice').default('choice'),
    id: z.string().min(1),
    prompt: z.string().min(1),
    visual: MathVisualConfigSchema.optional(),
    choices: z.array(z.string().min(1)).min(2),
    correctIndex: z.number().int().min(0),
  })
  .refine((q) => q.correctIndex < q.choices.length, {
    message: 'correctIndex باید کوچک‌تر از تعداد choices باشد',
    path: ['correctIndex'],
  })

/** فعلاً فقط choice — بعداً: z.discriminatedUnion('type', [...]) */
export const QuizQuestionSchema = QuizChoiceQuestionSchema

export const QuizSchema = z.object({
  id: z.string().min(1),
  lessonId: z.string().min(1),
  title: z.string().optional(),
  /** حداقل نمره قبولی ۰ تا ۱ — اگر در topic تعریف نشود از پیش‌فرض استفاده می‌شود */
  passThreshold: z.number().min(0).max(1).optional(),
  questions: z.array(QuizQuestionSchema).min(1),
})

// ─── Mastery & Progress ─────────────────────────────────────────────────────

export const MasteryAttemptSchema = z.object({
  lessonId: z.string().min(1),
  /** نمره ۰ تا ۱ */
  score: z.number().min(0).max(1),
  attemptNumber: z.number().int().min(1),
  timestamp: z.string().datetime(),
  /** تلاش با آستانه موقت (remedial — همان سؤالات، passThreshold پایین‌تر) */
  usedRelaxedThreshold: z.boolean().optional(),
  /** پیشرفت با کمک والد/معلم (fallback نهایی) */
  assistedPass: z.boolean().optional(),
})

export const LessonProgressSchema = z.object({
  completed: z.boolean(),
  bestScore: z.number().min(0).max(1),
  attempts: z.array(MasteryAttemptSchema),
  /**
   * لحظه باز شدن دسترسی به درس:
   * - درس اول موضوع: اولین بار که رکورد ساخته می‌شود
   * - درس‌های بعدی: بلافاصله پس از قبولی کوئیز درس قبلی
   */
  unlockedAt: z.string().datetime().optional(),
  /** قبول با آستانه موقت — برای گزارش معلم */
  needsReview: z.boolean().optional(),
  /** پیشرفت با assist — نمره واقعی همچنان در bestScore ذخیره می‌شود */
  assistedPass: z.boolean().optional(),
})

export const StudentProgressSchema = z.record(z.string(), LessonProgressSchema)

// ─── Progression ────────────────────────────────────────────────────────────

export const ProgressActionSchema = z.enum(['advance', 'retry', 'remedial', 'assist'])

export const NextStepDecisionFlagsSchema = z.object({
  needsReview: z.boolean().optional(),
  assistedPass: z.boolean().optional(),
  relaxedThreshold: z.number().min(0).max(1).optional(),
})

export const NextStepDecisionSchema = z.object({
  action: ProgressActionSchema,
  nextLessonId: z.string().optional(),
  message: z.string().optional(),
  flags: NextStepDecisionFlagsSchema.optional(),
})

/** تنظیمات پیشرفت در سطح موضوع (curriculum JSON) */
export const TopicProgressConfigSchema = z.object({
  passThreshold: z.number().min(0).max(1).default(0.7),
  maxRetries: z.number().int().min(1).default(3),
  /** آستانه تلاش remedial — همان کوئیز، نه کوئیز جدا */
  relaxedThreshold: z.number().min(0).max(1).default(0.55),
  remedialLessonId: z.string().optional(),
  allowAssistedPass: z.boolean().default(true),
})

// ─── Inferred types ─────────────────────────────────────────────────────────

export type MathVisualConfigJson = z.infer<typeof MathVisualConfigSchema>
export type QuizChoiceQuestion = z.infer<typeof QuizChoiceQuestionSchema>
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>
export type Quiz = z.infer<typeof QuizSchema>
export type MasteryAttempt = z.infer<typeof MasteryAttemptSchema>
export type LessonProgress = z.infer<typeof LessonProgressSchema>
export type StudentProgress = z.infer<typeof StudentProgressSchema>
export type ProgressAction = z.infer<typeof ProgressActionSchema>
export type NextStepDecisionFlags = z.infer<typeof NextStepDecisionFlagsSchema>
export type NextStepDecision = z.infer<typeof NextStepDecisionSchema>
export type TopicProgressConfig = z.infer<typeof TopicProgressConfigSchema>

/** نتیجه یک دور کامل کوئیز — ورودی progression engine */
export interface MasteryResult {
  lessonId: string
  score: number
  attemptNumber: number
  usedRelaxedThreshold?: boolean
  assistedPass?: boolean
}

// ─── Parsers ────────────────────────────────────────────────────────────────

export function parseQuiz(json: unknown): Quiz {
  return QuizSchema.parse(json)
}

export function parseStudentProgress(json: unknown): StudentProgress {
  return StudentProgressSchema.parse(json)
}

export function parseTopicProgressConfig(json: unknown): TopicProgressConfig {
  return TopicProgressConfigSchema.parse(json)
}

/** ادغام تنظیمات موضوع با override اختیاری کوئیز */
export function resolvePassThreshold(
  quiz: Pick<Quiz, 'passThreshold'>,
  topicConfig: Pick<TopicProgressConfig, 'passThreshold'>
): number {
  return quiz.passThreshold ?? topicConfig.passThreshold
}
