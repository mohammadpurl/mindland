'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Circle, Group, Layer, Text, Wedge } from 'react-konva'
import { FRACTION_COLORS, sliceAngle, sliceRotation } from '@/lib/math-visual-engine/konva-utils'
import { KonvaWhiteboard } from '../shared/KonvaWhiteboard'

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

function ease(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function MiniPie({
  cx,
  cy,
  r,
  denominator,
  filled,
  fillColor,
  strokeColor,
  label,
  opacity = 1,
}: {
  cx: number
  cy: number
  r: number
  denominator: number
  filled: number
  fillColor: string
  strokeColor: string
  label?: string
  opacity?: number
}) {
  return (
    <Group x={cx} y={cy} opacity={opacity}>
      <Circle radius={r + 3} fill="#FEF3C7" stroke={strokeColor} strokeWidth={2} />
      {Array.from({ length: denominator }).map((_, i) => {
        const selected = i < filled
        return (
          <Wedge
            key={i}
            radius={r}
            angle={sliceAngle(denominator)}
            rotation={sliceRotation(i, denominator)}
            fill={selected ? fillColor : FRACTION_COLORS.empty}
            stroke={selected ? strokeColor : FRACTION_COLORS.emptyStroke}
            strokeWidth={1.5}
          />
        )
      })}
      <Circle radius={5} fill={strokeColor} />
      {label ? (
        <Text
          x={-r}
          y={r + 8}
          width={r * 2}
          text={label}
          fontSize={13}
          fill="#334155"
          fontStyle="bold"
          align="center"
        />
      ) : null}
    </Group>
  )
}

export interface CommonDenomRevealProps {
  width?: number
  height?: number
  title?: string
  left: { numerator: number; denominator: number }
  right: { numerator: number; denominator: number }
  operation?: '+' | '−'
  animate?: boolean
  replayKey?: number
}

/**
 * انیمیشن فرآیند ک.م.م:
 * دو کسر → پیدا کردن مخرج مشترک → تبدیل صورت‌ها → جمع/تفریق
 */
export function CommonDenomReveal({
  width = 600,
  height = 420,
  title = 'مخرج مشترک',
  left,
  right,
  operation = '+',
  animate = true,
  replayKey = 0,
}: CommonDenomRevealProps) {
  const common = useMemo(() => lcm(left.denominator, right.denominator), [left.denominator, right.denominator])
  const leftConv = useMemo(
    () => ({
      numerator: (left.numerator * common) / left.denominator,
      denominator: common,
    }),
    [left, common]
  )
  const rightConv = useMemo(
    () => ({
      numerator: (right.numerator * common) / right.denominator,
      denominator: common,
    }),
    [right, common]
  )
  const resultNum =
    operation === '−' ? leftConv.numerator - rightConv.numerator : leftConv.numerator + rightConv.numerator

  const [t, setT] = useState(animate ? 0 : 1)

  useEffect(() => {
    if (!animate) {
      setT(1)
      return
    }
    setT(0)
    const t0 = performance.now()
    const duration = 7000
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
  }, [animate, left.numerator, left.denominator, right.numerator, right.denominator, replayKey])

  // فازها
  const pShow = Math.min(1, t / 0.12)
  const pLcm = ease(Math.min(1, Math.max(0, (t - 0.12) / 0.14)))
  const pLeftConv = ease(Math.min(1, Math.max(0, (t - 0.28) / 0.18)))
  const pRightConv = ease(Math.min(1, Math.max(0, (t - 0.48) / 0.18)))
  const pCombine = ease(Math.min(1, Math.max(0, (t - 0.68) / 0.28)))

  const leftShowOrig = 1 - pLeftConv
  const leftShowConv = pLeftConv
  const rightShowOrig = 1 - pRightConv
  const rightShowConv = pRightConv

  const statusText =
    pCombine > 0.55
      ? `${leftConv.numerator}/${common} ${operation} ${rightConv.numerator}/${common} = ${resultNum}/${common}`
      : pRightConv > 0.6
        ? `${right.numerator}/${right.denominator} = ${rightConv.numerator}/${common}`
        : pLeftConv > 0.6
          ? `${left.numerator}/${left.denominator} = ${leftConv.numerator}/${common}`
          : pLcm > 0.5
            ? `ک.م.م(${left.denominator} و ${right.denominator}) = ${common}`
            : `${left.numerator}/${left.denominator} ${operation} ${right.numerator}/${right.denominator}`

  return (
    <div className="space-y-2" dir="rtl">
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          {/* کسر چپ — اصلی */}
          <MiniPie
            cx={110}
            cy={130}
            r={58}
            denominator={left.denominator}
            filled={left.numerator}
            fillColor={FRACTION_COLORS.compareA}
            strokeColor={FRACTION_COLORS.compareA}
            label={`${left.numerator}/${left.denominator}`}
            opacity={pShow * leftShowOrig}
          />
          {/* کسر چپ — تبدیل‌شده */}
          <MiniPie
            cx={110}
            cy={130}
            r={58}
            denominator={common}
            filled={leftConv.numerator}
            fillColor={FRACTION_COLORS.compareA}
            strokeColor={FRACTION_COLORS.compareA}
            label={`${left.numerator}/${left.denominator} = ${leftConv.numerator}/${common}`}
            opacity={pShow * leftShowConv}
          />

          <Text
            x={85}
            y={220}
            width={50}
            text={operation}
            fontSize={28}
            fill="#64748b"
            fontStyle="bold"
            align="center"
            opacity={pShow}
          />

          {/* کسر راست — اصلی */}
          <MiniPie
            cx={110}
            cy={300}
            r={58}
            denominator={right.denominator}
            filled={right.numerator}
            fillColor={FRACTION_COLORS.compareB}
            strokeColor={FRACTION_COLORS.compareB}
            label={`${right.numerator}/${right.denominator}`}
            opacity={pShow * rightShowOrig}
          />
          {/* کسر راست — تبدیل‌شده */}
          <MiniPie
            cx={110}
            cy={300}
            r={58}
            denominator={common}
            filled={rightConv.numerator}
            fillColor={FRACTION_COLORS.compareB}
            strokeColor={FRACTION_COLORS.compareB}
            label={`${right.numerator}/${right.denominator} = ${rightConv.numerator}/${common}`}
            opacity={pShow * rightShowConv}
          />

          <Text x={185} y={200} text="=" fontSize={28} fill="#94a3b8" fontStyle="bold" opacity={pShow} />

          {/* باکس ک.م.م */}
          <Group opacity={pLcm}>
            <Text
              x={220}
              y={24}
              width={340}
              text={`ک.م.م مخرج‌ها = ${common}`}
              fontSize={18}
              fill="#0EA5E9"
              fontStyle="bold"
              align="center"
            />
            <Text
              x={220}
              y={50}
              width={340}
              text={`صورت‌ها هم به همان نسبت بزرگ می‌شوند`}
              fontSize={12}
              fill="#64748b"
              align="center"
            />
          </Group>

          {/* دایره حاصل */}
          <Group opacity={Math.max(0.25, pCombine)}>
            <MiniPie
              cx={400}
              cy={210}
              r={88}
              denominator={common}
              filled={Math.max(0, Math.round(resultNum * Math.min(1, pCombine * 1.2)))}
              fillColor={FRACTION_COLORS.selected}
              strokeColor={FRACTION_COLORS.selectedStroke}
              label={pCombine > 0.7 ? `${resultNum}/${common}` : '؟'}
            />
          </Group>

          {/* توضیح مراحل پایین */}
          <Text
            x={40}
            y={height - 42}
            width={width - 80}
            text={statusText}
            fontSize={15}
            fill="#0F172A"
            fontStyle="bold"
            align="center"
          />
        </Layer>
      </KonvaWhiteboard>
    </div>
  )
}

export interface ProcessQuizStep {
  prompt: string
  options: string[]
  answerIndex: number
  hint?: string
}

/** ساخت گزینه‌ها با جای درست تصادفیِ پایدار */
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

/** ساخت گام‌های پرسش — کاربرد ک.م.م در جمع/تفریق (مفهوم در درس جداگانه است) */
export function buildCommonDenomQuizSteps(
  left: { numerator: number; denominator: number },
  right: { numerator: number; denominator: number },
  operation: '+' | '−' = '+'
): ProcessQuizStep[] {
  const common = lcm(left.denominator, right.denominator)
  const leftN = (left.numerator * common) / left.denominator
  const rightN = (right.numerator * common) / right.denominator
  const result = operation === '−' ? leftN - rightN : leftN + rightN
  const leftFactor = common / left.denominator
  const rightFactor = common / right.denominator

  const wrongLcms = [
    left.denominator * right.denominator,
    left.denominator + right.denominator,
    common + 2,
    Math.max(left.denominator, right.denominator),
  ]
  const lcmQ = makeChoices(String(common), wrongLcms.map(String))
  const leftQ = makeChoices(`${leftN}/${common}`, [
    `${left.numerator}/${common}`,
    `${left.numerator * 2}/${common}`,
    `${common}/${left.denominator}`,
    `${left.numerator * leftFactor}/${left.denominator}`,
  ])
  const rightQ = makeChoices(`${rightN}/${common}`, [
    `${right.numerator}/${common}`,
    `${right.numerator + 1}/${common}`,
    `${common}/${right.denominator}`,
    `${right.numerator * rightFactor}/${right.denominator}`,
  ])
  const sumQ = makeChoices(`${result}/${common}`, [
    `${leftN + rightN + 1}/${common}`,
    `${Math.abs(leftN - rightN)}/${common + 1}`,
    `${result}/${left.denominator}`,
    `${leftN + rightN}/${left.denominator + right.denominator}`,
  ])

  return [
    {
      prompt: `با روش مضرب‌ها، ک.م.م(${left.denominator} ، ${right.denominator}) چند است؟`,
      options: lcmQ.options,
      answerIndex: lcmQ.answerIndex,
      hint: 'مضرب‌های هر مخرج را بنویس؛ کوچک‌ترین مشترک را بردار.',
    },
    {
      prompt: `${left.numerator}/${left.denominator} با مخرج ${common} چه می‌شود؟`,
      options: leftQ.options,
      answerIndex: leftQ.answerIndex,
      hint: `صورت و مخرج را در ${leftFactor} ضرب کن.`,
    },
    {
      prompt: `${right.numerator}/${right.denominator} با مخرج ${common} چه می‌شود؟`,
      options: rightQ.options,
      answerIndex: rightQ.answerIndex,
      hint: `صورت و مخرج را در ${rightFactor} ضرب کن.`,
    },
    {
      prompt: `حاصل ${leftN}/${common} ${operation} ${rightN}/${common} چیست؟`,
      options: sumQ.options,
      answerIndex: sumQ.answerIndex,
      hint: operation === '+' ? 'صورت‌ها را جمع کن؛ مخرج همان بماند.' : 'صورت‌ها را تفریق کن؛ مخرج همان بماند.',
    },
  ]
}

export interface CommonDenomProcessViewProps {
  mode: 'demo' | 'static' | 'interactive'
  width?: number
  height?: number
  title?: string
  left: { numerator: number; denominator: number; label?: string }
  right: { numerator: number; denominator: number; label?: string }
  operation?: '+' | '−'
  animate?: boolean
  onSpeak?: (text: string) => void
  setAnimation?: (name: string) => void
  onSuccess?: () => void
  onWrong?: () => void
}

/**
 * تمرین کاربرد ک.م.م در جمع/تفریق کسر
 * (آموزش مفهوم ک.م.م در درس جداگانه fraction-06-lcm-concept است)
 */
export function CommonDenomProcessView({
  mode,
  width = 600,
  height = 420,
  title,
  left,
  right,
  operation = '+',
  animate = true,
  onSpeak,
  setAnimation,
  onSuccess,
  onWrong,
}: CommonDenomProcessViewProps) {
  const [replayKey, setReplayKey] = useState(0)
  const steps = useMemo(
    () => buildCommonDenomQuizSteps(left, right, operation),
    [left.numerator, left.denominator, right.numerator, right.denominator, operation]
  )
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
  }, [left.numerator, left.denominator, right.numerator, right.denominator, operation, title])

  const step = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1

  const handlePick = (index: number) => {
    if (!step || locked) return
    setChoice(index)
    if (index === step.answerIndex) {
      setLocked(true)
      onSpeak?.(
        stepIndex === 0
          ? `درست! ک.م.م = ${step.options[step.answerIndex]}`
          : 'آفرین، درست بود!'
      )
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
      onSpeak?.(step.hint ?? 'دوباره فکر کن — به مخرج مشترک دقت کن.')
      setAnimation?.('Thinking')
      window.setTimeout(() => setChoice(null), 700)
    }
  }

  return (
    <div className="space-y-3" dir="rtl">
      <CommonDenomReveal
        width={width}
        height={height}
        title={title ?? 'تبدیل با مخرج مشترک'}
        left={left}
        right={right}
        operation={operation}
        animate={mode !== 'static' && animate}
        replayKey={replayKey}
      />

      <div className="flex justify-center">
        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition"
          onClick={() => setReplayKey((k) => k + 1)}
        >
          پخش دوبارهٔ انیمیشن
        </button>
      </div>

      {mode === 'interactive' && step ? (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-center text-xs font-bold text-sky-700">
            مرحله {stepIndex + 1} از {steps.length} — تبدیل و حاصل
          </p>
          <p className="text-center text-sm font-bold text-slate-700">{step.prompt}</p>
          <div
            className={`flex ${step.options.some((o) => o.length > 12) ? 'flex-col' : 'flex-wrap'} items-stretch justify-center gap-2`}
          >
            {step.options.map((opt, index) => {
              const selected = choice === index
              const correct = locked && index === step.answerIndex
              const long = opt.length > 12
              let cls = `${long ? 'w-full text-right' : 'min-w-[6.5rem]'} rounded-2xl px-4 py-3 text-sm font-bold border-2 transition disabled:opacity-50 `
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
