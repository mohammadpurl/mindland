/**
 * Unit tests — Practice Generator (fraction)
 * Run: npm run test:generators
 */
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  addFractions,
  compareFractions,
  divideFractions,
  fractionsEqual,
  generateFractionAdditionDiffDenom,
  generateFractionAdditionSameDenom,
  generateFractionComparison,
  generateFractionDivision,
  generateFractionMultiplication,
  generateFractionSubtractionDiffDenom,
  generateFractionSubtractionSameDenom,
  lcm,
  multiplyFractions,
  simplify,
  subtractFractions,
} from '../index'
import type { FractionLiteral, GeneratorParams } from '../types'
import { resolvePracticeStep } from '../resolve-practice'

const baseParams = (seed: string, count = 12): GeneratorParams => ({
  denominatorRange: [2, 9],
  count,
  allowImproperFractions: false,
  seed,
})

function assertFraction(f: FractionLiteral) {
  assert.ok(Number.isInteger(f.numerator))
  assert.ok(Number.isInteger(f.denominator))
  assert.ok(f.denominator > 0)
}

describe('fraction-comparison', () => {
  it('produces reproducible results with the same seed', () => {
    const a = generateFractionComparison(baseParams('cmp-seed', 5))
    const b = generateFractionComparison(baseParams('cmp-seed', 5))
    assert.deepEqual(a, b)
  })

  it('answer matches cross-multiplication comparison', () => {
    const problems = generateFractionComparison(baseParams('cmp-math', 20))
    for (const p of problems) {
      assert.equal(p.operands.length, 2)
      const [x, y] = p.operands
      assertFraction(x!)
      assertFraction(y!)
      const cmp = compareFractions(x!, y!)
      const expected =
        cmp < 0 ? 'lt' : cmp > 0 ? 'gt' : 'eq'
      assert.equal(p.answer, expected)
      if (expected === 'eq') assert.equal(p.largerIndex, -1)
      else assert.equal(p.largerIndex, expected === 'gt' ? 0 : 1)
    }
  })
})

describe('fraction-addition-same-denom', () => {
  it('keeps same denominator and correct sum', () => {
    const problems = generateFractionAdditionSameDenom(baseParams('add-same'))
    for (const p of problems) {
      const [a, b] = p.operands
      assert.equal(a!.denominator, b!.denominator)
      assert.equal(p.commonDenominator, a!.denominator)
      const expected = addFractions(a!, b!)
      assert.ok(fractionsEqual(p.simplifiedAnswer!, expected))
      assert.ok(fractionsEqual(simplify(p.answer as FractionLiteral), expected))
    }
  })
})

describe('fraction-addition-diff-denom', () => {
  it('uses LCM as common denominator and correct sum', () => {
    const problems = generateFractionAdditionDiffDenom(baseParams('add-diff'))
    for (const p of problems) {
      const [a, b] = p.operands
      assert.notEqual(a!.denominator, b!.denominator)
      assert.equal(p.commonDenominator, lcm(a!.denominator, b!.denominator))
      const expected = addFractions(a!, b!)
      assert.ok(fractionsEqual(p.simplifiedAnswer!, expected))
    }
  })
})

describe('fraction-subtraction-same-denom', () => {
  it('result is non-negative and mathematically correct', () => {
    const problems = generateFractionSubtractionSameDenom(baseParams('sub-same'))
    for (const p of problems) {
      const [a, b] = p.operands
      assert.equal(a!.denominator, b!.denominator)
      assert.ok(compareFractions(a!, b!) >= 0)
      const expected = subtractFractions(a!, b!)
      assert.ok(expected.numerator >= 0)
      assert.ok(fractionsEqual(p.simplifiedAnswer!, expected))
    }
  })
})

describe('fraction-subtraction-diff-denom', () => {
  it('uses LCM and correct difference', () => {
    const problems = generateFractionSubtractionDiffDenom(baseParams('sub-diff'))
    for (const p of problems) {
      const [a, b] = p.operands
      assert.notEqual(a!.denominator, b!.denominator)
      assert.equal(p.commonDenominator, lcm(a!.denominator, b!.denominator))
      assert.ok(compareFractions(a!, b!) >= 0)
      const expected = subtractFractions(a!, b!)
      assert.ok(fractionsEqual(p.simplifiedAnswer!, expected))
    }
  })
})

describe('fraction-multiplication', () => {
  it('product equals a.n*b.n / a.d*b.d simplified', () => {
    const problems = generateFractionMultiplication(baseParams('mul'))
    for (const p of problems) {
      const [a, b] = p.operands
      const expected = multiplyFractions(a!, b!)
      assert.ok(fractionsEqual(p.simplifiedAnswer!, expected))
    }
  })
})

describe('fraction-division', () => {
  it('divides by multiplying by reciprocal', () => {
    const problems = generateFractionDivision(baseParams('div'))
    for (const p of problems) {
      const [a, b] = p.operands
      assert.notEqual(b!.numerator, 0)
      const expected = divideFractions(a!, b!)
      assert.ok(fractionsEqual(p.simplifiedAnswer!, expected))
      // صریح: a ÷ b = a × (b.d / b.n)
      const viaReciprocal = multiplyFractions(a!, {
        numerator: b!.denominator,
        denominator: b!.numerator,
      })
      assert.ok(fractionsEqual(expected, viaReciprocal))
    }
  })
})

describe('resolvePracticeStep (backward compatible)', () => {
  it('passes through static practice steps unchanged', () => {
    const staticStep = {
      type: 'practice' as const,
      id: 'practice-1-4',
      title: 'تمرین — یک چهارم',
      visual: {
        type: 'fraction-circle' as const,
        mode: 'interactive' as const,
        params: {
          target: { numerator: 1, denominator: 4 },
          showTarget: true,
        },
      },
      successMessage: 'آفرین!',
    }
    const resolved = resolvePracticeStep(staticStep)
    assert.equal(resolved.length, 1)
    assert.deepEqual(resolved[0], staticStep)
  })

  it('expands generator practice into concrete steps', () => {
    const genStep = {
      type: 'practice' as const,
      id: 'gen-compare',
      title: 'تمرین مقایسه',
      generator: 'fraction-comparison' as const,
      params: {
        denominatorRange: [2, 6] as [number, number],
        count: 3,
        allowImproperFractions: false,
        seed: 'resolve-test',
      },
    }
    const resolved = resolvePracticeStep(genStep)
    assert.equal(resolved.length, 3)
    for (const step of resolved) {
      assert.equal(step.type, 'practice')
      assert.ok(step.visual)
      assert.equal(step.visual.type, 'fraction-circle')
      assert.ok(step.visual.params)
      const params = step.visual.params as {
        compareFractions?: unknown[]
      }
      assert.ok(Array.isArray(params.compareFractions))
      assert.equal(params.compareFractions!.length, 2)
    }
  })
})
