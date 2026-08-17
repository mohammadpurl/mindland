/**
 * پشتیبانی از input() در مرورگر بدون JSPI:
 * پیش‌اسکن کد → جمع‌آوری جواب‌ها → جایگزینی با لیترال رشته.
 */

export interface InputCallSite {
  /** متن پرامپت داخل input(...) — اگر خالی باشد، پیام پیش‌فرض */
  prompt: string
  /** ایندکس شروع match در کد */
  index: number
  /** طول کل match شامل input(...) */
  length: number
  /** کل متن match */
  match: string
}

const INPUT_RE =
  /\binput\s*\(\s*(?:(['"])((?:\\.|(?!\1).)*)\1)?\s*\)/g

function unescapePrompt(raw: string): string {
  return raw
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

/** همهٔ فراخوانی‌های input(...) را به ترتیب ظاهر پیدا می‌کند. */
export function findInputCalls(code: string): InputCallSite[] {
  const sites: InputCallSite[] = []
  INPUT_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = INPUT_RE.exec(code)) !== null) {
    sites.push({
      prompt: m[2] != null ? unescapePrompt(m[2]) : 'مینی داره ازت می‌پرسه...',
      index: m.index,
      length: m[0].length,
      match: m[0],
    })
  }
  return sites
}

function escapeForPythonString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
}

/**
 * هر input(...) را با لیترال رشتهٔ جواب جایگزین می‌کند (از آخر به اول تا ایندکس‌ها خراب نشوند).
 */
export function rewriteInputsWithAnswers(code: string, answers: string[]): string {
  const sites = findInputCalls(code)
  if (sites.length === 0) return code
  if (answers.length < sites.length) {
    throw new Error('تعداد جواب‌ها از تعداد سؤال‌ها کمتر است.')
  }

  let out = code
  for (let i = sites.length - 1; i >= 0; i--) {
    const site = sites[i]!
    const lit = `"${escapeForPythonString(answers[i] ?? '')}"`
    out = out.slice(0, site.index) + lit + out.slice(site.index + site.length)
  }
  return out
}

/** تعداد فراخوانی‌های input در کد */
export function countInputCalls(code: string): number {
  return findInputCalls(code).length
}

/** آیا حداقل یک input به متغیر انتساب داده شده؟ */
export function hasAssignedInput(code: string): boolean {
  return /^\s*[A-Za-z_][\w]*\s*=\s*input\s*\(/m.test(code) ||
    /^\s*[A-Za-z_][\w]*\s*=\s*int\s*\(\s*input\s*\(/m.test(code)
}

/** متغیرهایی که از input (یا int(input(...))) پر شده‌اند */
export function assignedInputNames(code: string): string[] {
  const names: string[] = []
  const re =
    /^\s*([A-Za-z_][\w]*)\s*=\s*(?:int\s*\(\s*)?input\s*\(/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    if (m[1]) names.push(m[1])
  }
  return names
}
