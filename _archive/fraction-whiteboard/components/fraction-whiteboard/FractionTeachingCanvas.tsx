'use client'

import { useEffect, useMemo, useState } from 'react'
import { Circle, Group, Layer, Line, Text, Wedge } from 'react-konva'
import type { TeachingStepKind } from './teaching-steps'
import { FractionLabel, WhiteboardFrame } from './WhiteboardFrame'
import { PIE_COLORS, sliceAngle, sliceRotation } from './konva-utils'

const W = 560
const H = 360

interface Props {
  stepKind: TeachingStepKind
  /** برای انیمیشن تقسیم — تعداد خطوط ظاهرشده */
  animTick?: number
}

function PizzaPie({
  cx,
  cy,
  r,
  denominator,
  filled,
  label,
  pulse = false,
}: {
  cx: number
  cy: number
  r: number
  denominator: number
  filled: number
  label?: string
  pulse?: boolean
}) {
  const scale = pulse ? 1.04 : 1

  return (
    <Group x={cx} y={cy} scaleX={scale} scaleY={scale}>
      <Circle radius={r + 4} fill="#FEF3C7" stroke="#D97706" strokeWidth={3} />
      {Array.from({ length: denominator }).map((_, i) => (
        <Wedge
          key={i}
          radius={r}
          angle={sliceAngle(denominator)}
          rotation={sliceRotation(i, denominator)}
          fill={i < filled ? PIE_COLORS[i % PIE_COLORS.length] : 'rgba(255,255,255,0.06)'}
          stroke="#D97706"
          strokeWidth={2}
        />
      ))}
      <Circle radius={8} fill="#D97706" />
      {label && (
        <Text
          x={-r - 10}
          y={r + 16}
          text={label}
          fontSize={14}
          fill="#475569"
          width={r * 2 + 20}
          align="center"
        />
      )}
      {/* چشم کوچک کودک‌پسند */}
      <Text x={-8} y={-r * 0.35} text="◕‿◕" fontSize={16} fill="#92400E" />
    </Group>
  )
}

export function FractionTeachingCanvas({ stepKind }: Props) {
  const [tick, setTick] = useState(0)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    setTick(0)
    const id = setInterval(() => setTick((t) => t + 1), 600)
    return () => clearInterval(id)
  }, [stepKind])

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 800)
    return () => clearInterval(id)
  }, [])

  const title = useMemo(() => {
    const map: Record<TeachingStepKind, string> = {
      intro: 'صورت و مخرج',
      divide: 'تقسیم مساوی',
      examples: '۱/۲ — ۱/۳ — ۱/۴',
      numerator: 'تغییر صورت',
      compare: 'مقایسه کسرها',
      ready: 'آماده تمرین!',
    }
    return map[stepKind]
  }, [stepKind])

  return (
    <WhiteboardFrame width={W} height={H} title={title}>
      <Layer>
        {stepKind === 'intro' && (
          <Group>
            <FractionLabel x={W / 2 - 50} y={H / 2 - 50} numerator={1} denominator={4} size="lg" />
            <Text x={W / 2 + 30} y={H / 2 - 42} text="صورت ↑" fontSize={16} fill="#6366f1" />
            <Text x={W / 2 + 30} y={H / 2 - 8} text="مخرج ↓" fontSize={16} fill="#0ea5e9" />
            <Text
              x={40}
              y={H - 48}
              width={W - 80}
              text="کسر = چند قسمت از کل"
              fontSize={15}
              fill="#64748b"
              align="center"
            />
          </Group>
        )}

        {stepKind === 'divide' && (
          <Group>
            <PizzaPie cx={W / 2} cy={H / 2} r={90} denominator={4} filled={Math.min(4, Math.floor(tick / 2))} pulse={pulse} />
            {Array.from({ length: Math.min(4, tick) }).map((_, i) => {
              const rot = sliceRotation(i, 4) * (Math.PI / 180)
              const len = 95
              return (
                <Line
                  key={i}
                  points={[W / 2, H / 2, W / 2 + len * Math.cos(rot), H / 2 + len * Math.sin(rot)]}
                  stroke="#6366f1"
                  strokeWidth={2}
                  dash={[6, 4]}
                  opacity={0.7}
                />
              )
            })}
          </Group>
        )}

        {stepKind === 'examples' && (
          <Group>
            <PizzaPie cx={120} cy={H / 2} r={55} denominator={2} filled={1} label="۱/۲" />
            <PizzaPie cx={W / 2} cy={H / 2} r={55} denominator={3} filled={1} label="۱/۳" />
            <PizzaPie cx={W - 120} cy={H / 2} r={55} denominator={4} filled={1} label="۱/۴" />
          </Group>
        )}

        {stepKind === 'numerator' && (
          <Group>
            <PizzaPie cx={W / 2 - 90} cy={H / 2} r={70} denominator={4} filled={1} label="۱/۴" />
            <Text x={W / 2 - 20} y={H / 2 - 10} text="→" fontSize={32} fill="#6366f1" />
            <PizzaPie cx={W / 2 + 90} cy={H / 2} r={70} denominator={4} filled={2} label="۲/۴" pulse />
          </Group>
        )}

        {stepKind === 'compare' && (
          <Group>
            <PizzaPie cx={W / 2 - 100} cy={H / 2} r={75} denominator={2} filled={1} label="۱/۲ بزرگ‌تر" />
            <PizzaPie cx={W / 2 + 100} cy={H / 2} r={75} denominator={4} filled={1} label="۱/۴ کوچک‌تر" />
          </Group>
        )}

        {stepKind === 'ready' && (
          <Group>
            <Text
              x={0}
              y={H / 2 - 40}
              width={W}
              text="🍕 حالا نوبت توست!"
              fontSize={26}
              fill="#6366f1"
              fontStyle="bold"
              align="center"
            />
            <Text
              x={40}
              y={H / 2 + 10}
              width={W - 80}
              text="برش‌ها را بکش و پیتزا را درست کن"
              fontSize={16}
              fill="#64748b"
              align="center"
            />
          </Group>
        )}
      </Layer>
    </WhiteboardFrame>
  )
}
