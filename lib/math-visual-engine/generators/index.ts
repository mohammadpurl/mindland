export type {
  ComparisonRelation,
  FractionLiteral,
  GeneratorKind,
  GeneratorParams,
  PracticeOperation,
  PracticeProblem,
} from './types'

export {
  generateFractionComparison,
  generateFractionAdditionSameDenom,
  generateFractionAdditionDiffDenom,
  generateFractionSubtractionSameDenom,
  generateFractionSubtractionDiffDenom,
  generateFractionMultiplication,
  generateFractionDivision,
  generatePracticeProblems,
  isGeneratorKind,
  demoFractionComparison,
} from './fraction-generators'

export {
  resolvePracticeStep,
  resolveLessonSteps,
  isGeneratedPracticeStep,
  type PracticeStepInput,
  type GeneratedPracticeStep,
  type StaticPracticeStep,
  type ResolvePracticeOptions,
} from './resolve-practice'

export {
  gcd,
  lcm,
  simplify,
  compareFractions,
  addFractions,
  subtractFractions,
  multiplyFractions,
  divideFractions,
  formatFraction,
  fractionsEqual,
} from './fraction-math'
