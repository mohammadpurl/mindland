/**
 * تست دستی — نشان می‌دهد generator مقایسه با params مختلف
 * تمرین‌های متنوع و ریاضی‌درست تولید می‌کند.
 *
 * Run: npm run demo:practice-generator
 */
import {
  compareFractions,
  demoFractionComparison,
  generateFractionComparison,
  formatFraction,
} from '../index'

function relationLabel(r: string): string {
  if (r === 'lt') return '<'
  if (r === 'gt') return '>'
  return '='
}

function printBatch(label: string, seed: string, range: [number, number], count: number) {
  console.log('\n════════════════════════════════════════')
  console.log(` ${label}`)
  console.log(` seed=${seed}  denom=[${range[0]},${range[1]}]  count=${count}`)
  console.log('════════════════════════════════════════')

  const problems = generateFractionComparison({
    denominatorRange: range,
    count,
    allowImproperFractions: false,
    seed,
  })

  for (const p of problems) {
    const [a, b] = p.operands
    const cmp = compareFractions(a!, b!)
    const expected = cmp < 0 ? 'lt' : cmp > 0 ? 'gt' : 'eq'
    const ok = p.answer === expected
    const mark = ok ? '✓' : '✗'
    console.log(
      `  ${mark} ${formatFraction(a!)} ${relationLabel(String(p.answer))} ${formatFraction(b!)}` +
        `   → answer=${p.answer}  largerIndex=${p.largerIndex}`
    )
    console.log(`      prompt: ${p.prompt}`)
  }

  // reproducibility check
  const again = generateFractionComparison({
    denominatorRange: range,
    count,
    allowImproperFractions: false,
    seed,
  })
  const same = JSON.stringify(problems) === JSON.stringify(again)
  console.log(`  reproducibility: ${same ? 'OK (same seed → identical)' : 'FAIL'}`)
}

printBatch('Batch A — مخرج‌های کوچک', 'alpha', [2, 4], 4)
printBatch('Batch B — مخرج‌های متوسط', 'beta', [3, 8], 5)
printBatch('Batch C — همان seed آلفا با range متفاوت', 'alpha', [5, 10], 4)

console.log('\n── demoFractionComparison() helper ──')
for (const p of demoFractionComparison('manual-demo', 3)) {
  const [a, b] = p.operands
  console.log(`  ${formatFraction(a!)} vs ${formatFraction(b!)} → ${p.answer}`)
}

console.log('\nDone.\n')
