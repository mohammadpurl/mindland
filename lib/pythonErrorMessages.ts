/**
 * نگاشت خطاهای رایج پایتون مبتدی → پیام سیستمی مینی (نه نصیحت معلم).
 */

export type MiniErrorKind =
  | 'quote'
  | 'paren'
  | 'quote-mismatch'
  | 'quote-waiting'
  | 'name-missing'
  | 'name-typo'
  | 'bare-word'
  | 'type-mismatch'
  | 'div-zero'
  | 'value-error'
  | 'input-as-text'
  | 'missing-colon'
  | 'indent-error'
  | 'infinite-loop'
  | 'stale-condition'
  | 'index-error'
  | 'key-error'
  | 'generic'

export const MINI_SYSTEM_MESSAGES: Record<MiniErrorKind, string> = {
  quote: 'مینی گیر کرد. یه گیومه جا افتاده — زبونش رو کامل ننوشتیم.',
  paren: 'مینی گیر کرد. نگفتیم کجا باید جمله رو بذاره — پرانتز یادت رفت.',
  'quote-mismatch':
    'مینی همین‌جا قفل کرد. دو تا نگهبان این خط با هم جفت نیستن.',
  'quote-waiting': 'مینی منتظر موند نگهبان دوم بیاد، ولی نیومد.',
  'name-missing':
    'مینی دنبال یه جعبه به این اسم گشت ولی پیداش نکرد. مطمئنی قبلش ساختیش؟',
  'name-typo':
    'مینی یه جعبه با این اسم دقیق پیدا نکرد — شاید حروفش یه‌کم فرق داره؟',
  'bare-word':
    'مینی فکر کرد این اسم یه جعبه‌ست، نه یه جمله — نگهبان‌ها رو دورش یادت رفت.',
  'type-mismatch':
    'مینی گیر کرد. یکیشون عدده، یکیشون متن — نمی‌دونه چطور با هم جمعشون کنه.',
  'div-zero': 'مینی گیر کرد. تقسیم بر صفر یعنی جواب نداره!',
  'value-error':
    'مینی سعی کرد این جواب رو عدد کنه، ولی این یه عدد واقعی نبود.',
  'input-as-text':
    'مینی جوابتو به‌عنوان متن گرفت، نه عدد — برای حساب‌کردن باید بهش بگیم این یه عدده.',
  'missing-colon': 'مینی منتظر یه دونقطه بود که نیومد.',
  'indent-error':
    'مینی نفهمید این خط جزو کدوم تصمیمه — فاصله‌ی اول خط رو یه‌کم تنظیم کن.',
  'infinite-loop':
    'مینی داره یه کارو بی‌نهایت تکرار می‌کنه و نمی‌دونه کِی باید وایسه. نمایش رو متوقف کردم — یه‌جای شرط رو چک کن.',
  'stale-condition':
    'مینی هر بار همون سؤال قبلی رو چک می‌کنه — چیزی که بررسی می‌کنه هیچ‌وقت عوض نمی‌شه.',
  'index-error':
    'مینی دنبال جایگاهی تو لیست گشت که وجود نداره — شاید شماره‌اش اشتباهه؟ یادته از صفر می‌شماریم.',
  'key-error':
    'مینی دنبال یه کلید تو دفترچه گشت که پیداش نکرد — شاید اسم کلید رو اشتباه نوشتی؟',
  generic: 'مینی گیر کرد. یه گیومه یا پرانتز جا افتاده — زبونش رو کامل ننوشتیم.',
}

export interface ExplainedPythonError {
  kind: MiniErrorKind
  systemMessage: string
  raw: string
  /** ۱-based شماره خط اگر از traceback یا حالت ترتیبی مشخص باشد */
  line?: number | null
}

function hasMixedQuoteStyle(code: string): boolean {
  const inPrint = /print\s*\(\s*(['"])([\s\S]*)$/m.exec(code)
  if (!inPrint) return false
  const open = inPrint[1]
  const rest = inPrint[2] ?? ''
  if (open === '"' && rest.includes("'") && !rest.includes('"')) return true
  if (open === "'" && rest.includes('"') && !rest.includes("'")) return true
  if (/print\s*\(\s*"\s*[^"]*'\s*\)/.test(code)) return true
  if (/print\s*\(\s*'\s*[^']*"\s*\)/.test(code)) return true
  return false
}

function lineHasMixedGuards(line: string): boolean {
  const m = /print\s*\(\s*(['"])([\s\S]*)/.exec(line)
  if (!m) return false
  const open = m[1]!
  const rest = m[2] ?? ''
  const closeDouble = rest.includes('"')
  const closeSingle = rest.includes("'")
  if (open === '"' && /'[^"]*$/.test(rest) && !closeDouble) return true
  if (open === "'" && /"[^']*$/.test(rest) && !closeSingle) return true
  if (open === '"' && /'/.test(rest) && /"\s*\)?\s*$/.test(rest) === false) {
    // print('....") pattern inside
  }
  return /print\s*\(\s*"\s*[^"]*'\s*\)/.test(line) || /print\s*\(\s*'\s*[^']*"\s*\)/.test(line)
}

/**
 * از متن خطای خام Pyodide/Python، پیام کودک‌پسند سیستم مینی می‌سازد.
 */
export function explainPythonError(
  raw: string,
  code = '',
  opts?: { errorLine?: number | null }
): ExplainedPythonError {
  const text = raw.toLowerCase()
  const lineHint = opts?.errorLine ?? null
  const focusLine =
    lineHint && lineHint > 0
      ? (code.split('\n')[lineHint - 1] ?? code)
      : code

  // حلقهٔ بی‌پایان — قطع توسط محافظ (PY-08 و حلقه‌های بزرگ)
  if (/MINDLAND_INFINITE_LOOP/i.test(raw)) {
    const whileWithoutInputInBody =
      /^\s*while\b/m.test(code) &&
      !/while[\s\S]*\binput\s*\(/.test(code) &&
      !/while[\s\S]*\w+\s*=/.test(code)
    if (whileWithoutInputInBody) {
      return {
        kind: 'stale-condition',
        systemMessage: MINI_SYSTEM_MESSAGES['stale-condition'],
        raw,
        line: lineHint,
      }
    }
    return {
      kind: 'infinite-loop',
      systemMessage: MINI_SYSTEM_MESSAGES['infinite-loop'],
      raw,
      line: lineHint,
    }
  }

  // IndentationError — PY-06/PY-07/PY-08
  if (/IndentationError|TabError/i.test(raw)) {
    const inLoop = /^\s*for\b/m.test(code) || /^\s*while\b/m.test(code)
    return {
      kind: 'indent-error',
      systemMessage: inLoop
        ? 'مینی نفهمید این خط جزو تکرار هست یا نه — فاصله‌ی اول خط رو چک کن.'
        : MINI_SYSTEM_MESSAGES['indent-error'],
      raw,
      line: lineHint,
    }
  }

  // فراموشی دونقطه بعد از if / elif / else / for / while
  if (
    /SyntaxError/i.test(raw) &&
    (/expected ['"]:['"]/i.test(raw) ||
      /expected ':'/i.test(raw) ||
      (/invalid syntax/i.test(raw) &&
        /^\s*(if|elif|else|for|while)\b/.test(focusLine.trim()) &&
        !/:\s*$/.test(focusLine.trim())))
  ) {
    return {
      kind: 'missing-colon',
      systemMessage: MINI_SYSTEM_MESSAGES['missing-colon'],
      raw,
      line: lineHint,
    }
  }

  // ZeroDivisionError — PY-04
  if (/ZeroDivisionError/i.test(raw)) {
    return {
      kind: 'div-zero',
      systemMessage: MINI_SYSTEM_MESSAGES['div-zero'],
      raw,
      line: lineHint,
    }
  }

  // ValueError — معمولاً int("متن") در PY-05
  if (/ValueError/i.test(raw) && (/invalid literal|int\(/i.test(raw) || /int\s*\(/i.test(focusLine))) {
    return {
      kind: 'value-error',
      systemMessage: MINI_SYSTEM_MESSAGES['value-error'],
      raw,
      line: lineHint,
    }
  }

  // TypeError — ناهمگونی عدد و متن (PY-04/06) یا input متنی + عدد (PY-05)
  if (/TypeError/i.test(raw)) {
    // مقایسهٔ ترتیب عدد و رشته (مثلاً age < "10") — PY-06
    if (/not supported between/i.test(raw)) {
      return {
        kind: 'type-mismatch',
        systemMessage:
          'مینی این دوتا رو یه‌جنس ندید — یکی عدده، یکی متن، حتی اگه شکلشون یکی باشه. یادته تو PY-04 دیدیم؟',
        raw,
        line: lineHint,
      }
    }
    if (
      /unsupported operand|can only concatenate|not supported between/i.test(raw) ||
      /concatenat|str/i.test(raw)
    ) {
      // اگر کد input دارد و عملیات عددی بدون int → پیام PY-05
      if (/\binput\s*\(/.test(code) && /[+\-*/%]/.test(focusLine) && !/\bint\s*\(/.test(code)) {
        return {
          kind: 'input-as-text',
          systemMessage: MINI_SYSTEM_MESSAGES['input-as-text'],
          raw,
          line: lineHint,
        }
      }
      if (/unsupported operand|not supported between/i.test(raw)) {
        return {
          kind: 'type-mismatch',
          systemMessage: MINI_SYSTEM_MESSAGES['type-mismatch'],
          raw,
          line: lineHint,
        }
      }
      return {
        kind: 'generic',
        systemMessage:
          'مینی قاطی کرد. جعبهٔ عدد رو نمی‌تونه مستقیم به جمله بچسبونه — با ویرگول تو print بنویس: print("سلام"، name، age)',
        raw,
        line: lineHint,
      }
    }
  }

  // IndexError — PY-09
  if (/IndexError/i.test(raw)) {
    return {
      kind: 'index-error',
      systemMessage: MINI_SYSTEM_MESSAGES['index-error'],
      raw,
      line: lineHint,
    }
  }

  // KeyError — PY-10
  if (/KeyError/i.test(raw)) {
    return {
      kind: 'key-error',
      systemMessage: MINI_SYSTEM_MESSAGES['key-error'],
      raw,
      line: lineHint,
    }
  }

  // NameError — اولویت بالا برای PY-03
  if (/NameError/i.test(raw)) {
    const nameMatch = /name\s+['"]([^'"]+)['"]\s+is not defined/i.exec(raw)
    const badName = nameMatch?.[1] ?? ''
    const defined = [...code.matchAll(/^\s*([A-Za-z_][\w]*)\s*=/gm)].map((m) => m[1]!)
    const closeTypo =
      badName.length > 1 &&
      defined.some(
        (d) =>
          d !== badName &&
          (d.includes(badName) ||
            badName.includes(d) ||
            Math.abs(d.length - badName.length) <= 1)
      )
    if (closeTypo) {
      return {
        kind: 'name-typo',
        systemMessage: MINI_SYSTEM_MESSAGES['name-typo'],
        raw,
        line: lineHint,
      }
    }
    return {
      kind: 'name-missing',
      systemMessage: MINI_SYSTEM_MESSAGES['name-missing'],
      raw,
      line: lineHint,
    }
  }

  // print(سلام) بدون گیومه → NameError گاهی؛ یا Syntax اگر فارسی
  if (
    /print\s*\(\s*[^\s'"`\d(+{\[][^)]*\)/.test(focusLine) &&
    !/print\s*\(\s*['"]/.test(focusLine) &&
    (/NameError/i.test(raw) || /SyntaxError/i.test(raw))
  ) {
    return {
      kind: 'bare-word',
      systemMessage: MINI_SYSTEM_MESSAGES['bare-word'],
      raw,
      line: lineHint,
    }
  }

  // انتساب متن بدون گیومه: name = آرش
  if (
    /^\s*\w+\s*=\s*[^\s'"`\d(+{\[]/.test(focusLine.trim()) &&
    /NameError/i.test(raw)
  ) {
    return {
      kind: 'bare-word',
      systemMessage:
        'مینی فکر کرد آرش هم اسم یه جعبه‌ی دیگه‌ست، نه یه کلمه — دور کلمه گیومه لازم داره.',
      raw,
      line: lineHint,
    }
  }

  if (lineHasMixedGuards(focusLine) || hasMixedQuoteStyle(focusLine)) {
    return {
      kind: 'quote-mismatch',
      systemMessage: MINI_SYSTEM_MESSAGES['quote-mismatch'],
      raw,
      line: lineHint,
    }
  }

  if (
    /EOL while scanning string literal/i.test(raw) ||
    /unterminated string literal/i.test(raw) ||
    /unterminated triple-quoted string/i.test(raw)
  ) {
    if (lineHasMixedGuards(focusLine) || hasMixedQuoteStyle(focusLine)) {
      return {
        kind: 'quote-mismatch',
        systemMessage: MINI_SYSTEM_MESSAGES['quote-mismatch'],
        raw,
        line: lineHint,
      }
    }
    return {
      kind: 'quote-waiting',
      systemMessage: MINI_SYSTEM_MESSAGES['quote-waiting'],
      raw,
      line: lineHint,
    }
  }

  if (
    /\(\s*was never closed/i.test(raw) ||
    /unexpected EOF while parsing/i.test(raw) ||
    /'\('\s*was never closed/i.test(raw) ||
    /unmatched '\)'/i.test(raw)
  ) {
    return {
      kind: 'paren',
      systemMessage: MINI_SYSTEM_MESSAGES.paren,
      raw,
      line: lineHint,
    }
  }

  if (/SyntaxError/i.test(raw) && (text.includes('quote') || text.includes('string'))) {
    return {
      kind: 'quote',
      systemMessage: MINI_SYSTEM_MESSAGES.quote,
      raw,
      line: lineHint,
    }
  }

  if (hasMixedQuoteStyle(code)) {
    return {
      kind: 'quote-mismatch',
      systemMessage: MINI_SYSTEM_MESSAGES['quote-mismatch'],
      raw,
      line: lineHint,
    }
  }

  return {
    kind: 'generic',
    systemMessage: MINI_SYSTEM_MESSAGES.generic,
    raw,
    line: lineHint,
  }
}
