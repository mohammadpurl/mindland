'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Circle, Group, Layer, Star, Text, Wedge } from 'react-konva'
import { WhiteboardFrame } from './WhiteboardFrame'
import { PIE_COLORS, sliceAngle, sliceRotation } from './konva-utils'

const W = 560
const H = 400

export interface FractionTarget {
  numerator: number
  denominator: number
}

interface Props {
  /** کسر هدف (پیتزای چپ) */
  target: FractionTarget
  onSuccess?: () => void
  onWrong?: () => void
}

function PieAt({
  cx,
  cy,
  r,
  denominator,
  filledMask,
  label,
  interactive,
  onToggleSlice,
  pulse,
}: {
  cx: number
  cy: number
  r: number
  denominator: number
  filledMask: boolean[]
  label: string
  interactive?: boolean
  onToggleSlice?: (index: number) => void
  pulse?: boolean
}) {
  const scale = pulse ? 1.04 : 1

  return (
    <Group x={cx} y={cy} scaleX={scale} scaleY={scale}>
      <Circle radius={r + 5} fill="#FEF3C7" stroke="#D97706" strokeWidth={3} />
      {Array.from({ length: denominator }).map((_, i) => {
        const filled = filledMask[i]
        return (
          <Wedge
            key={i}
            radius={r}
            angle={sliceAngle(denominator)}
            rotation={sliceRotation(i, denominator)}
            fill={filled ? PIE_COLORS[i % PIE_COLORS.length] : 'rgba(255,255,255,0.08)'}
            stroke="#D97706"
            strokeWidth={2}
            opacity={filled ? 1 : 0.85}
            onClick={interactive ? () => onToggleSlice?.(i) : undefined}
            onTap={interactive ? () => onToggleSlice?.(i) : undefined}
            listening={interactive}
          />
        )
      })}
      <Circle radius={9} fill="#D97706" />
      <Text x={-r} y={r + 12} text={label} fontSize={14} fill="#334155" width={r * 2} align="center" />
      <Text x={-10} y={-r * 0.3} text="◕‿◕" fontSize={14} fill="#92400E" />
    </Group>
  )
}

/**
 * پیتزای تعاملی Konva — کاربر با کلیک برش‌ها را انتخاب می‌کند.
 * مخرج با slider تنظیم می‌شود؛ هدف در پیتزای چپ ثابت است.
 * @deprecated از InteractiveFractionPizza استفاده کنید
 */
export function InteractiveFractionPie({ target, onSuccess, onWrong }: Props) {
  const [denominator, setDenominator] = useState(target.denominator)
  const [filled, setFilled] = useState<boolean[]>(() => Array(target.denominator).fill(false))
  const [sparkle, setSparkle] = useState(false)
  const [pulse, setPulse] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    setFilled(Array(denominator).fill(false))
  }, [denominator])

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 900)
    return () => clearInterval(id)
  }, [])

  const selectedCount = filled.filter(Boolean).length

  const targetMask = useMemo(() => {
    const m = Array(target.denominator).fill(false)
    for (let i = 0; i < target.numerator; i++) m[i] = true
    return m
  }, [target])

  const checkAnswer = useCallback(
    (nextFilled: boolean[], den: number) => {
      const count = nextFilled.filter(Boolean).length
      if (den !== target.denominator) return
      if (count === target.numerator) {
        setSparkle(true)
        setTimeout(() => setSparkle(false), 1200)
        onSuccess?.()
      } else if (count > target.numerator) {
        setAttempts((a) => a + 1)
        onWrong?.()
      }
    },
    [target, onSuccess, onWrong]
  )

  const toggleSlice = (index: number) => {
    setFilled((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      checkAnswer(next, denominator)
      return next
    })
  }

  const targetLabel = `${target.numerator}/${target.denominator}`
  const userLabel = `${selectedCount}/${denominator}`

  return (
    <div className="space-y-3">
      <WhiteboardFrame width={W} height={H} title="تمرین تعاملی — پیتزای کسر">
        <Layer>
          <Text x={16} y={12} text="هدف" fontSize={14} fill="#6366f1" fontStyle="bold" />
          <Text x={W / 2 + 16} y={12} text="پیتزای تو" fontSize={14} fill="#0ea5e9" fontStyle="bold" />

          <PieAt
            cx={140}
            cy={H / 2 + 10}
            r={85}
            denominator={target.denominator}
            filledMask={targetMask}
            label={targetLabel}
            pulse={pulse}
          />

          <PieAt
            cx={W - 140}
            cy={H / 2 + 10}
            r={85}
            denominator={denominator}
            filledMask={filled}
            label={userLabel}
            interactive
            onToggleSlice={toggleSlice}
            pulse={selectedCount === target.numerator && denominator === target.denominator}
          />

          {sparkle && (
            <Star x={W / 2} y={H / 2} numPoints={5} innerRadius={8} outerRadius={22} fill="#FDE047" opacity={0.9} />
          )}

          <Text
            x={40}
            y={H - 36}
            width={W - 80}
            text="روی برش‌ها کلیک کن تا رنگی شوند ✨"
            fontSize={13}
            fill="#64748b"
            align="center"
          />
        </Layer>
      </WhiteboardFrame>

      <div className="flex flex-wrap items-center gap-4 justify-center px-2" dir="rtl">
        <label className="text-sm text-slate-600 font-medium">
          مخرج (تعداد برش):
          <input
            type="range"
            min={2}
            max={8}
            value={denominator}
            onChange={(e) => setDenominator(Number(e.target.value))}
            className="mx-2 w-32 align-middle accent-indigo-500"
          />
          <span className="font-bold text-indigo-600">{denominator}</span>
        </label>
        <button
          type="button"
          className="text-sm text-slate-500 underline"
          onClick={() => {
            setFilled(Array(denominator).fill(false))
            setAttempts(0)
          }}
        >
          پاک کردن
        </button>
        {attempts > 0 && (
          <span className="text-xs text-amber-600">دوباره امتحان کن — {targetLabel} یعنی {target.numerator} برش!</span>
        )}
      </div>
    </div>
  )
}
