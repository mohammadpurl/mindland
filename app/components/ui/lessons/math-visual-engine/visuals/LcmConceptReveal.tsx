'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = y
    y = x % y
    x = t
  }
  return x || 1
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

function multiplesOf(n: number, until: number): number[] {
  const out: number[] = []
  for (let k = 1; k * n <= until; k++) out.push(k * n)
  return out
}

function ease(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export interface LcmConceptRevealProps {
  a: number
  b: number
  width?: number
  height?: number
  title?: string
  animate?: boolean
  replayKey?: number
}

/**
 * آموزش مفهوم ک.م.م:
 * مضرب‌های هر عدد → مضرب‌های مشترک → کوچک‌ترین = ک.م.م → مخرج مشترک
 */
export function LcmConceptReveal({
  a,
  b,
  title = 'مفهوم ک.م.م',
  animate = true,
  replayKey = 0,
}: LcmConceptRevealProps) {
  const common = useMemo(() => lcm(a, b), [a, b])
  const until = Math.max(common * 2, a * 5, b * 5, 24)
  const multA = useMemo(() => multiplesOf(a, until), [a, until])
  const multB = useMemo(() => multiplesOf(b, until), [b, until])
  const shared = useMemo(
    () => multA.filter((n) => multB.includes(n)),
    [multA, multB]
  )

  const [t, setT] = useState(animate ? 0 : 1)

  useEffect(() => {
    if (!animate) {
      setT(1)
      return
    }
    setT(0)
    const t0 = performance.now()
    const duration = 9000
    let raf = 0
    let alive = true
    const tick = (now: number) => {
      if (!alive) return
      const p = Math.min(1, (now - t0) / duration)
      setT(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [animate, a, b, replayKey])

  const pWhy = ease(Math.min(1, t / 0.14))
  const pA = ease(Math.min(1, Math.max(0, (t - 0.14) / 0.18)))
  const pB = ease(Math.min(1, Math.max(0, (t - 0.32) / 0.18)))
  const pShared = ease(Math.min(1, Math.max(0, (t - 0.5) / 0.2)))
  const pPick = ease(Math.min(1, Math.max(0, (t - 0.7) / 0.18)))
  const pMeaning = ease(Math.min(1, Math.max(0, (t - 0.88) / 0.12)))

  const status =
    pMeaning > 0.4
      ? `پس مخرج مشترک کسرها می‌شود ${common}`
      : pPick > 0.4
        ? `کوچک‌ترین مضرب مشترک = ک.م.م = ${common}`
        : pShared > 0.4
          ? `مضرب‌های مشترک: ${shared.slice(0, 4).join(' ، ')}${shared.length > 4 ? ' ، …' : ''}`
          : pB > 0.4
            ? `مضرب‌های ${b}: ${multB.slice(0, 6).join(' ، ')}…`
            : pA > 0.4
              ? `مضرب‌های ${a}: ${multA.slice(0, 6).join(' ، ')}…`
              : 'برای جمع کسرها، قطعه‌ها باید هم‌اندازه باشند → مخرج یکسان'

  const chip = (n: number, tone: 'a' | 'b' | 'shared' | 'lcm', visible: number) => {
    const isLcm = tone === 'lcm'
    const isShared = tone === 'shared' || isLcm
    let cls =
      'inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-2 text-sm font-bold border-2 transition '
    if (isLcm) cls += 'border-emerald-500 bg-emerald-50 text-emerald-800 scale-110 shadow-sm'
    else if (isShared) cls += 'border-sky-400 bg-sky-50 text-sky-800'
    else if (tone === 'a') cls += 'border-amber-300 bg-amber-50 text-amber-900'
    else cls += 'border-teal-300 bg-teal-50 text-teal-900'

    return (
      <span
        key={`${tone}-${n}`}
        className={cls}
        style={{ opacity: visible, transform: `scale(${0.92 + 0.08 * visible})` }}
      >
        {n}
      </span>
    )
  }

  return (
    <div className="space-y-3" dir="rtl">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="border-b border-slate-100 px-4 py-2 text-center text-sm font-bold text-slate-700">
          {title}
        </div>

        <div className="space-y-4 p-4 sm:p-5">
          <p
            className="text-center text-sm font-bold text-slate-700"
            style={{ opacity: Math.max(0.35, pWhy) }}
          >
            ک.م.م یعنی <span className="text-sky-700">کوچک‌ترین مضرب مشترک</span> دو عدد —
            نه فقط «یک عدد جادویی».
          </p>

          <div className="space-y-2" style={{ opacity: Math.max(0.2, pA) }}>
            <p className="text-xs font-bold text-amber-800">۱) مضرب‌های {a} را می‌نویسیم</p>
            <div className="flex flex-wrap justify-center gap-2">
              {multA.slice(0, 8).map((n, i) => {
                const show = Math.min(1, Math.max(0, (pA - i * 0.08) / 0.2))
                const sharedTone = shared.includes(n)
                return chip(n, sharedTone && pShared > 0.3 ? (n === common && pPick > 0.3 ? 'lcm' : 'shared') : 'a', show)
              })}
            </div>
          </div>

          <div className="space-y-2" style={{ opacity: Math.max(0.2, pB) }}>
            <p className="text-xs font-bold text-teal-800">۲) مضرب‌های {b} را می‌نویسیم</p>
            <div className="flex flex-wrap justify-center gap-2">
              {multB.slice(0, 8).map((n, i) => {
                const show = Math.min(1, Math.max(0, (pB - i * 0.08) / 0.2))
                const sharedTone = shared.includes(n)
                return chip(n, sharedTone && pShared > 0.3 ? (n === common && pPick > 0.3 ? 'lcm' : 'shared') : 'b', show)
              })}
            </div>
          </div>

          <div
            className="rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-3 text-center"
            style={{ opacity: Math.max(0.15, pShared) }}
          >
            <p className="text-xs font-bold text-sky-800">۳) عددهایی که در هر دو لیست هستند = مضرب مشترک</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {shared.slice(0, 5).map((n) =>
                chip(n, n === common && pPick > 0.35 ? 'lcm' : 'shared', pShared)
              )}
            </div>
          </div>

          <div
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-center"
            style={{ opacity: Math.max(0.1, pPick) }}
          >
            <p className="text-sm font-bold text-emerald-800">
              ۴) کوچک‌ترین آن‌ها = ک.م.م({a} ، {b}) = {common}
            </p>
            <p
              className="mt-1 text-xs font-semibold text-emerald-700"
              style={{ opacity: pMeaning }}
            >
              همین عدد مخرج مشترک کسرها می‌شود تا قطعه‌ها هم‌اندازه شوند.
            </p>
          </div>

          <p className="text-center text-sm font-bold text-slate-800">{status}</p>
        </div>
      </div>
    </div>
  )
}

export interface ProcessQuizStep {
  prompt: string
  options: string[]
  answerIndex: number
  hint?: string
}

function makeChoices(correct: string, distractors: string[]): { options: string[]; answerIndex: number } {
  const uniq = [correct, ...distractors].filter((v, i, a) => v.length > 0 && a.indexOf(v) === i)
  const options = uniq.slice(0, 4)
  const seed = correct.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), options.length)
  const answerIndex = seed % options.length
  const rest = options.filter((o) => o !== correct)
  const placed = [...rest]
  placed.splice(answerIndex, 0, correct)
  return { options: placed.slice(0, 4), answerIndex: Math.min(answerIndex, placed.length - 1) }
}

/** پرسش‌های مفهومی ک.م.م (قبل از تبدیل کسر) */
export function buildLcmConceptQuizSteps(a: number, b: number): ProcessQuizStep[] {
  const common = lcm(a, b)
  const until = Math.max(common * 2, a * 4, b * 4)
  const shared = multiplesOf(a, until).filter((n) => multiplesOf(b, until).includes(n))
  const sharedList = shared.slice(0, 3).join(' و ')
  const product = a * b
  const sum = a + b
  const bigger = Math.max(a, b)

  const meaning = makeChoices('کوچک‌ترین مضرب مشترک دو عدد', [
    'بزرگ‌ترین مقسوم‌علیه مشترک دو عدد',
    'جمع دو عدد',
    'حاصل‌ضرب صورت‌ها',
  ])

  const why = makeChoices('تا قطعه‌های کسر هم‌اندازه شوند و بتوان جمع/تفریق کرد', [
    'تا صورت کسرها همیشه ۱ بماند',
    'تا مخرج‌ها بزرگ‌تر از صورت شوند',
    'فقط برای قشنگ‌تر شدن شکل',
  ])

  const sharedQ = makeChoices(sharedList || String(common), [
    `${a} و ${b}`,
    `${sum}`,
    `${bigger} و ${product}`,
  ])

  const lcmQ = makeChoices(String(common), [String(product), String(sum), String(bigger), String(common + a)])

  return [
    {
      prompt: 'ک.م.م دو عدد یعنی چه؟',
      options: meaning.options,
      answerIndex: meaning.answerIndex,
      hint: 'مضرب‌های هر عدد را بنویس؛ مشترک‌ها را پیدا کن؛ کوچک‌ترین را بردار.',
    },
    {
      prompt: 'چرا برای جمع کسرها ک.م.م مخرج‌ها را می‌گیریم؟',
      options: why.options,
      answerIndex: why.answerIndex,
      hint: 'جمع وقتی معنی دارد که برش‌ها هم‌اندازه باشند.',
    },
    {
      prompt: `مضرب‌های مشترک ${a} و ${b} کدام‌اند؟ (چند تای اول)`,
      options: sharedQ.options,
      answerIndex: sharedQ.answerIndex,
      hint: `لیست مضرب‌های ${a} و ${b} را کنار هم بگذار و عددهای مشترک را پیدا کن.`,
    },
    {
      prompt: `پس ک.م.م(${a} ، ${b}) چند است؟`,
      options: lcmQ.options,
      answerIndex: lcmQ.answerIndex,
      hint: 'از بین مضرب‌های مشترک، کوچک‌ترین را انتخاب کن.',
    },
  ]
}

export interface LcmConceptViewProps {
  mode: 'demo' | 'static' | 'interactive'
  a: number
  b: number
  width?: number
  height?: number
  title?: string
  animate?: boolean
  onSpeak?: (text: string) => void
  setAnimation?: (name: string) => void
  onSuccess?: () => void
  onWrong?: () => void
}

export function LcmConceptView({
  mode,
  a,
  b,
  title,
  animate = true,
  onSpeak,
  setAnimation,
  onSuccess,
  onWrong,
}: LcmConceptViewProps) {
  const [replayKey, setReplayKey] = useState(0)
  const steps = useMemo(() => buildLcmConceptQuizSteps(a, b), [a, b])
  const [stepIndex, setStepIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const successFired = useRef(false)

  useEffect(() => {
    setStepIndex(0)
    setChoice(null)
    setLocked(false)
    successFired.current = false
    setReplayKey(0)
  }, [a, b, title])

  const step = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1

  const handlePick = (index: number) => {
    if (!step || locked) return
    setChoice(index)
    if (index === step.answerIndex) {
      setLocked(true)
      onSpeak?.(stepIndex === steps.length - 1 ? `آفرین! ک.م.م = ${lcm(a, b)}` : 'درست بود! برو مرحله بعد.')
      setAnimation?.('ThumbsUp')
      window.setTimeout(() => {
        if (isLast) {
          if (!successFired.current) {
            successFired.current = true
            onSuccess?.()
          }
        } else {
          setStepIndex((i) => i + 1)
          setChoice(null)
          setLocked(false)
        }
      }, 700)
    } else {
      onWrong?.()
      onSpeak?.(step.hint ?? 'دوباره به مضرب‌ها نگاه کن.')
      setAnimation?.('Thinking')
      window.setTimeout(() => setChoice(null), 700)
    }
  }

  return (
    <div className="space-y-3" dir="rtl">
      <LcmConceptReveal
        a={a}
        b={b}
        title={title ?? 'مفهوم ک.م.م'}
        animate={mode !== 'static' && animate}
        replayKey={replayKey}
      />

      <div className="flex justify-center">
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition"
          onClick={() => setReplayKey((k) => k + 1)}
        >
          پخش دوبارهٔ مفهوم ک.م.م
        </button>
      </div>

      {mode === 'interactive' && step ? (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-center text-xs font-bold text-sky-700">
            مرحله {stepIndex + 1} از {steps.length} — مفهوم ک.م.م
          </p>
          <p className="text-center text-sm font-bold text-slate-700">{step.prompt}</p>
          <div className="flex flex-col gap-2">
            {step.options.map((opt, index) => {
              const selected = choice === index
              const correct = locked && index === step.answerIndex
              let cls =
                'w-full rounded-2xl px-4 py-3 text-sm font-bold border-2 text-right transition disabled:opacity-50 '
              if (correct) cls += 'border-emerald-500 bg-emerald-50 text-emerald-800'
              else if (selected && !locked) cls += 'border-rose-400 bg-rose-50 text-rose-800'
              else cls += 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'

              return (
                <button
                  key={`${stepIndex}-${opt}`}
                  type="button"
                  disabled={locked}
                  className={cls}
                  onClick={() => handlePick(index)}
                >
                  {opt}
                </button>
              )
            })}
          </div>
          {step.hint ? <p className="text-center text-xs text-slate-400">{step.hint}</p> : null}
        </div>
      ) : null}
    </div>
  )
}
