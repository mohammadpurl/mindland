import type {
  ComparisonRelation,
  FractionLiteral,
  GeneratorKind,
  GeneratorParams,
  PracticeProblem,
} from './types'
import {
  addFractions,
  compareFractions,
  divideFractions,
  formatFraction,
  lcm,
  multiplyFractions,
  simplify,
  subtractFractions,
} from './fraction-math'
import { createRng, randomInt, type SeededRng } from './rng'

function assertParams(params: GeneratorParams): void {
  const [min, max] = params.denominatorRange
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 2 || max < min) {
    throw new Error(
      `denominatorRange نامعتبر: [${min}, ${max}] — min باید ≥ 2 و max ≥ min باشد`
    )
  }
  if (!Number.isInteger(params.count) || params.count < 1) {
    throw new Error(`count باید عدد صحیح ≥ 1 باشد (دریافت: ${params.count})`)
  }
}

function randomProperNumerator(
  rng: SeededRng,
  denominator: number,
  allowImproper: boolean
): number {
  const maxN = allowImproper ? denominator * 2 : denominator - 1
  return randomInt(rng, 1, Math.max(1, maxN))
}

function randomFraction(
  rng: SeededRng,
  denomMin: number,
  denomMax: number,
  allowImproper: boolean,
  fixedDenom?: number
): FractionLiteral {
  const denominator = fixedDenom ?? randomInt(rng, denomMin, denomMax)
  const numerator = randomProperNumerator(rng, denominator, allowImproper)
  return { numerator, denominator }
}

function problemId(kind: GeneratorKind, index: number, seed?: string | number): string {
  return `${kind}-${seed ?? 'r'}-${index + 1}`
}

function compareVisual(
  a: FractionLiteral,
  b: FractionLiteral,
  title: string,
  relation: ComparisonRelation
) {
  return {
    compareFractions: [
      { ...a, label: formatFraction(a) },
      { ...b, label: formatFraction(b) },
    ],
    title,
    comparisonAnswer: relation,
  }
}

function targetVisual(answer: FractionLiteral, title: string, operands: FractionLiteral[]) {
  return {
    target: { numerator: answer.numerator, denominator: answer.denominator },
    showTarget: true,
    lockDenominator: true,
    title,
    compareFractions: operands.map((f) => ({ ...f, label: formatFraction(f) })),
  }
}

function relationFromCmp(cmp: -1 | 0 | 1): ComparisonRelation {
  if (cmp < 0) return 'lt'
  if (cmp > 0) return 'gt'
  return 'eq'
}

function largerIndexFromCmp(cmp: -1 | 0 | 1): number {
  if (cmp < 0) return 1
  if (cmp > 0) return 0
  return -1
}

/** مقایسهٔ دو کسر */
export function generateFractionComparison(params: GeneratorParams): PracticeProblem[] {
  assertParams(params)
  const rng = createRng(params.seed)
  const [dMin, dMax] = params.denominatorRange
  const problems: PracticeProblem[] = []

  for (let i = 0; i < params.count; i++) {
    let a = randomFraction(rng, dMin, dMax, params.allowImproperFractions)
    let b = randomFraction(rng, dMin, dMax, params.allowImproperFractions)

    // جلوگیری از جفت‌های تکراری بی‌معنی در حلقهٔ کوتاه
    let guard = 0
    while (a.numerator === b.numerator && a.denominator === b.denominator && guard < 8) {
      b = randomFraction(rng, dMin, dMax, params.allowImproperFractions)
      guard++
    }

    const cmp = compareFractions(a, b)
    const relation = relationFromCmp(cmp)
    const larger = largerIndexFromCmp(cmp)
    const prompt =
      relation === 'eq'
        ? `آیا ${formatFraction(a)} و ${formatFraction(b)} برابرند؟`
        : `کدام بزرگ‌تر است: ${formatFraction(a)} یا ${formatFraction(b)}؟`

    problems.push({
      id: problemId('fraction-comparison', i, params.seed),
      generator: 'fraction-comparison',
      operation: 'compare',
      prompt,
      operands: [a, b],
      answer: relation,
      largerIndex: larger,
      visualParams: compareVisual(
        a,
        b,
        `مقایسه: ${formatFraction(a)} و ${formatFraction(b)}`,
        relation
      ),
      successMessage:
        relation === 'eq'
          ? `درست! ${formatFraction(a)} = ${formatFraction(b)}`
          : `درست! ${formatFraction(larger === 0 ? a : b)} بزرگ‌تر است.`,
      wrongMessage: 'دوباره مقایسه کن — صورت و مخرج را با هم ببین.',
    })
  }

  return problems
}

function generateBinaryOp(
  kind: Extract<
    GeneratorKind,
    | 'fraction-addition-same-denom'
    | 'fraction-addition-diff-denom'
    | 'fraction-subtraction-same-denom'
    | 'fraction-subtraction-diff-denom'
    | 'fraction-multiplication'
    | 'fraction-division'
  >,
  params: GeneratorParams,
  options: {
    sameDenom: boolean | null
    compute: (a: FractionLiteral, b: FractionLiteral) => FractionLiteral
    opSymbol: string
    opWord: string
    ensurePositiveResult?: boolean
  }
): PracticeProblem[] {
  assertParams(params)
  const rng = createRng(params.seed)
  const [dMin, dMax] = params.denominatorRange
  const problems: PracticeProblem[] = []
  const operation =
    kind.includes('addition')
      ? 'add'
      : kind.includes('subtraction')
        ? 'subtract'
        : kind.includes('multiplication')
          ? 'multiply'
          : 'divide'

  for (let i = 0; i < params.count; i++) {
    let a: FractionLiteral
    let b: FractionLiteral
    let result: FractionLiteral
    let commonDenominator: number | undefined
    let attempts = 0

    do {
      attempts++
      if (options.sameDenom === true) {
        const d = randomInt(rng, dMin, dMax)
        a = randomFraction(rng, dMin, dMax, params.allowImproperFractions, d)
        b = randomFraction(rng, dMin, dMax, params.allowImproperFractions, d)
        commonDenominator = d
      } else if (options.sameDenom === false) {
        a = randomFraction(rng, dMin, dMax, params.allowImproperFractions)
        do {
          b = randomFraction(rng, dMin, dMax, params.allowImproperFractions)
        } while (b.denominator === a.denominator)
        commonDenominator = lcm(a.denominator, b.denominator)
      } else {
        a = randomFraction(rng, dMin, dMax, params.allowImproperFractions)
        b = randomFraction(rng, dMin, dMax, params.allowImproperFractions)
        if (kind === 'fraction-division' && b.numerator === 0) {
          b = { ...b, numerator: 1 }
        }
      }

      // برای تفریق: a ≥ b تا نتیجه منفی نشود (مگر improper مجاز و صریح)
      if (options.ensurePositiveResult) {
        if (compareFractions(a, b) < 0) {
          ;[a, b] = [b, a]
        }
      }

      result = options.compute(a, b)
    } while (
      options.ensurePositiveResult &&
      result.numerator < 0 &&
      attempts < 20
    )

    const simplified = simplify(result)
    const title = `${formatFraction(a)} ${options.opSymbol} ${formatFraction(b)}`

    problems.push({
      id: problemId(kind, i, params.seed),
      generator: kind,
      operation,
      prompt: `${options.opWord} ${formatFraction(a)} و ${formatFraction(b)} را حساب کن.`,
      operands: [a, b],
      answer: result,
      simplifiedAnswer: simplified,
      ...(commonDenominator !== undefined ? { commonDenominator } : {}),
      visualParams: targetVisual(simplified, title, [a, b]),
      successMessage: `درست! حاصل = ${formatFraction(simplified)}`,
      wrongMessage: `دوباره امتحان کن — ${options.opWord} کسرها.`,
    })
  }

  return problems
}

export function generateFractionAdditionSameDenom(
  params: GeneratorParams
): PracticeProblem[] {
  return generateBinaryOp('fraction-addition-same-denom', params, {
    sameDenom: true,
    compute: addFractions,
    opSymbol: '+',
    opWord: 'جمع',
  })
}

export function generateFractionAdditionDiffDenom(
  params: GeneratorParams
): PracticeProblem[] {
  return generateBinaryOp('fraction-addition-diff-denom', params, {
    sameDenom: false,
    compute: addFractions,
    opSymbol: '+',
    opWord: 'جمع',
  })
}

export function generateFractionSubtractionSameDenom(
  params: GeneratorParams
): PracticeProblem[] {
  return generateBinaryOp('fraction-subtraction-same-denom', params, {
    sameDenom: true,
    compute: subtractFractions,
    opSymbol: '−',
    opWord: 'تفریق',
    ensurePositiveResult: true,
  })
}

export function generateFractionSubtractionDiffDenom(
  params: GeneratorParams
): PracticeProblem[] {
  return generateBinaryOp('fraction-subtraction-diff-denom', params, {
    sameDenom: false,
    compute: subtractFractions,
    opSymbol: '−',
    opWord: 'تفریق',
    ensurePositiveResult: true,
  })
}

export function generateFractionMultiplication(
  params: GeneratorParams
): PracticeProblem[] {
  return generateBinaryOp('fraction-multiplication', params, {
    sameDenom: null,
    compute: multiplyFractions,
    opSymbol: '×',
    opWord: 'ضرب',
  })
}

export function generateFractionDivision(params: GeneratorParams): PracticeProblem[] {
  return generateBinaryOp('fraction-division', params, {
    sameDenom: null,
    compute: divideFractions,
    opSymbol: '÷',
    opWord: 'تقسیم',
  })
}

const GENERATORS: Record<
  GeneratorKind,
  (params: GeneratorParams) => PracticeProblem[]
> = {
  'fraction-comparison': generateFractionComparison,
  'fraction-addition-same-denom': generateFractionAdditionSameDenom,
  'fraction-addition-diff-denom': generateFractionAdditionDiffDenom,
  'fraction-subtraction-same-denom': generateFractionSubtractionSameDenom,
  'fraction-subtraction-diff-denom': generateFractionSubtractionDiffDenom,
  'fraction-multiplication': generateFractionMultiplication,
  'fraction-division': generateFractionDivision,
}

export function generatePracticeProblems(
  kind: GeneratorKind,
  params: GeneratorParams
): PracticeProblem[] {
  const fn = GENERATORS[kind]
  if (!fn) throw new Error(`generator ناشناخته: ${kind}`)
  return fn(params)
}

export function isGeneratorKind(value: string): value is GeneratorKind {
  return value in GENERATORS
}

/** برای تست دستی / دیباگ */
export function demoFractionComparison(seed = 'demo', count = 5): PracticeProblem[] {
  return generateFractionComparison({
    denominatorRange: [2, 8],
    count,
    allowImproperFractions: false,
    seed,
  })
}
