'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import KonvaLib from 'konva'
import { Circle, Group, Layer, Star, Text, Wedge } from 'react-konva'
import type { FractionCircleParams, MathVisualComponentProps } from '@/lib/math-visual-engine/types'
import {
  PIE_COLORS,
  polarToSliceIndex,
  sliceAngle,
  sliceChipPosition,
  sliceRotation,
} from '@/lib/math-visual-engine/konva-utils'
import { useLivelyKonva } from '../hooks/useLivelyKonva'
import { KonvaFractionLabel, KonvaWhiteboard } from '../shared/KonvaWhiteboard'
import { LivelyFace, type FaceMood } from '../shared/LivelyFace'

const DEFAULT_W = 600
const DEFAULT_H = 400
const TARGET_CX = 150
const USER_CX = 450
const CY = 195
const R = 85

function SliceSparkle({ x, y, phase }: { x: number; y: number; phase: number }) {
  const scale = 0.6 + Math.sin(phase) * 0.35
  return (
    <Star
      x={x}
      y={y}
      numPoints={4}
      innerRadius={3 * scale}
      outerRadius={9 * scale}
      fill="#FDE047"
      opacity={0.45 + Math.sin(phase * 1.3) * 0.4}
      rotation={phase * 40}
    />
  )
}

/** دایره کسر — حالت نمایشی (demo / static) */
function DisplayCircle({
  cx,
  cy,
  denominator,
  filledCount,
  breathScale,
  sparklePhase,
  mood,
  blink,
  eyeOffset,
  label,
  strokeColor = '#D97706',
}: {
  cx: number
  cy: number
  denominator: number
  filledCount: number
  breathScale: number
  sparklePhase: number
  mood: FaceMood
  blink: boolean
  eyeOffset: { x: number; y: number }
  label?: string
  strokeColor?: string
}) {
  return (
    <Group x={cx} y={cy} scaleX={breathScale} scaleY={breathScale}>
      <Circle radius={R + 5} fill="#FEF3C7" stroke={strokeColor} strokeWidth={3} shadowBlur={8} shadowColor="rgba(0,0,0,0.1)" />
      {Array.from({ length: denominator }).map((_, i) => (
        <Wedge
          key={i}
          radius={R}
          angle={sliceAngle(denominator)}
          rotation={sliceRotation(i, denominator)}
          fill={i < filledCount ? PIE_COLORS[i % PIE_COLORS.length] : 'rgba(255,255,255,0.12)'}
          stroke={strokeColor}
          strokeWidth={2}
        />
      ))}
      {Array.from({ length: filledCount }).map((_, i) => {
        const p = sliceChipPosition(i, denominator, R)
        return <SliceSparkle key={`sp-${i}`} x={p.x} y={p.y} phase={sparklePhase + i} />
      })}
      <Circle radius={9} fill="#D97706" />
      <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
      {label ? (
        <Text x={-R} y={R + 12} width={R * 2} text={label} fontSize={13} fill="#475569" fontStyle="bold" align="center" />
      ) : null}
    </Group>
  )
}

/** برش draggable با snap زاویه‌ای */
function DraggableChip({
  chipId,
  color,
  homeX,
  homeY,
  pizzaCx,
  pizzaCy,
  denominator,
  assignedSlot,
  onDrop,
  disabled,
}: {
  chipId: number
  color: string
  homeX: number
  homeY: number
  pizzaCx: number
  pizzaCy: number
  denominator: number
  assignedSlot: number | null
  onDrop: (chipId: number, slot: number | null) => void
  disabled?: boolean
}) {
  const groupRef = useRef<Konva.Group>(null)
  const chipR = 34
  const placed = assignedSlot !== null
  const wedgeRotation = placed ? sliceRotation(assignedSlot, denominator) : -90

  const snapPos =
    assignedSlot !== null
      ? sliceChipPosition(assignedSlot, denominator, R, 0.62)
      : { x: homeX - pizzaCx, y: homeY - pizzaCy }

  useEffect(() => {
    const node = groupRef.current
    if (!node) return
    node.to({
      x: pizzaCx + snapPos.x,
      y: pizzaCy + snapPos.y,
      duration: 0.2,
      easing: KonvaLib.Easings.EaseOut,
    })
  }, [assignedSlot, homeX, homeY, pizzaCx, pizzaCy, denominator])

  const handleDragEnd = () => {
    const node = groupRef.current
    if (!node || disabled) return
    const dx = node.x() - pizzaCx
    const dy = node.y() - pizzaCy
    if (Math.hypot(dx, dy) < R + 12) {
      onDrop(chipId, polarToSliceIndex(dx, dy, denominator))
    } else {
      onDrop(chipId, null)
    }
  }

  return (
    <Group
      ref={groupRef}
      x={pizzaCx + snapPos.x}
      y={pizzaCy + snapPos.y}
      draggable={!disabled}
      onDragEnd={handleDragEnd}
      onMouseEnter={(e) => {
        if (!disabled) e.target.getStage()!.container().style.cursor = 'grab'
      }}
      onMouseLeave={(e) => {
        e.target.getStage()!.container().style.cursor = 'default'
      }}
    >
      <Wedge
        radius={chipR}
        angle={sliceAngle(denominator)}
        rotation={wedgeRotation}
        fill={color}
        stroke="#D97706"
        strokeWidth={2}
        shadowBlur={assignedSlot !== null ? 5 : 2}
        shadowColor="rgba(0,0,0,0.18)"
      />
      <Circle radius={4} fill="#D97706" />
    </Group>
  )
}

function parseParams(params: MathVisualComponentProps['params']): FractionCircleParams {
  return (params ?? {}) as FractionCircleParams
}

/**
 * FractionCircle — دایره قابل تقسیم با Konva
 * حالت‌ها: demo (انیمیشن تقسیم) | static (نمایش) | interactive (drag + تشخیص جواب)
 */
export function FractionCircle({
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
  const denominator = params.denominator ?? params.target?.denominator ?? 4
  const numerator = params.numerator ?? params.target?.numerator ?? 1
  const target = params.target ?? { numerator, denominator }
  const showTarget = params.showTarget ?? mode === 'interactive'
  const title = params.title ?? 'دایره کسر'
  const lockDenominator =
    params.lockDenominator ?? (mode === 'interactive' && Boolean(params.target))
  const compareFractions = params.compareFractions
  const comparisonAnswer = params.comparisonAnswer
  const isComparePractice =
    mode === 'interactive' &&
    Boolean(comparisonAnswer) &&
    Boolean(compareFractions && compareFractions.length >= 2)

  const { breathScale, sparklePhase, blink, eyeOffset } = useLivelyKonva()
  const [demoFilled, setDemoFilled] = useState(0)
  const [mood, setMood] = useState<FaceMood>('neutral')
  const [board, setBoard] = useState<{ slots: Record<number, number>; chips: Record<number, number> }>({
    slots: {},
    chips: {},
  })
  const [userDenominator, setUserDenominator] = useState(target.denominator)
  const [locked, setLocked] = useState(false)
  const [spin, setSpin] = useState(0)
  const [compareChoice, setCompareChoice] = useState<'lt' | 'eq' | 'gt' | null>(null)
  const successFired = useRef(false)

  // انیمیشن تقسیم در حالت demo
  useEffect(() => {
    if (mode !== 'demo' || !params.divideAnimation) {
      setDemoFilled(mode === 'static' ? numerator : 0)
      return
    }
    setDemoFilled(0)
    let step = 0
    const id = setInterval(() => {
      step += 1
      setDemoFilled(Math.min(step, numerator))
      if (step >= denominator) clearInterval(id)
    }, 450)
    return () => clearInterval(id)
  }, [mode, params.divideAnimation, numerator, denominator])

  // ریست تمرین وقتی target / مقایسه عوض شد
  useEffect(() => {
    if (mode !== 'interactive') return
    setUserDenominator(target.denominator)
    setBoard({ slots: {}, chips: {} })
    setMood('neutral')
    setLocked(false)
    setCompareChoice(null)
    successFired.current = false
  }, [mode, target.numerator, target.denominator, comparisonAnswer, compareFractions])

  const handleComparePick = useCallback(
    (choice: 'lt' | 'eq' | 'gt') => {
      if (locked || !comparisonAnswer) return
      setCompareChoice(choice)
      if (choice === comparisonAnswer) {
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
        onSpeak?.('دوباره نگاه کن — کدام قسمت بزرگ‌تر است؟')
        setAnimation?.('Thinking')
        setTimeout(() => {
          setMood('neutral')
          setCompareChoice(null)
        }, 900)
      }
    },
    [locked, comparisonAnswer, onSuccess, onSpeak, setAnimation, onWrong]
  )

  const evaluate = useCallback(
    (slots: Record<number, number>, den: number) => {
      const count = Object.keys(slots).length
      if (den !== target.denominator || count !== target.numerator) return
      setMood('happy')
      setLocked(true)
      if (!successFired.current) {
        successFired.current = true
        if (onSuccess) {
          onSuccess()
        } else {
          onSpeak?.('آفرین! درست بود! 🎉')
          setAnimation?.('ThumbsUp')
        }
        let s = 0
        const spinId = setInterval(() => {
          s += 1
          setSpin(Math.sin(s * 0.55) * 8)
          if (s > 12) clearInterval(spinId)
        }, 50)
      }
    },
    [target, onSpeak, setAnimation, onSuccess]
  )

  const handleDrop = useCallback(
    (chipId: number, slot: number | null) => {
      if (locked) return
      setBoard((prev) => {
        const slots = { ...prev.slots }
        const chips = { ...prev.chips }
        const prevSlot = chips[chipId]
        if (prevSlot !== undefined) delete slots[prevSlot]

        if (slot === null) {
          delete chips[chipId]
        } else {
          const isNew = prevSlot === undefined
          const nextCount = Object.keys(slots).length + (isNew ? 1 : 0)
          if (isNew && nextCount > target.numerator) {
            onSpeak?.(`فقط ${target.numerator} برش لازم است!`)
            setAnimation?.('Thinking')
            setMood('sad')
            setTimeout(() => setMood('neutral'), 900)
            onWrong?.()
            return prev
          }
          const occupying = slots[slot]
          if (occupying !== undefined && occupying !== chipId) delete chips[occupying]
          slots[slot] = chipId
          chips[chipId] = slot
        }
        queueMicrotask(() => evaluate(slots, userDenominator))
        return { slots, chips }
      })
    },
    [locked, target.numerator, userDenominator, evaluate, onSpeak, setAnimation, onWrong]
  )

  const filledSlots = useMemo(() => new Set(Object.keys(board.slots).map(Number)), [board.slots])
  const placedCount = filledSlots.size

  const trayHome = (chipId: number, total: number) => {
    const perCol = Math.ceil(total / 2)
    const col = chipId >= perCol ? 1 : 0
    const row = chipId % perCol
    return {
      x: USER_CX + R + 36 + col * 36,
      y: CY - R + 8 + row * 30,
    }
  }

  // ─── تمرین مقایسه تعاملی (دکمه‌ای) ───────────────────────────
  if (isComparePractice && compareFractions && compareFractions.length >= 2) {
    const [left, right] = compareFractions
    const leftLabel = left.label ?? `${left.numerator}/${left.denominator}`
    const rightLabel = right.label ?? `${right.numerator}/${right.denominator}`
    const btnBase =
      'min-w-[7.5rem] rounded-2xl px-4 py-3 text-sm font-bold transition disabled:opacity-50 border-2'
    const choiceStyle = (c: 'lt' | 'eq' | 'gt') => {
      const selected = compareChoice === c
      const correct = locked && c === comparisonAnswer
      if (correct) return `${btnBase} border-emerald-500 bg-emerald-50 text-emerald-800`
      if (selected && !locked) return `${btnBase} border-rose-400 bg-rose-50 text-rose-800`
      return `${btnBase} border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50`
    }

    return (
      <div className="space-y-3" dir="rtl">
        <KonvaWhiteboard width={width} height={height} title={title}>
          <Layer>
            <DisplayCircle
              cx={TARGET_CX}
              cy={CY}
              denominator={left.denominator}
              filledCount={left.numerator}
              breathScale={breathScale}
              sparklePhase={sparklePhase}
              mood={mood}
              blink={blink}
              eyeOffset={eyeOffset}
              label={leftLabel}
              strokeColor="#6366f1"
            />
            <DisplayCircle
              cx={USER_CX}
              cy={CY}
              denominator={right.denominator}
              filledCount={right.numerator}
              breathScale={breathScale}
              sparklePhase={sparklePhase + 1}
              mood={mood}
              blink={blink}
              eyeOffset={eyeOffset}
              label={rightLabel}
              strokeColor="#0ea5e9"
            />
            <Text
              x={width / 2 - 16}
              y={CY - 8}
              text="؟"
              fontSize={22}
              fill="#94a3b8"
              fontStyle="bold"
            />
          </Layer>
        </KonvaWhiteboard>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            disabled={locked}
            className={choiceStyle('gt')}
            onClick={() => handleComparePick('gt')}
          >
            {leftLabel} بزرگ‌تر
          </button>
          <button
            type="button"
            disabled={locked}
            className={choiceStyle('eq')}
            onClick={() => handleComparePick('eq')}
          >
            برابرند
          </button>
          <button
            type="button"
            disabled={locked}
            className={choiceStyle('lt')}
            onClick={() => handleComparePick('lt')}
          >
            {rightLabel} بزرگ‌تر
          </button>
        </div>
        <p className="text-center text-xs text-slate-500">
          به قسمت رنگی هر دایره نگاه کن و انتخاب کن
        </p>
      </div>
    )
  }

  // ─── رندر بر اساس mode ───────────────────────────────────────
  if (mode === 'demo' || mode === 'static') {
    // حالت مقایسه: دو دایره کنار هم
    if (compareFractions && compareFractions.length >= 2) {
      const [left, right] = compareFractions
      return (
        <KonvaWhiteboard width={width} height={height} title={title}>
          <Layer>
            <DisplayCircle
              cx={TARGET_CX}
              cy={CY}
              denominator={left.denominator}
              filledCount={left.numerator}
              breathScale={breathScale}
              sparklePhase={sparklePhase}
              mood="neutral"
              blink={blink}
              eyeOffset={eyeOffset}
              label={left.label ?? `${left.numerator}/${left.denominator}`}
              strokeColor="#6366f1"
            />
            <DisplayCircle
              cx={USER_CX}
              cy={CY}
              denominator={right.denominator}
              filledCount={right.numerator}
              breathScale={breathScale}
              sparklePhase={sparklePhase + 1}
              mood="neutral"
              blink={blink}
              eyeOffset={eyeOffset}
              label={right.label ?? `${right.numerator}/${right.denominator}`}
              strokeColor="#0ea5e9"
            />
            <Text
              x={width / 2 - 16}
              y={CY - 8}
              text="؟"
              fontSize={22}
              fill="#94a3b8"
              fontStyle="bold"
            />
          </Layer>
        </KonvaWhiteboard>
      )
    }

    const cx = width / 2
    const filled = mode === 'demo' && params.divideAnimation ? demoFilled : numerator
    return (
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          <DisplayCircle
            cx={cx}
            cy={CY}
            denominator={denominator}
            filledCount={filled}
            breathScale={breathScale}
            sparklePhase={sparklePhase}
            mood="neutral"
            blink={blink}
            eyeOffset={eyeOffset}
            label={`${filled}/${denominator}`}
          />
          <KonvaFractionLabel
            x={width / 2 - 20}
            y={height - 72}
            numerator={filled}
            denominator={denominator}
          />
        </Layer>
      </KonvaWhiteboard>
    )
  }

  // interactive
  return (
    <div className="space-y-3">
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          {showTarget && (
            <DisplayCircle
              cx={TARGET_CX}
              cy={CY}
              denominator={target.denominator}
              filledCount={target.numerator}
              breathScale={breathScale}
              sparklePhase={sparklePhase}
              mood="neutral"
              blink={false}
              eyeOffset={{ x: 0, y: 0 }}
              label={`هدف: ${target.numerator}/${target.denominator}`}
              strokeColor="#6366f1"
            />
          )}

          <Group x={USER_CX} y={CY} scaleX={breathScale} scaleY={breathScale} rotation={spin}>
            <Circle radius={R + 5} fill="#FEF3C7" stroke="#0ea5e9" strokeWidth={3} />
            {Array.from({ length: userDenominator }).map((_, i) => (
              <Wedge
                key={i}
                radius={R}
                angle={sliceAngle(userDenominator)}
                rotation={sliceRotation(i, userDenominator)}
                fill={filledSlots.has(i) ? PIE_COLORS[i % PIE_COLORS.length] : 'rgba(255,255,255,0.15)'}
                stroke={filledSlots.has(i) ? '#D97706' : '#94a3b8'}
                strokeWidth={2}
                dash={filledSlots.has(i) ? undefined : [5, 4]}
              />
            ))}
            {Array.from(filledSlots).map((i) => {
              const p = sliceChipPosition(i, userDenominator, R)
              return <SliceSparkle key={i} x={p.x} y={p.y} phase={sparklePhase + i} />
            })}
            <Circle radius={9} fill="#D97706" />
            <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
          </Group>

          {Array.from({ length: userDenominator }).map((_, chipId) => {
            const home = trayHome(chipId, userDenominator)
            return (
              <DraggableChip
                key={`chip-${chipId}-d${userDenominator}-t${target.numerator}-${target.denominator}`}
                chipId={chipId}
                color={PIE_COLORS[chipId % PIE_COLORS.length]}
                homeX={home.x}
                homeY={home.y}
                pizzaCx={USER_CX}
                pizzaCy={CY}
                denominator={userDenominator}
                assignedSlot={board.chips[chipId] ?? null}
                onDrop={handleDrop}
                disabled={locked}
              />
            )
          })}

          <Text x={32} y={height - 36} width={width - 64} text="برش را بکش و روی دایره رها کن ✨" fontSize={12} fill="#64748b" align="center" />
        </Layer>
      </KonvaWhiteboard>

      <div className="flex flex-col items-center gap-2" dir="rtl">
        <div className="flex items-center gap-1 font-extrabold text-slate-800">
          <span className="text-4xl text-indigo-600">{placedCount}</span>
          <span className="text-2xl text-slate-400">/</span>
          <span className="text-4xl text-sky-600">{userDenominator}</span>
        </div>
        <label className="text-sm text-slate-600 flex items-center gap-2">
          {lockDenominator ? (
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full">
              مخرج ثابت: <strong>{userDenominator}</strong>
            </span>
          ) : (
            <>
              مخرج:
              <input
                type="range"
                min={2}
                max={8}
                value={userDenominator}
                disabled={locked}
                onChange={(e) => {
                  const next = Number(e.target.value)
                  setUserDenominator(next)
                  setBoard({ slots: {}, chips: {} })
                  setLocked(false)
                  successFired.current = false
                  if (next !== target.denominator) {
                    onSpeak?.(`مخرج را ${target.denominator} بگذار!`)
                    setAnimation?.('Thinking')
                  }
                }}
                className="w-28 accent-indigo-500"
              />
            </>
          )}
        </label>
        {!locked && (
          <button
            type="button"
            className="text-xs text-slate-500 underline"
            onClick={() => {
              setBoard({ slots: {}, chips: {} })
              setMood('neutral')
              setLocked(false)
              successFired.current = false
            }}
          >
            پاک کردن برش‌ها
          </button>
        )}
      </div>
    </div>
  )
}
