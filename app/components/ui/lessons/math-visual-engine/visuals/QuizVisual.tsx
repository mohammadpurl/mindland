'use client'

import { useEffect, useState } from 'react'
import type { MathVisualComponentProps, QuizParams } from '@/lib/math-visual-engine/types'

function parseParams(params: MathVisualComponentProps['params']): QuizParams {
  return (params ?? {}) as QuizParams
}

function SingleChoice({
  choices,
  onSuccess,
  onWrong,
}: {
  choices: NonNullable<QuizParams['choices']>
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
    <div className="flex w-full max-w-md flex-col gap-2.5">
      {choices.map((c, i) => {
        const isPicked = pickedIndex === i
        return (
          <button
            key={i}
            type="button"
            onClick={() => pick(i)}
            className={[
              'rounded-xl border-2 px-4 py-3 text-right text-sm font-bold transition-colors',
              isPicked && c.correct
                ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                : isPicked && !c.correct
                  ? 'border-rose-300 bg-rose-50 text-rose-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300',
            ].join(' ')}
          >
            {c.label}
            {isPicked && c.note ? <span className="mt-1 block text-xs font-normal opacity-80">{c.note}</span> : null}
          </button>
        )
      })}
    </div>
  )
}

function MultiChoice({
  choices,
  onSuccess,
  onWrong,
}: {
  choices: NonNullable<QuizParams['choices']>
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)

  const toggle = (i: number) => {
    if (checked && correct) return
    setChecked(false)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const check = () => {
    const correctSet = new Set(choices.map((c, i) => (c.correct ? i : -1)).filter((i) => i >= 0))
    const isMatch = selected.size === correctSet.size && [...selected].every((i) => correctSet.has(i))
    setChecked(true)
    setCorrect(isMatch)
    if (isMatch) onSuccess?.()
    else onWrong?.()
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-col gap-2.5">
        {choices.map((c, i) => {
          const isSelected = selected.has(i)
          const showResult = checked
          const isRight = showResult && c.correct
          const isWrongPick = showResult && isSelected && !c.correct
          const isMissed = showResult && !isSelected && c.correct
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={[
                'rounded-xl border-2 px-4 py-3 text-right text-sm font-bold transition-colors',
                isRight
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                  : isWrongPick
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : isMissed
                      ? 'border-dashed border-amber-500 bg-amber-50 text-amber-800'
                      : isSelected
                        ? 'border-sky-400 bg-sky-50 text-sky-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300',
              ].join(' ')}
            >
              {c.label}
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

function QuizBoard({ params: rawParams, onSuccess, onWrong }: MathVisualComponentProps) {
  const params = parseParams(rawParams)
  const heading = params.title ?? 'کوییز'

  const [resetKey, setResetKey] = useState(0)
  useEffect(() => {
    setResetKey((k) => k + 1)
  }, [params.choices])

  return (
    <div
      className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-[#FFFEF7] p-5 shadow-inner"
      dir="rtl"
    >
      <p className="text-center text-sm font-extrabold text-slate-500">{heading}</p>
      {params.prompt ? <p className="text-center text-base font-bold text-slate-700">{params.prompt}</p> : null}
      {params.choices && params.choices.length > 0 ? (
        params.multiSelect ? (
          <MultiChoice key={`m-${resetKey}`} choices={params.choices} onSuccess={onSuccess} onWrong={onWrong} />
        ) : (
          <SingleChoice key={`s-${resetKey}`} choices={params.choices} onSuccess={onSuccess} onWrong={onWrong} />
        )
      ) : null}
    </div>
  )
}

/** QuizVisual — کارت چندگزینه‌ای عمومی (تک‌انتخابی یا چندانتخابی) برای هر سؤالی که کارت/دایره/محور مناسب آن نیست */
export function QuizVisual(props: MathVisualComponentProps) {
  return <QuizBoard {...props} />
}
