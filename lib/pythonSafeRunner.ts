/**
 * محافظ حلقه و ورودی پویا برای Pyodide روی ترد اصلی.
 * - تیک شمارنده / زمان داخل for و while
 * - input داخل حلقه با اجرای مجدد + لیست جواب‌ها (نه جایگزینی ایستا)
 */

export const MINDLAND_NEED_INPUT_PREFIX = 'MINDLAND_NEED_INPUT:'
export const MINDLAND_INFINITE_LOOP_MARKER = 'MINDLAND_INFINITE_LOOP'

const MAX_LOOP_ITERS = 8_000
const MAX_WALL_SECONDS = 4
const MAX_DYNAMIC_INPUTS = 40

/** آیا کد ساختار تکرار دارد؟ */
export function hasLoopStructure(code: string): boolean {
  return /^\s*(for|while)\b/m.test(code)
}

/**
 * بدنهٔ for/while را با فراخوانی تیک محافظ تزریق می‌کند (خط اول بدنه).
 * فقط برای تورفتگی‌های سادهٔ مبتنی بر فاصله/تب کار می‌کند.
 */
export function injectLoopTicks(code: string): string {
  const lines = code.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? ''
    out.push(line)
    const header = /^(\s*)(for|while)\b.*:\s*(#.*)?$/.exec(line)
    if (!header) continue
    const indent = header[1] ?? ''
    // پیدا کردن تورفتگی بدنه از خط بعدی غیرخالی
    let bodyIndent: string | null = null
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j] ?? ''
      if (!next.trim() || next.trim().startsWith('#')) continue
      const m = /^(\s*)/.exec(next)
      const nextIndent = m?.[1] ?? ''
      if (nextIndent.length > indent.length) {
        bodyIndent = nextIndent
      }
      break
    }
    const tickIndent = bodyIndent ?? `${indent}    `
    out.push(`${tickIndent}__mindland_tick()`)
  }

  return out.join('\n')
}

export function wrapWithSafePreamble(userCode: string, answers: string[]): string {
  const answersLiteral = JSON.stringify(answers)
  const instrumented = injectLoopTicks(userCode)

  return `
__mindland_answers = ${answersLiteral}
__mindland_ai = 0
__mindland_loops = 0
__mindland_t0 = __import__('time').time()

def __mindland_tick():
    global __mindland_loops
    __mindland_loops += 1
    if __mindland_loops > ${MAX_LOOP_ITERS}:
        raise RuntimeError(${JSON.stringify(MINDLAND_INFINITE_LOOP_MARKER)})
    if __import__('time').time() - __mindland_t0 > ${MAX_WALL_SECONDS}:
        raise RuntimeError(${JSON.stringify(MINDLAND_INFINITE_LOOP_MARKER)})

def input(prompt=""):
    global __mindland_ai
    p = "" if prompt is None else str(prompt)
    if __mindland_ai >= len(__mindland_answers):
        raise RuntimeError(${JSON.stringify(MINDLAND_NEED_INPUT_PREFIX)} + p)
    v = __mindland_answers[__mindland_ai]
    __mindland_ai += 1
    return v

${instrumented}
`.trim()
}

export function parseNeedInputPrompt(error: string | null | undefined): string | null {
  if (!error) return null
  const idx = error.indexOf(MINDLAND_NEED_INPUT_PREFIX)
  if (idx === -1) return null
  const rest = error.slice(idx + MINDLAND_NEED_INPUT_PREFIX.length)
  const lineBreak = rest.search(/[\r\n]/)
  return (lineBreak === -1 ? rest : rest.slice(0, lineBreak)).trim()
}

export function isInfiniteLoopError(error: string | null | undefined): boolean {
  return Boolean(error && error.includes(MINDLAND_INFINITE_LOOP_MARKER))
}

export const SAFE_RUNNER_LIMITS = {
  maxLoopIters: MAX_LOOP_ITERS,
  maxWallSeconds: MAX_WALL_SECONDS,
  maxDynamicInputs: MAX_DYNAMIC_INPUTS,
} as const
