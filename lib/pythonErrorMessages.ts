/**
 * نگاشت خطاهای رایج پایتون مبتدی → پیام سیستمی مینی (نه نصیحت معلم).
 */

export type MiniErrorKind = 'quote' | 'paren' | 'quote-mismatch' | 'generic'

export const MINI_SYSTEM_MESSAGES: Record<MiniErrorKind, string> = {
  quote: 'مینی گیر کرد. یه گیومه جا افتاده — زبونش رو کامل ننوشتیم.',
  paren: 'مینی گیر کرد. نگفتیم کجا باید جمله رو بذاره — پرانتز یادت رفت.',
  'quote-mismatch':
    'مینی گیر کرد. دو تا علامت جفت‌نشدن — یکی از گیومه‌ها با اون یکی فرق داره.',
  generic: 'مینی گیر کرد. یه گیومه یا پرانتز جا افتاده — زبونش رو کامل ننوشتیم.',
}

export interface ExplainedPythonError {
  kind: MiniErrorKind
  systemMessage: string
  raw: string
}

function hasMixedQuoteStyle(code: string): boolean {
  const inPrint = /print\s*\(\s*(['"])([\s\S]*)$/m.exec(code)
  if (!inPrint) return false
  const open = inPrint[1]
  const rest = inPrint[2] ?? ''
  if (open === '"' && rest.includes("'") && !rest.includes('"')) return true
  if (open === "'" && rest.includes('"') && !rest.includes("'")) return true
  // print("...') or print('...")
  if (/print\s*\(\s*"\s*[^"]*'\s*\)/.test(code)) return true
  if (/print\s*\(\s*'\s*[^']*"\s*\)/.test(code)) return true
  return false
}

/**
 * از متن خطای خام Pyodide/Python، پیام کودک‌پسند سیستم مینی می‌سازد.
 */
export function explainPythonError(raw: string, code = ''): ExplainedPythonError {
  const text = raw.toLowerCase()

  if (
    hasMixedQuoteStyle(code) ||
    text.includes('unterminated string') && (code.includes(`"'`) || code.includes(`'"`))
  ) {
    // continue to more specific checks below
  }

  if (
    /EOL while scanning string literal/i.test(raw) ||
    /unterminated string literal/i.test(raw) ||
    /unterminated triple-quoted string/i.test(raw)
  ) {
    if (hasMixedQuoteStyle(code)) {
      return {
        kind: 'quote-mismatch',
        systemMessage: MINI_SYSTEM_MESSAGES['quote-mismatch'],
        raw,
      }
    }
    return { kind: 'quote', systemMessage: MINI_SYSTEM_MESSAGES.quote, raw }
  }

  if (
    /\(\s*was never closed/i.test(raw) ||
    /unexpected EOF while parsing/i.test(raw) ||
    /'\('\s*was never closed/i.test(raw) ||
    /unmatched '\)'/i.test(raw)
  ) {
    return { kind: 'paren', systemMessage: MINI_SYSTEM_MESSAGES.paren, raw }
  }

  if (
    /SyntaxError/i.test(raw) &&
    (text.includes('quote') || text.includes('string'))
  ) {
    return { kind: 'quote', systemMessage: MINI_SYSTEM_MESSAGES.quote, raw }
  }

  if (hasMixedQuoteStyle(code)) {
    return {
      kind: 'quote-mismatch',
      systemMessage: MINI_SYSTEM_MESSAGES['quote-mismatch'],
      raw,
    }
  }

  return { kind: 'generic', systemMessage: MINI_SYSTEM_MESSAGES.generic, raw }
}
