import type { FractionCircleParams } from '../types'

/** انواع generator تمرین کسر */
export type GeneratorKind =
  | 'fraction-comparison'
  | 'fraction-addition-same-denom'
  | 'fraction-addition-diff-denom'
  | 'fraction-subtraction-same-denom'
  | 'fraction-subtraction-diff-denom'
  | 'fraction-multiplication'
  | 'fraction-division'

/** پارامترهای مشترک همه generatorها */
export interface GeneratorParams {
  /** بازهٔ مخرج [min, max] — inclusive */
  denominatorRange: [min: number, max: number]
  /** تعداد تمرین‌های تولیدی */
  count: number
  /** اجازهٔ کسر نامتعارف (صورت ≥ مخرج) */
  allowImproperFractions: boolean
  /** برای reproducibility در تست */
  seed?: string | number
}

/** یک کسر ساده */
export interface FractionLiteral {
  numerator: number
  denominator: number
}

/** نتیجهٔ مقایسهٔ a نسبت به b */
export type ComparisonRelation = 'lt' | 'eq' | 'gt'

export type PracticeOperation =
  | 'compare'
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'

/**
 * خروجی هر generator — دادهٔ لازم برای رندر (FractionCircle و مشابه)
 * به‌همراه پاسخ صحیح برای validation.
 */
export interface PracticeProblem {
  id: string
  generator: GeneratorKind
  operation: PracticeOperation
  prompt: string
  /** عملوندها (معمولاً دو کسر) */
  operands: FractionLiteral[]
  /**
   * پاسخ صحیح:
   * - مقایسه: رابطهٔ operand[0] نسبت به operand[1]
   * - عملیات حسابی: کسر حاصل (قبل از ساده‌سازی اجباری نیست؛ simplifiedAnswer همیشه هست)
   */
  answer: FractionLiteral | ComparisonRelation
  /** حاصل در ساده‌ترین صورت — فقط برای عملیات حسابی */
  simplifiedAnswer?: FractionLiteral
  /** مخرج مشترک استفاده‌شده (جمع/تفریق با مخرج متفاوت) */
  commonDenominator?: number
  /** ایندکس کسر بزرگ‌تر؛ -1 اگر مساوی — فقط مقایسه */
  largerIndex?: number
  /**
   * پارامترهای آماده برای FractionCircle
   * (compareFractions برای نمایش عملوندها، target برای پاسخ تعاملی)
   */
  visualParams: FractionCircleParams
  successMessage?: string
  wrongMessage?: string
}
