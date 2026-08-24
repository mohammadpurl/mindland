'use client'

import { useEffect, useState } from 'react'
import type { MathVisualComponentProps, DivisibilityParams } from '@/lib/math-visual-engine/types'

function parseParams(params: MathVisualComponentProps['params']): DivisibilityParams {
  return (params ?? {}) as DivisibilityParams
}

function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)
}

function digitSum(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((sum, d) => sum + Number(d), 0)
}

/** نمایش یک عدد به‌صورت رقم‌های جدا — برای هایلایت رقم آخر یا مجموع رقم‌ها */
function DigitRow({ value, highlightLast }: { value: number; highlightLast?: boolean }) {
  const digits = String(Math.abs(value)).split('')
  return (
    <div className="flex items-center justify-center gap-1.5" dir="ltr">
      {digits.map((d, i) => {
        const isLast = i === digits.length - 1
        return (
          <span
            key={i}
            className={[
              'flex h-12 w-10 items-center justify-center rounded-xl text-2xl font-black transition-colors',
              highlightLast && isLast
                ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200'
                : 'bg-slate-100 text-slate-700',
            ].join(' ')}
          >
            {toFa(d)}
          </span>
        )
      })}
    </div>
  )
}

function NumberFactCard({ number, divisor, highlight }: { number: number; divisor: number; highlight: DivisibilityParams['highlight'] }) {
  const remainder = ((number % divisor) + divisor) % divisor
  const divisible = remainder === 0
  const sum = digitSum(number)

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {highlight === 'digitSum' ? (
        <>
          <DigitRow value={number} />
          <p className="text-lg font-bold text-slate-600">
            مجموع رقم‌ها: {String(number).split('').map(toFa).join(' + ')} = {toFa(sum)}
          </p>
          <p className="text-sm text-slate-500">
            آیا {toFa(sum)} بر {toFa(divisor)} بخش‌پذیر است؟
          </p>
        </>
      ) : highlight === 'lastDigit' ? (
        <>
          <DigitRow value={number} highlightLast />
          <p className="text-sm text-slate-500">رقم یکان را نگاه کن.</p>
        </>
      ) : (
        <p className="text-2xl font-black text-slate-800" dir="ltr">
          {toFa(number)} ÷ {toFa(divisor)} = {toFa(Math.floor(number / divisor))} ، باقی‌مانده = {toFa(remainder)}
        </p>
      )}

      <span
        className={[
          'rounded-full px-4 py-1.5 text-sm font-extrabold',
          divisible ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
        ].join(' ')}
      >
        {toFa(number)} {divisible ? `بر ${toFa(divisor)} بخش‌پذیر است ✅` : `بر ${toFa(divisor)} بخش‌پذیر نیست ❌`}
      </span>
    </div>
  )
}

function CandidatesPractice({
  candidates,
  prompt,
  onSuccess,
  onWrong,
}: {
  candidates: NonNullable<DivisibilityParams['candidates']>
  prompt?: string
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)

  const toggle = (value: number) => {
    if (checked && correct) return
    setChecked(false)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  const check = () => {
    const correctSet = new Set(candidates.filter((c) => c.correct).map((c) => c.value))
    const isMatch =
      selected.size === correctSet.size && [...selected].every((v) => correctSet.has(v))
    setChecked(true)
    setCorrect(isMatch)
    if (isMatch) onSuccess?.()
    else onWrong?.()
  }

  return (
    <div className="flex flex-col items-center gap-4 py-3">
      {prompt ? <p className="text-center text-base font-bold text-slate-700">{prompt}</p> : null}
      <div className="flex flex-wrap items-center justify-center gap-3" dir="ltr">
        {candidates.map((c) => {
          const isSelected = selected.has(c.value)
          const showResult = checked
          const isRight = showResult && c.correct
          const isWrongPick = showResult && isSelected && !c.correct
          const isMissed = showResult && !isSelected && c.correct
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => toggle(c.value)}
              className={[
                'flex h-16 w-20 items-center justify-center rounded-2xl text-xl font-black shadow-sm transition-all',
                isRight
                  ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-200'
                  : isWrongPick
                    ? 'bg-rose-400 text-rose-950 ring-4 ring-rose-200'
                    : isMissed
                      ? 'bg-amber-200 text-amber-900 border-2 border-dashed border-amber-500'
                      : isSelected
                        ? 'bg-sky-400 text-sky-950 ring-4 ring-sky-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              ].join(' ')}
            >
              {toFa(c.value)}
            </button>
          )
        })}
      </div>
      {!checked || !correct ? (
        <button
          type="button"
          onClick={check}
          disabled={selected.size === 0}
          className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-extrabold text-white shadow disabled:opacity-40"
        >
          بررسی کن ✅
        </button>
      ) : (
        <p className="text-sm font-extrabold text-emerald-700">آفرین! درست انتخاب کردی 🎉</p>
      )}
    </div>
  )
}

function ChoicesPractice({
  choices,
  prompt,
  onSuccess,
  onWrong,
}: {
  choices: NonNullable<DivisibilityParams['choices']>
  prompt?: string
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const [pickedIndex, setPickedIndex] = useState<number | null>(null)
  const locked = pickedIndex !== null && choices[pickedIndex]?.correct === true

  const pick = (i: number) => {
    if (locked) return
    setPickedIndex(i)
    if (choices[i]?.correct) onSuccess?.()
    else onWrong?.()
  }

  return (
    <div className="flex flex-col items-center gap-4 py-3">
      {prompt ? <p className="text-center text-base font-bold text-slate-700">{prompt}</p> : null}
      <div className="flex w-full max-w-md flex-col gap-2.5">
        {choices.map((c, i) => {
          const isPicked = pickedIndex === i
          const showResult = isPicked
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className={[
                'rounded-xl border-2 px-4 py-3 text-right text-sm font-bold transition-colors',
                showResult && c.correct
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : showResult && !c.correct
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300',
              ].join(' ')}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DivisibilityLabBoard({ mode, params: rawParams, onSuccess, onWrong }: MathVisualComponentProps) {
  const params = parseParams(rawParams)
  const heading = params.title ?? 'آزمایشگاه بخش‌پذیری'
  const isInteractive = mode === 'interactive'

  const [resetKey, setResetKey] = useState(0)
  useEffect(() => {
    setResetKey((k) => k + 1)
  }, [params.candidates, params.choices, params.number, params.divisor])

  return (
    <div
      className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-[#FFFEF7] p-5 shadow-inner"
      dir="rtl"
    >
      <p className="mb-3 text-center text-sm font-extrabold text-slate-500">{heading}</p>

      {isInteractive && params.candidates ? (
        <CandidatesPractice
          key={`c-${resetKey}`}
          candidates={params.candidates}
          prompt={params.prompt}
          onSuccess={onSuccess}
          onWrong={onWrong}
        />
      ) : isInteractive && params.choices ? (
        <ChoicesPractice
          key={`q-${resetKey}`}
          choices={params.choices}
          prompt={params.prompt}
          onSuccess={onSuccess}
          onWrong={onWrong}
        />
      ) : params.number !== undefined && params.divisor !== undefined ? (
        <NumberFactCard number={params.number} divisor={params.divisor} highlight={params.highlight} />
      ) : (
        <p className="py-8 text-center text-sm text-slate-400">پارامتر نامعتبر برای آزمایشگاه بخش‌پذیری</p>
      )}
    </div>
  )
}

/** DivisibilityLab — کشف قانون‌های بخش‌پذیری با باقی‌مانده، رقم یکان و مجموع رقم‌ها */
export function DivisibilityLab(props: MathVisualComponentProps) {
  return <DivisibilityLabBoard {...props} />
}
