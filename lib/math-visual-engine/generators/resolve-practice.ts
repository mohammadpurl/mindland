import type { AvatarAnimation } from '@/lib/avatar-bridge/types'
import type { TeacherState } from '@/lib/animation-types'
import type { MathVisualConfig, OrchestratorPracticeStep } from '../types'
import {
  generatePracticeProblems,
  isGeneratorKind,
} from './fraction-generators'
import type { GeneratorKind, GeneratorParams, PracticeProblem } from './types'

/**
 * گام practice ثابت (فرمت فعلی JSON درس‌ها) — بدون تغییر.
 * visual الزامی است.
 */
export type StaticPracticeStep = OrchestratorPracticeStep

/**
 * گام practice پارامتری — به‌جای visual ثابت، به generator اشاره می‌کند.
 * در runtime با resolvePracticeStep به یک یا چند StaticPracticeStep تبدیل می‌شود.
 */
export interface GeneratedPracticeStep {
  type: 'practice'
  id: string
  title?: string
  speak?: string
  animation?: AvatarAnimation
  emotion?: TeacherState['emotion']
  generator: GeneratorKind
  params: GeneratorParams
  /** اگر true باشد، هر PracticeProblem یک گام جدا می‌شود (پیش‌فرض true) */
  expandToSteps?: boolean
  successMessage?: string
  wrongMessage?: string
  /**
   * visual پایهٔ اختیاری — type/mode پیش‌فرض fraction-circle/interactive
   * params از generator روی آن merge می‌شود.
   */
  visual?: Partial<MathVisualConfig>
}

/** union backward-compatible برای گام practice در JSON */
export type PracticeStepInput = StaticPracticeStep | GeneratedPracticeStep

export function isGeneratedPracticeStep(
  step: PracticeStepInput | { type: string }
): step is GeneratedPracticeStep {
  return (
    step.type === 'practice' &&
    'generator' in step &&
    typeof (step as GeneratedPracticeStep).generator === 'string'
  )
}

function problemToPracticeStep(
  problem: PracticeProblem,
  template: GeneratedPracticeStep,
  index: number,
  total: number
): OrchestratorPracticeStep {
  const baseVisual: MathVisualConfig = {
    type: template.visual?.type ?? 'fraction-circle',
    // مقایسه و عملیات حسابی هر دو interactive تا validation کار کند
    mode: template.visual?.mode ?? 'interactive',
    params: {
      ...(template.visual?.params ?? {}),
      ...problem.visualParams,
    },
  }

  // اطمینان: اگر comparisonAnswer هست، mode حتماً interactive بماند
  if (
    problem.visualParams.comparisonAnswer &&
    baseVisual.mode !== 'interactive'
  ) {
    baseVisual.mode = 'interactive'
  }

  const titleSuffix = total > 1 ? ` (${index + 1}/${total})` : ''

  return {
    type: 'practice',
    id: `${template.id}__${problem.id}`,
    title: (template.title ?? problem.prompt) + titleSuffix,
    speak: template.speak ?? problem.prompt,
    animation: template.animation,
    emotion: template.emotion,
    visual: baseVisual,
    successMessage:
      template.successMessage ?? problem.successMessage ?? 'آفرین! درست بود.',
    wrongMessage:
      template.wrongMessage ?? problem.wrongMessage ?? 'دوباره امتحان کن.',
  }
}

export interface ResolvePracticeOptions {
  /** اگر seed در params نباشد، می‌توان اینجا override کرد */
  seedOverride?: string | number
}

/**
 * اگر step از نوع generator باشد، مسائل را در runtime تولید و به
 * OrchestratorPracticeStep[] تبدیل می‌کند.
 * اگر step ثابت باشد، همان را در آرایهٔ تک‌عضوی برمی‌گرداند (no-op).
 */
export function resolvePracticeStep(
  step: PracticeStepInput,
  options?: ResolvePracticeOptions
): OrchestratorPracticeStep[] {
  if (!isGeneratedPracticeStep(step)) {
    return [step]
  }

  if (!isGeneratorKind(step.generator)) {
    throw new Error(`generator ناشناخته در گام practice: ${step.generator}`)
  }

  const params: GeneratorParams = {
    ...step.params,
    seed: options?.seedOverride ?? step.params.seed,
  }

  const problems = generatePracticeProblems(step.generator, params)
  const expand = step.expandToSteps !== false

  if (!expand) {
    // یک گام با اولین مسئله — بقیه در metadata قابل استفاده‌اند
    const first = problems[0]
    if (!first) return []
    return [problemToPracticeStep(first, step, 0, 1)]
  }

  return problems.map((p, i) =>
    problemToPracticeStep(p, step, i, problems.length)
  )
}

/**
 * تمام گام‌های درس را پیمایش می‌کند؛ practiceهای generator را resolve می‌کند.
 * speak/teach بدون تغییر می‌مانند.
 */
export function resolveLessonSteps<T extends { type: string }>(
  steps: T[],
  options?: ResolvePracticeOptions
): Array<T | OrchestratorPracticeStep> {
  const out: Array<T | OrchestratorPracticeStep> = []
  for (const step of steps) {
    if (step.type === 'practice') {
      out.push(
        ...resolvePracticeStep(step as unknown as PracticeStepInput, options)
      )
    } else {
      out.push(step)
    }
  }
  return out
}
