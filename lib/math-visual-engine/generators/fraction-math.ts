import type { FractionLiteral } from './types'

export function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y !== 0) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

export function simplify(f: FractionLiteral): FractionLiteral {
  if (f.denominator === 0) throw new Error('denominator cannot be 0')
  const g = gcd(f.numerator, f.denominator)
  let n = f.numerator / g
  let d = f.denominator / g
  if (d < 0) {
    n = -n
    d = -d
  }
  return { numerator: n, denominator: d }
}

export function toImproper(f: FractionLiteral): number {
  return f.numerator / f.denominator
}

export function compareFractions(a: FractionLiteral, b: FractionLiteral): -1 | 0 | 1 {
  const left = a.numerator * b.denominator
  const right = b.numerator * a.denominator
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

export function addFractions(a: FractionLiteral, b: FractionLiteral): FractionLiteral {
  const d = lcm(a.denominator, b.denominator)
  return simplify({
    numerator: (a.numerator * d) / a.denominator + (b.numerator * d) / b.denominator,
    denominator: d,
  })
}

export function subtractFractions(a: FractionLiteral, b: FractionLiteral): FractionLiteral {
  const d = lcm(a.denominator, b.denominator)
  return simplify({
    numerator: (a.numerator * d) / a.denominator - (b.numerator * d) / b.denominator,
    denominator: d,
  })
}

export function multiplyFractions(a: FractionLiteral, b: FractionLiteral): FractionLiteral {
  return simplify({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  })
}

export function divideFractions(a: FractionLiteral, b: FractionLiteral): FractionLiteral {
  if (b.numerator === 0) throw new Error('division by zero fraction')
  return multiplyFractions(a, { numerator: b.denominator, denominator: b.numerator })
}

export function formatFraction(f: FractionLiteral): string {
  return `${f.numerator}/${f.denominator}`
}

export function fractionsEqual(a: FractionLiteral, b: FractionLiteral): boolean {
  const sa = simplify(a)
  const sb = simplify(b)
  return sa.numerator === sb.numerator && sa.denominator === sb.denominator
}
