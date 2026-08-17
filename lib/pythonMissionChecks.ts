/**
 * اعتبارسنجی مأموریت درس‌های پایتون — معیار successCriteria سناریو را در UI اعمال می‌کند.
 */

import {
  assignedInputNames,
  countInputCalls,
  hasAssignedInput,
} from '@/lib/pythonInputFallback'

export type MissionCheckId =
  | 'typed'
  | 'ran'
  | 'said'
  | 'prints3'
  | 'card-complete'
  | 'has-comment'
  | 'string-vs-number'
  | 'has-name'
  | 'has-age'
  | 'used-both'
  | 'age-changed'
  | 'has-like'
  | 'has-city'
  | 'city-changed'
  | 'three-vars'
  | 'bare-numbers'
  | 'used-add'
  | 'used-four-ops'
  | 'used-parens'
  | 'used-modulo'
  | 'has-input'
  | 'input-assigned'
  | 'used-input-var'
  | 'two-inputs'
  | 'three-inputs'
  | 'used-int'
  | 'has-if'
  | 'has-else'
  | 'has-elif'
  | 'has-for'
  | 'has-range'
  | 'loop-printed'
  | 'triangle-pattern'
  | 'used-loop-var'
  | 'has-while'
  | 'has-target'
  | 'while-win'
  | 'has-attempts'
  | 'has-list'
  | 'used-append'
  | 'list-loop-print'
  | 'used-in'
  | 'list-index-change'
  | 'has-dict'
  | 'used-key-access'
  | 'dict-three-keys'
  | 'dict-updated'
  | 'has-def'
  | 'has-return'
  | 'function-called'
  | 'function-with-arg'
  | 'has-menu'
  | 'uses-function'
  | 'uses-loop'
  | 'uses-input'
  | 'has-turtle'
  | 'turtle-forward'
  | 'turtle-turn'
  | 'turtle-drew'
  | 'capstone-function'
  | 'capstone-data'
  | 'capstone-ran'
  | 'capstone-explained'

export interface MissionCheckContext {
  code: string
  output: string
  hasError: boolean
  /** برای تشخیص «سن را عوض کردم» بین دو اجرای موفق */
  previousCode?: string
}

export function countPrintCalls(code: string): number {
  const matches = code.match(/\bprint\s*\(/g)
  return matches?.length ?? 0
}

export function hasAssignment(code: string, name: string): boolean {
  const re = new RegExp(`^\\s*${name}\\s*=`, 'm')
  return re.test(code)
}

export function usesNameInPrint(code: string, name: string): boolean {
  return new RegExp(`print\\s*\\([^\\n]*\\b${name}\\b`, 'm').test(code)
}

export function hasHashComment(code: string): boolean {
  return /^\s*#.+/.test(code) || /\n\s*#.+/.test(code)
}

/** print("۵") و print(5) هر دو در کد باشند (چالش B درس ۲) */
export function hasStringVsNumberDemo(code: string): boolean {
  const hasQuotedDigit = /print\s*\(\s*["']\s*[۰-۹0-9]+\s*["']\s*\)/.test(code)
  const hasBareNumber = /print\s*\(\s*[۰-۹0-9]+\s*\)/.test(code)
  return hasQuotedDigit && hasBareNumber
}

/**
 * سن عوض شده اگر دو انتساب age با مقادیر متفاوت در کد باشد،
 * یا نسبت به اجرای قبل مقدار age فرق کرده باشد.
 */
export function ageWasReassigned(code: string, previousCode?: string): boolean {
  const ages = [...code.matchAll(/^\s*age\s*=\s*(.+)$/gm)].map((m) => m[1]!.trim())
  if (ages.length >= 2 && ages[0] !== ages[ages.length - 1]) return true
  if (!previousCode) return false
  const prev = /^\s*age\s*=\s*(.+)$/m.exec(previousCode)?.[1]?.trim()
  const curr = ages[ages.length - 1]
  return Boolean(prev && curr && prev !== curr)
}

export function cityWasReassigned(code: string, previousCode?: string): boolean {
  const cities = [...code.matchAll(/^\s*city\s*=\s*(.+)$/gm)].map((m) => m[1]!.trim())
  if (cities.length >= 2 && cities[0] !== cities[cities.length - 1]) return true
  if (!previousCode) return false
  const prev = /^\s*city\s*=\s*(.+)$/m.exec(previousCode)?.[1]?.trim()
  const curr = cities[cities.length - 1]
  return Boolean(prev && curr && prev !== curr)
}

/** کد بدون رشته‌های نقل‌قول‌شده — برای تشخیص عدد واقعی در مقابل متن عددی */
function codeWithoutStringLiterals(code: string): string {
  return code
    .replace(/'''[\s\S]*?'''/g, ' ')
    .replace(/"""[\s\S]*?"""/g, ' ')
    .replace(/'(?:\\.|[^'\\])*'/g, ' ')
    .replace(/"(?:\\.|[^"\\])*"/g, ' ')
}

/** حداقل دو عدد واقعی (بدون گیومه) در عبارت‌های محاسباتی */
export function hasBareNumbers(code: string): boolean {
  const bare = codeWithoutStringLiterals(code)
  const nums = bare.match(/(?<![A-Za-z_])[۰-۹0-9]+(?:\.[۰-۹0-9]+)?(?![A-Za-z_])/g)
  return (nums?.length ?? 0) >= 2
}

export function hasAddOp(code: string): boolean {
  const bare = codeWithoutStringLiterals(code)
  return /[۰-۹0-9)\]]\s*\+\s*[۰-۹0-9(]/.test(bare) || /\+\s*[۰-۹0-9]/.test(bare)
}

export function hasFourOps(code: string): boolean {
  const bare = codeWithoutStringLiterals(code)
  return /\+/.test(bare) && /-/.test(bare) && /\*/.test(bare) && /\//.test(bare)
}

/** پرانتز در محاسبات (نه فقط دور آرگومان print/input) */
export function hasArithmeticParens(code: string): boolean {
  const bare = codeWithoutStringLiterals(code)
  return /\(\s*[۰-۹0-9][^)\n]*[+*/%-][^)\n]*\)/.test(bare)
}

export function hasModulo(code: string): boolean {
  const bare = codeWithoutStringLiterals(code)
  return /%/.test(bare)
}

export function hasIntConversion(code: string): boolean {
  return /\bint\s*\(/.test(code)
}

export function hasIfStatement(code: string): boolean {
  return /^\s*if\s+.+:/m.test(code) || /^\s*if\s+/m.test(code)
}

export function hasElseStatement(code: string): boolean {
  return /^\s*else\s*:/m.test(code)
}

export function hasElifStatement(code: string): boolean {
  return /^\s*elif\s+.+:/m.test(code) || /^\s*elif\s+/m.test(code)
}

export function hasForLoop(code: string): boolean {
  return /^\s*for\s+\w+\s+in\s+/m.test(code)
}

export function hasRangeCall(code: string): boolean {
  return /\brange\s*\(/.test(code)
}

/** چند خط خروجی ستاره‌دار یا چند تکرار موفق */
export function loopPrintedStars(code: string, output: string, hasError: boolean): boolean {
  if (hasError || !hasForLoop(code)) return false
  const lines = output
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  const starLines = lines.filter((l) => /\*/.test(l))
  return starLines.length >= 2 || (starLines.length >= 1 && /\*\s*\*/.test(starLines[0] ?? ''))
}

/**
 * الگوی مثلثی: خطوطی که تعداد ستاره در آن‌ها افزایش می‌یابد،
 * یا کد شامل "*" * (i+1) / مشابه.
 */
export function hasTrianglePattern(code: string, output: string, hasError: boolean): boolean {
  if (hasError || !hasForLoop(code)) return false
  if (/\*\s*"\s*\*\s*\(|"\*"\s*\*|'\*'\s*\*/.test(code) || /\*\s*\(\s*\w+\s*\+\s*1\s*\)/.test(code)) {
    return true
  }
  const starCounts = output
    .trim()
    .split('\n')
    .map((l) => (l.match(/\*/g) ?? []).length)
    .filter((n) => n > 0)
  if (starCounts.length < 2) return false
  let growing = 0
  for (let i = 1; i < starCounts.length; i++) {
    if (starCounts[i]! > starCounts[i - 1]!) growing++
  }
  return growing >= 1
}

/** استفاده از متغیر شمارندهٔ for در بدنه (غیر از فقط بودن در for i in) */
export function usesLoopVariable(code: string): boolean {
  const m = /^\s*for\s+([A-Za-z_][\w]*)\s+in\s+/m.exec(code)
  if (!m?.[1]) return false
  const name = m[1]
  const body = code.replace(m[0], '')
  return new RegExp(`\\b${name}\\b`).test(body)
}

export function hasWhileLoop(code: string): boolean {
  return /^\s*while\s+.+:/m.test(code) || /^\s*while\s+/m.test(code)
}

/** عدد هدف ثابت مثل secret = 7 یا target = 5 */
export function hasGuessTarget(code: string): boolean {
  return (
    /^\s*(secret|target|answer|number|goal|num)\s*=\s*\d+/m.test(code) ||
    /while\s+\w+\s*!=\s*\d+/.test(code) ||
    /while\s+\d+\s*!=\s*\w+/.test(code) ||
    /\w+\s*==\s*\d+/.test(code)
  )
}

export function hasWinMessage(code: string, output: string, hasError: boolean): boolean {
  if (hasError) return false
  return /آفرین|بردی|درست|موفق|صحیح|win|correct/i.test(`${code}\n${output}`)
}

export function hasAttemptsCounter(code: string): boolean {
  return (
    /^\s*(tries|attempts|count|counter|talash|n)\s*=\s*0/m.test(code) ||
    /^\s*(tries|attempts|count|counter)\s*=\s*0/m.test(code) ||
    /\b(tries|attempts|count|counter)\s*\+=\s*1/.test(code) ||
    /\b(tries|attempts|count|counter)\s*=\s*\w+\s*\+\s*1/.test(code)
  )
}

export function hasListLiteral(code: string): boolean {
  return /\w+\s*=\s*\[/.test(code) || /\[\s*["'][^"']*["']/.test(code)
}

export function usedAppend(code: string): boolean {
  return /\.append\s*\(/.test(code)
}

/** for x in list_var با print در بدنه */
export function listLoopPrint(code: string, output: string, hasError: boolean): boolean {
  if (hasError) return false
  const forInList = /^\s*for\s+\w+\s+in\s+\w+/m.test(code)
  const forInLiteral = /^\s*for\s+\w+\s+in\s*\[/m.test(code)
  if (!forInList && !forInLiteral) return false
  return countPrintCalls(code) >= 1 && output.trim().split('\n').filter(Boolean).length >= 1
}

export function usedInOperator(code: string): boolean {
  return /\bin\s+/.test(code)
}

export function listIndexChanged(code: string): boolean {
  return /\w+\s*\[\s*\d+\s*\]\s*=/.test(code)
}

export function hasDictLiteral(code: string): boolean {
  return /\w+\s*=\s*\{/.test(code) || /\{\s*["']?\w+["']?\s*:/.test(code)
}

export function usedKeyAccess(code: string): boolean {
  return /\[\s*["'][^"']+["']\s*\]/.test(code) || /\.get\s*\(/.test(code)
}

export function dictHasThreeKeys(code: string): boolean {
  const start = code.indexOf('{')
  if (start < 0) return false
  let depth = 0
  let end = start
  for (let i = start; i < code.length; i++) {
    const ch = code[i]
    if (ch === '{') depth++
    if (ch === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  const inner = code.slice(start + 1, end)
  const keys = inner.match(/["']?[\w\u0600-\u06FF]+["']?\s*:/g)
  return (keys?.length ?? 0) >= 3
}

export function dictUpdated(code: string): boolean {
  return /\w+\s*\[\s*["'][^"']+["']\s*\]\s*=/.test(code)
}

export function hasDefStatement(code: string): boolean {
  return /^\s*def\s+\w+/m.test(code)
}

export function hasReturnStatement(code: string): boolean {
  return /^\s*return\b/m.test(code)
}

export function functionIsCalled(code: string): boolean {
  const defs = [...code.matchAll(/^\s*def\s+(\w+)/gm)].map((m) => m[1]!)
  if (defs.length === 0) return false
  const lines = code.split('\n')
  return defs.some((name) =>
    lines.some((line) => !/^\s*def\s/.test(line) && new RegExp(`\\b${name}\\s*\\(`).test(line))
  )
}

export function functionHasArg(code: string): boolean {
  return /^\s*def\s+\w+\s*\(\s*\w+/.test(code)
}

export function hasMenu(code: string): boolean {
  return (
    /print\s*\(\s*["'][^"']*(?:منو|انتخاب|۱|1\.|2\.|جمع|خروج)/.test(code) ||
    (/print\s*\(/.test(code) && /input\s*\(\s*["'][^"']*(?:انتخاب|گزینه)/.test(code))
  )
}

export function usesFunctionCheck(code: string): boolean {
  return hasDefStatement(code) && functionIsCalled(code)
}

export function usesLoopCheck(code: string): boolean {
  return hasForLoop(code) || hasWhileLoop(code)
}

export function usesInputCheck(code: string): boolean {
  return countInputCalls(code) >= 1
}

export function hasTurtleImport(code: string): boolean {
  return /\bimport\s+turtle\b/.test(code) || /\bfrom\s+turtle\s+import/.test(code)
}

export function turtleForward(code: string): boolean {
  return /\.(?:forward|fd)\s*\(/.test(code)
}

export function turtleTurn(code: string): boolean {
  return /\.(?:left|right|lt|rt)\s*\(/.test(code)
}

export function turtleDrew(output: string, hasError: boolean): boolean {
  if (hasError) return false
  return /MINDLAND_TURTLE:/.test(output)
}

export function capstoneHasFunction(code: string): boolean {
  return hasDefStatement(code)
}

export function capstoneHasData(code: string): boolean {
  return hasListLiteral(code) || hasDictLiteral(code)
}

export function capstoneExplained(code: string): boolean {
  return hasHashComment(code) && code.replace(/^\s*#.+$/gm, '').trim().length > 20
}

export function evaluateMissionChecks(
  ids: MissionCheckId[],
  ctx: MissionCheckContext
): Record<string, boolean> {
  const { code, output, hasError, previousCode } = ctx
  const ok = !hasError && Boolean(output.trim() || countPrintCalls(code) > 0)
  const result: Record<string, boolean> = {}

  for (const id of ids) {
    switch (id) {
      case 'typed':
        result[id] = code.trim().length > 0
        break
      case 'ran':
        result[id] = true
        break
      case 'said':
        result[id] = ok && !hasError
        break
      case 'prints3':
        result[id] = countPrintCalls(code) >= 3
        break
      case 'card-complete':
        result[id] = !hasError && countPrintCalls(code) >= 3 && output.trim().split('\n').filter(Boolean).length >= 3
        break
      case 'has-comment':
        result[id] = hasHashComment(code)
        break
      case 'string-vs-number':
        result[id] = hasStringVsNumberDemo(code)
        break
      case 'has-name':
        result[id] = hasAssignment(code, 'name')
        break
      case 'has-age':
        result[id] = hasAssignment(code, 'age')
        break
      case 'has-like': {
        const names = [...code.matchAll(/^\s*([A-Za-z_][\w]*)\s*=/gm)].map((m) => m[1]!)
        result[id] =
          names.some((n) => ['like', 'favorite', 'hobby', 'thing', 'food', 'color'].includes(n)) ||
          names.filter((n) => n !== 'name' && n !== 'age').length >= 1
        break
      }
      case 'has-city':
        result[id] = hasAssignment(code, 'city')
        break
      case 'used-both':
        result[id] =
          !hasError &&
          hasAssignment(code, 'name') &&
          hasAssignment(code, 'age') &&
          usesNameInPrint(code, 'name') &&
          usesNameInPrint(code, 'age')
        break
      case 'age-changed':
        result[id] = !hasError && ageWasReassigned(code, previousCode)
        break
      case 'city-changed':
        result[id] = !hasError && cityWasReassigned(code, previousCode)
        break
      case 'three-vars':
        result[id] =
          hasAssignment(code, 'name') &&
          hasAssignment(code, 'age') &&
          hasAssignment(code, 'city')
        break
      case 'bare-numbers':
        result[id] = hasBareNumbers(code)
        break
      case 'used-add':
        result[id] = hasAddOp(code)
        break
      case 'used-four-ops':
        result[id] = hasFourOps(code)
        break
      case 'used-parens':
        result[id] = hasArithmeticParens(code)
        break
      case 'used-modulo':
        result[id] = hasModulo(code)
        break
      case 'has-input':
        result[id] = countInputCalls(code) >= 1
        break
      case 'input-assigned':
        result[id] = hasAssignedInput(code)
        break
      case 'used-input-var': {
        const names = assignedInputNames(code)
        result[id] =
          !hasError && names.length > 0 && names.some((n) => usesNameInPrint(code, n))
        break
      }
      case 'two-inputs':
        result[id] = countInputCalls(code) >= 2
        break
      case 'three-inputs':
        result[id] = countInputCalls(code) >= 3
        break
      case 'used-int':
        result[id] = hasIntConversion(code)
        break
      case 'has-if':
        result[id] = hasIfStatement(code)
        break
      case 'has-else':
        result[id] = hasElseStatement(code)
        break
      case 'has-elif':
        result[id] = hasElifStatement(code)
        break
      case 'has-for':
        result[id] = hasForLoop(code) && hasRangeCall(code)
        break
      case 'has-range':
        result[id] = hasRangeCall(code)
        break
      case 'loop-printed':
        result[id] = loopPrintedStars(code, output, hasError)
        break
      case 'triangle-pattern':
        result[id] = hasTrianglePattern(code, output, hasError)
        break
      case 'used-loop-var':
        result[id] = usesLoopVariable(code)
        break
      case 'has-while':
        result[id] = hasWhileLoop(code)
        break
      case 'has-target':
        result[id] = hasGuessTarget(code)
        break
      case 'while-win':
        result[id] = hasWhileLoop(code) && hasWinMessage(code, output, hasError)
        break
      case 'has-attempts':
        result[id] = hasAttemptsCounter(code)
        break
      case 'has-list':
        result[id] = hasListLiteral(code)
        break
      case 'used-append':
        result[id] = usedAppend(code)
        break
      case 'list-loop-print':
        result[id] = listLoopPrint(code, output, hasError)
        break
      case 'used-in':
        result[id] = usedInOperator(code)
        break
      case 'list-index-change':
        result[id] = listIndexChanged(code)
        break
      case 'has-dict':
        result[id] = hasDictLiteral(code)
        break
      case 'used-key-access':
        result[id] = usedKeyAccess(code)
        break
      case 'dict-three-keys':
        result[id] = dictHasThreeKeys(code)
        break
      case 'dict-updated':
        result[id] = dictUpdated(code)
        break
      case 'has-def':
        result[id] = hasDefStatement(code)
        break
      case 'has-return':
        result[id] = hasReturnStatement(code)
        break
      case 'function-called':
        result[id] = functionIsCalled(code)
        break
      case 'function-with-arg':
        result[id] = functionHasArg(code)
        break
      case 'has-menu':
        result[id] = hasMenu(code)
        break
      case 'uses-function':
        result[id] = usesFunctionCheck(code)
        break
      case 'uses-loop':
        result[id] = usesLoopCheck(code)
        break
      case 'uses-input':
        result[id] = usesInputCheck(code)
        break
      case 'has-turtle':
        result[id] = hasTurtleImport(code)
        break
      case 'turtle-forward':
        result[id] = turtleForward(code)
        break
      case 'turtle-turn':
        result[id] = turtleTurn(code)
        break
      case 'turtle-drew':
        result[id] = turtleDrew(output, hasError)
        break
      case 'capstone-function':
        result[id] = capstoneHasFunction(code)
        break
      case 'capstone-data':
        result[id] = capstoneHasData(code)
        break
      case 'capstone-ran':
        result[id] = ok && !hasError
        break
      case 'capstone-explained':
        result[id] = capstoneExplained(code)
        break
      default:
        result[id] = false
    }
  }

  return result
}

export function extractErrorLine(raw: string): number | null {
  const m =
    /File "[^"]*", line (\d+)/i.exec(raw) ||
    /,\s*line (\d+)/i.exec(raw) ||
    /line (\d+)/i.exec(raw)
  if (!m) return null
  const n = Number(m[1])
  return Number.isFinite(n) && n > 0 ? n : null
}
