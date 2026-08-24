'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import KonvaLib from 'konva'
import { Arrow, Circle, Group, Layer, Line, Text } from 'react-konva'
import type {
  MathVisualComponentProps,
  NumberLineParams,
  NumberLinePoint,
} from '@/lib/math-visual-engine/types'
import { NUMBER_LINE_COLORS } from '@/lib/math-visual-engine/konva-utils'
import { useLivelyKonva } from '../hooks/useLivelyKonva'
import { KonvaWhiteboard } from '../shared/KonvaWhiteboard'
import { LivelyFace, type FaceMood } from '../shared/LivelyFace'

const DEFAULT_W = 640
const DEFAULT_H = 260
const PADDING = 46

function parseParams(params: MathVisualComponentProps['params']): NumberLineParams {
  return (params ?? {}) as NumberLineParams
}

/** بازهٔ نمایش خط را از پارامترها استنتاج می‌کند اگر min/max ندهند */
function inferRange(params: NumberLineParams): { min: number; max: number } {
  if (params.min !== undefined && params.max !== undefined) {
    return { min: params.min, max: params.max }
  }
  const values: number[] = []
  params.points?.forEach((p) => values.push(p.value))
  if (params.jump) values.push(params.jump.from, params.jump.to)
  if (params.target !== undefined) values.push(params.target)
  if (params.startValue !== undefined) values.push(params.startValue)
  if (params.compareValues) values.push(...params.compareValues)
  if (values.length === 0) return { min: -5, max: 5 }
  const lo = Math.min(0, ...values)
  const hi = Math.max(0, ...values)
  const pad = Math.max(1, Math.ceil((hi - lo) * 0.15))
  const min = Math.floor(lo - pad)
  const max = Math.ceil(hi + pad)
  return max - min < 6 ? { min: min - 1, max: max + 1 } : { min, max }
}

function AxisAndTicks({
  min,
  max,
  valueToX,
  axisY,
  width,
}: {
  min: number
  max: number
  valueToX: (v: number) => number
  axisY: number
  width: number
}) {
  const ticks = useMemo(() => {
    const arr: number[] = []
    for (let v = min; v <= max; v += 1) arr.push(v)
    return arr
  }, [min, max])

  return (
    <Group>
      <Line
        points={[PADDING - 10, axisY, width - PADDING + 10, axisY]}
        stroke={NUMBER_LINE_COLORS.axis}
        strokeWidth={2.5}
        lineCap="round"
      />
      {ticks.map((v) => {
        const x = valueToX(v)
        const isZero = v === 0
        return (
          <Group key={v}>
            <Line
              points={[x, axisY - (isZero ? 12 : 8), x, axisY + (isZero ? 12 : 8)]}
              stroke={isZero ? NUMBER_LINE_COLORS.zeroTick : NUMBER_LINE_COLORS.tick}
              strokeWidth={isZero ? 2.5 : 1.5}
            />
            <Text
              x={x - 14}
              y={axisY + 14}
              width={28}
              text={String(v)}
              fontSize={13}
              fontStyle={isZero ? 'bold' : 'normal'}
              fill={
                isZero
                  ? NUMBER_LINE_COLORS.zeroTick
                  : v < 0
                    ? NUMBER_LINE_COLORS.negative
                    : NUMBER_LINE_COLORS.positive
              }
              align="center"
            />
          </Group>
        )
      })}
    </Group>
  )
}

/** نشانگر ثابت (غیرقابل‌درگ) روی خط — برای نمایش نقطه یا شروع تمرین */
function StaticToken({
  x,
  y,
  color,
  label,
  mood = 'neutral',
  showFace = true,
}: {
  x: number
  y: number
  color: string
  label?: string
  mood?: FaceMood
  showFace?: boolean
}) {
  const { breathScale, blink, eyeOffset } = useLivelyKonva()
  return (
    <Group x={x} y={y} scaleX={breathScale} scaleY={breathScale}>
      <Circle radius={16} fill={color} stroke="#1e293b" strokeWidth={1.5} shadowBlur={5} shadowColor="rgba(0,0,0,0.15)" />
      {showFace ? <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} /> : null}
      {label ? (
        <Text x={-30} y={-42} width={60} text={label} fontSize={12} fill="#334155" fontStyle="bold" align="center" />
      ) : null}
    </Group>
  )
}

/** نشانگر قابل‌درگ برای تمرین جای‌گذاری روی خط */
function DraggableToken({
  startX,
  axisY,
  minX,
  maxX,
  mood,
  onDragEnd,
  disabled,
}: {
  startX: number
  axisY: number
  minX: number
  maxX: number
  mood: FaceMood
  onDragEnd: (x: number) => void
  disabled?: boolean
}) {
  const groupRef = useRef<Konva.Group>(null)
  const { breathScale, blink, eyeOffset } = useLivelyKonva()

  useEffect(() => {
    const node = groupRef.current
    if (!node) return
    node.to({ x: startX, y: axisY, duration: 0.2, easing: KonvaLib.Easings.EaseOut })
  }, [startX, axisY])

  return (
    <Group
      ref={groupRef}
      x={startX}
      y={axisY}
      draggable={!disabled}
      dragBoundFunc={(pos) => ({ x: Math.min(maxX, Math.max(minX, pos.x)), y: axisY })}
      onDragEnd={(e) => {
        if (disabled) return
        onDragEnd(e.target.x())
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.target.getStage()!.container().style.cursor = 'grab'
      }}
      onMouseLeave={(e) => {
        e.target.getStage()!.container().style.cursor = 'default'
      }}
      scaleX={breathScale}
      scaleY={breathScale}
    >
      <Circle
        radius={18}
        fill={NUMBER_LINE_COLORS.token}
        stroke={NUMBER_LINE_COLORS.tokenStroke}
        strokeWidth={2}
        shadowBlur={6}
        shadowColor="rgba(0,0,0,0.2)"
      />
      <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
    </Group>
  )
}

/** انیمیشن پرش (+/-) روی خط — برای حالت demo */
function JumpDemo({
  from,
  to,
  label,
  valueToX,
  axisY,
  animate,
  replayKey,
}: {
  from: number
  to: number
  label?: string
  valueToX: (v: number) => number
  axisY: number
  animate: boolean
  replayKey: number
}) {
  const fromX = valueToX(from)
  const toX = valueToX(to)
  const midX = (fromX + toX) / 2
  const apexY = axisY - 46
  const [t, setT] = useState(animate ? 0 : 1)

  useEffect(() => {
    if (!animate) {
      setT(1)
      return
    }
    setT(0)
    const t0 = performance.now()
    const duration = 1300
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
  }, [animate, from, to, replayKey])

  const tokenX = fromX + (toX - fromX) * t
  const tokenY = axisY - Math.sin(Math.PI * Math.min(1, t)) * 46
  const arrowOpacity = Math.min(1, t * 1.6)

  return (
    <Group>
      <Arrow
        points={[fromX, axisY - 6, midX, apexY, toX, axisY - 6]}
        tension={0.5}
        stroke={NUMBER_LINE_COLORS.token}
        fill={NUMBER_LINE_COLORS.token}
        strokeWidth={2.5}
        pointerLength={9}
        pointerWidth={9}
        opacity={arrowOpacity}
      />
      {label ? (
        <Text
          x={midX - 30}
          y={apexY - 22}
          width={60}
          text={label}
          fontSize={15}
          fontStyle="bold"
          fill={NUMBER_LINE_COLORS.token}
          align="center"
          opacity={arrowOpacity}
        />
      ) : null}
      <StaticToken x={tokenX} y={tokenY} color={NUMBER_LINE_COLORS.token} mood="happy" />
    </Group>
  )
}

function NumberLineBoard({
  mode,
  params: rawParams,
  width = DEFAULT_W,
  height = DEFAULT_H,
  onSpeak,
  setAnimation,
  onSuccess,
  onWrong,
}: MathVisualComponentProps) {
  const params = parseParams(rawParams)
  const title = params.title ?? 'خط اعداد'
  const { min, max } = useMemo(() => inferRange(params), [params])
  const axisY = height * 0.58
  const scale = (width - PADDING * 2) / Math.max(1, max - min)
  const valueToX = useCallback((v: number) => PADDING + (v - min) * scale, [min, scale])

  const isComparePractice =
    mode === 'interactive' && Boolean(params.compareValues && params.comparisonAnswer)
  const isPlacementPractice =
    mode === 'interactive' && !isComparePractice && params.target !== undefined

  const [mood, setMood] = useState<FaceMood>('neutral')
  const [locked, setLocked] = useState(false)
  const [compareChoice, setCompareChoice] = useState<'lt' | 'eq' | 'gt' | null>(null)
  const [replayKey, setReplayKey] = useState(0)
  const successFired = useRef(false)

  useEffect(() => {
    setMood('neutral')
    setLocked(false)
    setCompareChoice(null)
    successFired.current = false
  }, [mode, params.target, params.startValue, params.comparisonAnswer, params.compareValues?.[0], params.compareValues?.[1]])

  const handlePlacementDrop = useCallback(
    (x: number) => {
      if (locked || params.target === undefined) return
      const rawValue = (x - PADDING) / scale + min
      const snapped = Math.round(Math.min(max, Math.max(min, rawValue)))
      if (snapped === params.target) {
        setMood('happy')
        setLocked(true)
        if (!successFired.current) {
          successFired.current = true
          if (onSuccess) onSuccess()
          else {
            onSpeak?.('آفرین! درست بود! 🎉')
            setAnimation?.('ThumbsUp')
          }
        }
      } else {
        setMood('sad')
        onWrong?.()
        onSpeak?.('دوباره نگاه کن — چند واحد تا آن عدد فاصله داری؟')
        setAnimation?.('Thinking')
        setTimeout(() => setMood('neutral'), 700)
      }
    },
    [locked, params.target, scale, min, max, onSuccess, onSpeak, setAnimation, onWrong]
  )

  const handleComparePick = useCallback(
    (choice: 'lt' | 'eq' | 'gt') => {
      if (locked || !params.comparisonAnswer) return
      setCompareChoice(choice)
      if (choice === params.comparisonAnswer) {
        setMood('happy')
        setLocked(true)
        if (!successFired.current) {
          successFired.current = true
          if (onSuccess) onSuccess()
          else {
            onSpeak?.('آفرین! درست بود! 🎉')
            setAnimation?.('ThumbsUp')
          }
        }
      } else {
        setMood('sad')
        onWrong?.()
        onSpeak?.('دوباره نگاه کن — کدام عدد روی خط سمت راست‌تر است؟')
        setAnimation?.('Thinking')
        setTimeout(() => setCompareChoice(null), 700)
      }
    },
    [locked, params.comparisonAnswer, onSuccess, onSpeak, setAnimation, onWrong]
  )

  const placementStartX = valueToX(params.startValue ?? Math.round((min + max) / 2))
  const minX = valueToX(min)
  const maxX = valueToX(max)

  return (
    <div className="space-y-3" dir="rtl">
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          <AxisAndTicks min={min} max={max} valueToX={valueToX} axisY={axisY} width={width} />

          {mode === 'demo' && params.jump ? (
            <JumpDemo
              key={`jump-${replayKey}-${params.jump.from}-${params.jump.to}`}
              from={params.jump.from}
              to={params.jump.to}
              label={params.jump.label}
              valueToX={valueToX}
              axisY={axisY}
              animate={params.jumpAnimate !== false}
              replayKey={replayKey}
            />
          ) : null}

          {/* نقاط ثابت زمینه‌ای — در demo/static به‌تنهایی، و در interactive هم به‌عنوان
              زمینه‌ی کمکی کنار نشانگر قابل‌درگ (مثلاً برای نشان‌دادن یک الگوی عددی) */}
          {!params.jump
            ? (params.points ?? []).map((p: NumberLinePoint, i) => (
                <StaticToken
                  key={`${p.value}-${i}`}
                  x={valueToX(p.value)}
                  y={axisY}
                  color={p.color ?? NUMBER_LINE_COLORS.token}
                  label={p.label ?? String(p.value)}
                  mood="neutral"
                />
              ))
            : null}

          {isComparePractice && params.compareValues ? (
            <>
              <StaticToken
                x={valueToX(params.compareValues[0])}
                y={axisY}
                color={NUMBER_LINE_COLORS.negative}
                label={String(params.compareValues[0])}
                mood={locked && compareChoice ? mood : 'neutral'}
              />
              <StaticToken
                x={valueToX(params.compareValues[1])}
                y={axisY}
                color={NUMBER_LINE_COLORS.positive}
                label={String(params.compareValues[1])}
                mood={locked && compareChoice ? mood : 'neutral'}
              />
            </>
          ) : null}

          {isPlacementPractice ? (
            <>
              {params.startValue !== undefined ? (
                <StaticToken
                  x={valueToX(params.startValue)}
                  y={axisY}
                  color="#CBD5E1"
                  label="شروع"
                  showFace={false}
                />
              ) : null}
              <StaticToken
                x={valueToX(params.target!)}
                y={axisY - 40}
                color={NUMBER_LINE_COLORS.target}
                label={`هدف: ${params.target}`}
                showFace={false}
              />
              <DraggableToken
                startX={placementStartX}
                axisY={axisY}
                minX={minX}
                maxX={maxX}
                mood={mood}
                disabled={locked}
                onDragEnd={handlePlacementDrop}
              />
            </>
          ) : null}
        </Layer>
      </KonvaWhiteboard>

      {mode === 'demo' && params.jump ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition"
            onClick={() => setReplayKey((k) => k + 1)}
          >
            پخش دوبارهٔ پرش
          </button>
        </div>
      ) : null}

      {isComparePractice ? (
        <div className="space-y-2">
          <p className="text-center text-sm text-slate-600 font-medium">کدام عدد بزرگ‌تر است؟</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(
              [
                { key: 'lt', text: `${params.compareValues?.[1]} بزرگ‌تر است` },
                { key: 'eq', text: 'با هم برابرند' },
                { key: 'gt', text: `${params.compareValues?.[0]} بزرگ‌تر است` },
              ] as const
            ).map((opt) => {
              const selected = compareChoice === opt.key
              const correct = locked && opt.key === params.comparisonAnswer
              let cls =
                'min-w-[9rem] rounded-2xl px-4 py-3 text-sm font-bold border-2 transition disabled:opacity-50 '
              if (correct) cls += 'border-emerald-500 bg-emerald-50 text-emerald-800'
              else if (selected && !locked) cls += 'border-rose-400 bg-rose-50 text-rose-800'
              else cls += 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={locked}
                  className={cls}
                  onClick={() => handleComparePick(opt.key)}
                >
                  {opt.text}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {isPlacementPractice ? (
        <p className="text-center text-sm text-slate-500">
          نشانگر بنفش را بکش و روی عدد هدف (سبز) رها کن
        </p>
      ) : null}
    </div>
  )
}

/** NumberLine — خط اعداد قابل‌دستکاری با Konva؛ حالت‌ها: demo | static | interactive */
export function NumberLine(props: MathVisualComponentProps) {
  return <NumberLineBoard {...props} />
}
