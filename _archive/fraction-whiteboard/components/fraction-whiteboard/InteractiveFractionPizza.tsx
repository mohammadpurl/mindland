'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type Konva from 'konva'
import KonvaLib from 'konva'
import { Circle, Group, Layer, Line, Star, Text, Wedge } from 'react-konva'
import { WhiteboardFrame } from './WhiteboardFrame'
import {
  PIE_COLORS,
  polarToSliceIndex,
  sliceAngle,
  sliceChipPosition,
  sliceRotation,
} from './konva-utils'

// ─── ابعاد وایت‌برد ───────────────────────────────────────────────
const W = 640
const H = 420
const TARGET_CX = 155
const USER_CX = 485
const PIZZA_CY = 195
const PIZZA_R = 88

export interface FractionTarget {
  numerator: number
  denominator: number
}

type PizzaMood = 'neutral' | 'happy' | 'sad'

export interface InteractiveFractionPizzaProps {
  /** کسر هدف — پیتزای چپ */
  target: FractionTarget
  /** صحبت آواتار (اختیاری — برای ادغام با درس) */
  onSpeak?: (text: string) => void
  /** تغییر انیمیشن آواتار (اختیاری) */
  setAnimation?: (name: string) => void
  onSuccess?: () => void
  onWrong?: () => void
}

// ─── چهره زنده پیتزا (چشم، پلک، دهان) ───────────────────────────
function PizzaFace({
  mood,
  blink,
  eyeOffset,
}: {
  mood: PizzaMood
  blink: boolean
  eyeOffset: { x: number; y: number }
}) {
  const eyeScaleY = blink ? 0.12 : 1
  const mouthY = mood === 'happy' ? 14 : mood === 'sad' ? 20 : 17

  return (
    <Group>
      {/* چشم چپ */}
      <Group x={-18 + eyeOffset.x} y={-6 + eyeOffset.y} scaleY={eyeScaleY}>
        <Circle radius={5} fill="#fff" stroke="#92400E" strokeWidth={1.5} />
        <Circle radius={2.2} fill="#1e293b" x={mood === 'happy' ? 1 : 0} y={mood === 'sad' ? -1 : 0} />
      </Group>
      {/* چشم راست */}
      <Group x={18 + eyeOffset.x} y={-6 + eyeOffset.y} scaleY={eyeScaleY}>
        <Circle radius={5} fill="#fff" stroke="#92400E" strokeWidth={1.5} />
        <Circle radius={2.2} fill="#1e293b" x={mood === 'happy' ? -1 : 0} y={mood === 'sad' ? -1 : 0} />
      </Group>
      {/* دهان */}
      {mood === 'happy' ? (
        <Line points={[-12, mouthY, 0, mouthY + 10, 12, mouthY]} stroke="#92400E" strokeWidth={2.5} lineCap="round" tension={0.4} />
      ) : mood === 'sad' ? (
        <Line points={[-10, mouthY + 8, 0, mouthY, 10, mouthY + 8]} stroke="#92400E" strokeWidth={2.5} lineCap="round" tension={0.4} />
      ) : (
        <Line points={[-8, mouthY + 4, 8, mouthY + 4]} stroke="#92400E" strokeWidth={2} lineCap="round" />
      )}
      {/* گونه‌های سرخ هنگام شادی */}
      {mood === 'happy' && (
        <>
          <Circle x={-28} y={8} radius={6} fill="#FDA4AF" opacity={0.55} />
          <Circle x={28} y={8} radius={6} fill="#FDA4AF" opacity={0.55} />
        </>
      )}
    </Group>
  )
}

// ─── برق روی برش‌های پر ─────────────────────────────────────────
function SliceSparkle({ x, y, phase }: { x: number; y: number; phase: number }) {
  const scale = 0.6 + Math.sin(phase) * 0.35
  const opacity = 0.45 + Math.sin(phase * 1.3) * 0.4
  return (
    <Star
      x={x}
      y={y}
      numPoints={4}
      innerRadius={3 * scale}
      outerRadius={9 * scale}
      fill="#FDE047"
      opacity={opacity}
      rotation={phase * 40}
    />
  )
}

// ─── پیتزای هدف (ثابت) ───────────────────────────────────────────
function TargetPizza({
  denominator,
  numerator,
  breathScale,
  sparklePhase,
}: {
  denominator: number
  numerator: number
  breathScale: number
  sparklePhase: number
}) {
  const filled = useMemo(() => {
    const mask = Array(denominator).fill(false)
    for (let i = 0; i < numerator; i++) mask[i] = true
    return mask
  }, [denominator, numerator])

  return (
    <Group x={TARGET_CX} y={PIZZA_CY} scaleX={breathScale} scaleY={breathScale}>
      <Circle radius={PIZZA_R + 6} fill="#FEF3C7" stroke="#D97706" strokeWidth={3} shadowBlur={8} shadowColor="rgba(0,0,0,0.12)" />
      {Array.from({ length: denominator }).map((_, i) => (
        <Wedge
          key={i}
          radius={PIZZA_R}
          angle={sliceAngle(denominator)}
          rotation={sliceRotation(i, denominator)}
          fill={filled[i] ? PIE_COLORS[i % PIE_COLORS.length] : 'rgba(255,255,255,0.12)'}
          stroke="#D97706"
          strokeWidth={2}
        />
      ))}
      {filled.map((isOn, i) => {
        if (!isOn) return null
        const p = sliceChipPosition(i, denominator, PIZZA_R)
        return <SliceSparkle key={`sp-${i}`} x={p.x} y={p.y} phase={sparklePhase + i} />
      })}
      <Circle radius={10} fill="#D97706" />
      <PizzaFace mood="neutral" blink={false} eyeOffset={{ x: 0, y: 0 }} />
      <Text
        x={-PIZZA_R}
        y={PIZZA_R + 14}
        width={PIZZA_R * 2}
        text={`هدف: ${numerator}/${denominator}`}
        fontSize={13}
        fill="#6366f1"
        fontStyle="bold"
        align="center"
      />
    </Group>
  )
}

// ─── برش draggable از سینی مواد ─────────────────────────────────
function DraggableSliceChip({
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
  const chipR = 36

  const snapPos =
    assignedSlot !== null
      ? sliceChipPosition(assignedSlot, denominator, PIZZA_R, 0.62)
      : { x: homeX - pizzaCx, y: homeY - pizzaCy }

  useEffect(() => {
    const node = groupRef.current
    if (!node) return
    node.to({
      x: pizzaCx + snapPos.x,
      y: pizzaCy + snapPos.y,
      duration: 0.22,
      easing: KonvaLib.Easings.EaseOut,
    })
  }, [assignedSlot, homeX, homeY, pizzaCx, pizzaCy, denominator])

  const handleDragEnd = () => {
    const node = groupRef.current
    if (!node || disabled) return

    const absX = node.x()
    const absY = node.y()
    const dx = absX - pizzaCx
    const dy = absY - pizzaCy
    const dist = Math.hypot(dx, dy)

    if (dist < PIZZA_R + 12) {
      const slot = polarToSliceIndex(dx, dy, denominator)
      onDrop(chipId, slot)
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
        rotation={-90}
        fill={color}
        stroke="#D97706"
        strokeWidth={2}
        shadowBlur={assignedSlot !== null ? 6 : 2}
        shadowColor="rgba(0,0,0,0.2)"
        opacity={disabled ? 0.45 : 1}
      />
      <Circle radius={4} fill="#D97706" />
    </Group>
  )
}

// ─── پیتزای تعاملی دانش‌آموز ─────────────────────────────────────
function UserPizza({
  denominator,
  slotMap,
  mood,
  blink,
  eyeOffset,
  breathScale,
  spin,
  sparklePhase,
}: {
  denominator: number
  slotMap: Record<number, number>
  mood: PizzaMood
  blink: boolean
  eyeOffset: { x: number; y: number }
  breathScale: number
  spin: number
  sparklePhase: number
}) {
  const filledSlots = new Set(Object.keys(slotMap).map(Number))

  return (
    <Group x={USER_CX} y={PIZZA_CY} scaleX={breathScale} scaleY={breathScale} rotation={spin}>
      <Circle radius={PIZZA_R + 6} fill="#FEF3C7" stroke="#0ea5e9" strokeWidth={3} shadowBlur={10} shadowColor="rgba(14,165,233,0.25)" />
      {Array.from({ length: denominator }).map((_, i) => (
        <Wedge
          key={i}
          radius={PIZZA_R}
          angle={sliceAngle(denominator)}
          rotation={sliceRotation(i, denominator)}
          fill={filledSlots.has(i) ? PIE_COLORS[i % PIE_COLORS.length] : 'rgba(255,255,255,0.15)'}
          stroke={filledSlots.has(i) ? '#D97706' : '#94a3b8'}
          strokeWidth={filledSlots.has(i) ? 2 : 1.5}
          dash={filledSlots.has(i) ? undefined : [6, 4]}
          opacity={filledSlots.has(i) ? 1 : 0.9}
        />
      ))}
      {Array.from(filledSlots).map((i) => {
        const p = sliceChipPosition(i, denominator, PIZZA_R)
        return <SliceSparkle key={`usp-${i}`} x={p.x} y={p.y} phase={sparklePhase + i * 0.7} />
      })}
      <Circle radius={10} fill="#D97706" />
      <PizzaFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
      <Text
        x={-PIZZA_R}
        y={PIZZA_R + 14}
        width={PIZZA_R * 2}
        text="پیتزای تو"
        fontSize={13}
        fill="#0ea5e9"
        fontStyle="bold"
        align="center"
      />
    </Group>
  )
}

/**
 * تمرین تعاملی کسر — دو پیتزا، drag & snap، انیمیشن زنده.
 * ماژولار؛ قابل استفاده در FractionWhiteboardLesson یا صفحات دیگر.
 */
export function InteractiveFractionPizza({
  target,
  onSpeak,
  setAnimation,
  onSuccess,
  onWrong,
}: InteractiveFractionPizzaProps) {
  const [denominator, setDenominator] = useState(target.denominator)
  const [board, setBoard] = useState<{
    slots: Record<number, number>
    chips: Record<number, number>
  }>({ slots: {}, chips: {} })
  const [mood, setMood] = useState<PizzaMood>('neutral')
  const [blink, setBlink] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [breathPhase, setBreathPhase] = useState(0)
  const [sparklePhase, setSparklePhase] = useState(0)
  const [successSpin, setSuccessSpin] = useState(0)
  const [locked, setLocked] = useState(false)
  const successFired = useRef(false)

  const chipCount = denominator
  const slotMap = board.slots
  const chipToSlot = board.chips
  const placedCount = Object.keys(slotMap).length
  const userNumerator = placedCount

  const breathScale = 1 + Math.sin(breathPhase) * 0.028

  // انیمیشن‌های زنده: نفس، چشمک، برق
  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      setBreathPhase(t * 2.2)
      setSparklePhase(t * 4)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const blinkId = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 120)
    }, 2800 + Math.random() * 1200)
    return () => clearInterval(blinkId)
  }, [])

  useEffect(() => {
    const eyeId = setInterval(() => {
      setEyeOffset({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 3,
      })
    }, 1400)
    return () => clearInterval(eyeId)
  }, [])

  const resetBoard = useCallback(() => {
    setBoard({ slots: {}, chips: {} })
    setMood('neutral')
    setSuccessSpin(0)
    setLocked(false)
    successFired.current = false
  }, [])

  /** فقط وقتی تمرین جدید شروع می‌شود — بدون وابستگی به onSpeak */
  useEffect(() => {
    setDenominator(target.denominator)
    setBoard({ slots: {}, chips: {} })
    setMood('neutral')
    setSuccessSpin(0)
    setLocked(false)
    successFired.current = false
  }, [target.numerator, target.denominator])

  const handleUserReset = () => {
    resetBoard()
    onSpeak?.('بیا از اول شروع کنیم! برش‌ها را بکش و روی پیتزا بگذار.')
    setAnimation?.('Pointing')
  }

  const handleDenominatorChange = (next: number) => {
    setDenominator(next)
    setBoard({ slots: {}, chips: {} })
    setMood('neutral')
    setLocked(false)
    successFired.current = false
    if (next !== target.denominator) {
      onSpeak?.(`مخرج الان ${next} است. برای این تمرین باید مخرج ${target.denominator} باشد!`)
      setAnimation?.('Thinking')
    }
  }

  const avatarSuccess = useCallback(() => {
    onSpeak?.('آفرین! دقیقاً مثل هدف درست کردی! 🎉')
    setAnimation?.('ThumbsUp')
  }, [onSpeak, setAnimation])

  const evaluate = useCallback(
    (nextSlotMap: Record<number, number>, den: number) => {
      const count = Object.keys(nextSlotMap).length
      if (den !== target.denominator) return
      if (count !== target.numerator) return

      setMood('happy')
      setLocked(true)
      if (!successFired.current) {
        successFired.current = true
        if (onSuccess) onSuccess()
        else avatarSuccess()
        let step = 0
        const spinId = setInterval(() => {
          step += 1
          setSuccessSpin(Math.sin(step * 0.55) * 8)
          if (step > 12) clearInterval(spinId)
        }, 50)
      }
    },
    [target, avatarSuccess, onSuccess]
  )

  const handleChipDrop = useCallback(
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
          const isNewPlacement = prevSlot === undefined
          const nextCount = Object.keys(slots).length + (isNewPlacement ? 1 : 0)

          // جلوگیری از قرار دادن بیش از صورت کسر — بدون ثبت «اشتباه»
          if (isNewPlacement && nextCount > target.numerator) {
            onSpeak?.(`فقط ${target.numerator} برش لازم است! یکی را بردار.`)
            setAnimation?.('Thinking')
            queueMicrotask(() => {
              setMood('sad')
              setTimeout(() => setMood('neutral'), 900)
            })
            return prev
          }

          const occupying = slots[slot]
          if (occupying !== undefined && occupying !== chipId) {
            delete chips[occupying]
          }
          slots[slot] = chipId
          chips[chipId] = slot
        }

        const next = { slots, chips }
        queueMicrotask(() => evaluate(slots, denominator))
        return next
      })
    },
    [denominator, evaluate, locked, onSpeak, setAnimation, target.numerator]
  )

  const trayHome = (chipId: number) => ({
    x: USER_CX + PIZZA_R + 52,
    y: PIZZA_CY - PIZZA_R + 20 + chipId * 34,
  })

  return (
    <div className="space-y-4">
      <WhiteboardFrame width={W} height={H} title="تمرین پیتزا — بکش و رها کن! 🍕">
        <Layer>
          <TargetPizza
            denominator={target.denominator}
            numerator={target.numerator}
            breathScale={breathScale}
            sparklePhase={sparklePhase}
          />

          <UserPizza
            denominator={denominator}
            slotMap={slotMap}
            mood={mood}
            blink={blink}
            eyeOffset={eyeOffset}
            breathScale={breathScale}
            spin={successSpin}
            sparklePhase={sparklePhase}
          />

          {/* برش‌های draggable از سینی */}
          {Array.from({ length: chipCount }).map((_, chipId) => {
            const home = trayHome(chipId)
            const assigned = chipToSlot[chipId] ?? null
            return (
              <DraggableSliceChip
                key={`chip-${chipId}-${denominator}`}
                chipId={chipId}
                color={PIE_COLORS[chipId % PIE_COLORS.length]}
                homeX={home.x}
                homeY={home.y}
                pizzaCx={USER_CX}
                pizzaCy={PIZZA_CY}
                denominator={denominator}
                assignedSlot={assigned}
                onDrop={handleChipDrop}
                disabled={locked}
              />
            )
          })}

          <Text
            x={USER_CX + PIZZA_R + 28}
            y={PIZZA_CY - PIZZA_R - 8}
            text="سینی برش"
            fontSize={11}
            fill="#64748b"
            fontStyle="bold"
          />

          <Text
            x={32}
            y={H - 40}
            width={W - 64}
            text="برش رنگی را بکش و روی پیتزای راست رها کن ✨"
            fontSize={13}
            fill="#64748b"
            align="center"
          />
        </Layer>
      </WhiteboardFrame>

      {/* کنترل‌ها + نمایش کسر بزرگ */}
      <motion.div
        className="flex flex-col items-center gap-4 px-2"
        dir="rtl"
        animate={{ scale: mood === 'happy' ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-1 text-slate-800 font-extrabold select-none">
          <span className="text-4xl md:text-5xl tabular-nums text-indigo-600">{userNumerator}</span>
          <span className="text-3xl text-slate-400 mx-1">/</span>
          <span className="text-4xl md:text-5xl tabular-nums text-sky-600">{denominator}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <label className="text-sm text-slate-600 font-medium flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-100">
            مخرج:
            <input
              type="range"
              min={2}
              max={8}
              value={denominator}
              disabled={locked}
              onChange={(e) => handleDenominatorChange(Number(e.target.value))}
              className="w-28 accent-indigo-500"
            />
            <span className="font-bold text-indigo-600 w-4 text-center">{denominator}</span>
          </label>

          <button
            type="button"
            onClick={handleUserReset}
            className="text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 hover:bg-slate-50 shadow-sm transition-colors"
          >
            Reset / از نو
          </button>
        </div>

        {denominator !== target.denominator && (
          <p className="text-xs text-amber-600 font-medium">
            مخرج را روی {target.denominator} بگذار تا با هدف ({target.numerator}/{target.denominator}) یکی شود.
          </p>
        )}
        {mood === 'happy' && (
          <p className="text-sm text-emerald-600 font-bold">عالی! پیتزا خندید! 🍕😄</p>
        )}
      </motion.div>
    </div>
  )
}
