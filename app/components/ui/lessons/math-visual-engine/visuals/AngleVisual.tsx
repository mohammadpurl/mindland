'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import { Arc, Circle, Group, Layer, Line, Text } from 'react-konva'
import type { AngleParams, MathVisualComponentProps } from '@/lib/math-visual-engine/types'
import { ANGLE_COLORS } from '@/lib/math-visual-engine/konva-utils'
import { LivelyFace, type FaceMood } from '../shared/LivelyFace'
import { useLivelyKonva } from '../hooks/useLivelyKonva'
import { KonvaWhiteboard } from '../shared/KonvaWhiteboard'

const DEFAULT_W = 520
const DEFAULT_H = 400
const RAY_LEN = 150
const SUCCESS_TOLERANCE = 3

function parseParams(params: MathVisualComponentProps['params']): AngleParams {
  return (params ?? {}) as AngleParams
}

/** تبدیل درجه (۰=راست، ۹۰=بالا، پادساعتگرد) به نقطهٔ روی صفحه */
function rayEndpoint(cx: number, cy: number, deg: number, len: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + len * Math.cos(rad), y: cy - len * Math.sin(rad) }
}

function angleFromPoint(cx: number, cy: number, px: number, py: number): number {
  const dx = px - cx
  const dy = -(py - cy)
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI
  return Math.max(0, Math.min(180, Math.round(deg)))
}

function RelationLabel({ relation }: { relation?: AngleParams['relation'] }) {
  const text =
    relation === 'complementary'
      ? 'متمّم: مجموع دو زاویه = ۹۰ درجه'
      : relation === 'supplementary'
        ? 'مکمّل: مجموع دو زاویه = ۱۸۰ درجه'
        : relation === 'vertical'
          ? 'متقابل‌به‌رأس: دو زاویه برابرند'
          : null
  if (!text) return null
  return <p className="text-center text-xs font-bold text-slate-500">{text}</p>
}

function VerticalAnglesDemo({ width, height, referenceAngle = 60 }: { width: number; height: number; referenceAngle?: number }) {
  const cx = width / 2
  const cy = height / 2
  const len = Math.min(width, height) / 2 - 24
  const a = referenceAngle
  const p1 = rayEndpoint(cx, cy, a, len)
  const p2 = rayEndpoint(cx, cy, a + 180, len)
  const p3 = rayEndpoint(cx, cy, 0, len)
  const p4 = rayEndpoint(cx, cy, 180, len)

  return (
    <Group>
      <Line points={[p1.x, p1.y, p2.x, p2.y]} stroke={ANGLE_COLORS.fixedRay} strokeWidth={2.5} />
      <Line points={[p3.x, p3.y, p4.x, p4.y]} stroke={ANGLE_COLORS.fixedRay} strokeWidth={2.5} />

      <Arc x={cx} y={cy} innerRadius={0} outerRadius={44} angle={a} rotation={-a} fill={ANGLE_COLORS.vertical1} opacity={0.35} />
      <Arc x={cx} y={cy} innerRadius={0} outerRadius={44} angle={a} rotation={180 - a} fill={ANGLE_COLORS.vertical1} opacity={0.35} />
      <Arc x={cx} y={cy} innerRadius={0} outerRadius={38} angle={180 - a} rotation={0} fill={ANGLE_COLORS.vertical2} opacity={0.3} />
      <Arc x={cx} y={cy} innerRadius={0} outerRadius={38} angle={180 - a} rotation={180} fill={ANGLE_COLORS.vertical2} opacity={0.3} />

      <Circle x={cx} y={cy} radius={3.5} fill="#0F172A" />
      {(() => {
        const mid1 = rayEndpoint(cx, cy, a / 2, 60)
        const mid2 = rayEndpoint(cx, cy, a / 2 + 180, 60)
        return (
          <>
            <Text x={mid1.x - 18} y={mid1.y - 10} width={36} align="center" text={`${a}°`} fontSize={13} fontStyle="bold" fill={ANGLE_COLORS.vertical1} />
            <Text x={mid2.x - 18} y={mid2.y - 10} width={36} align="center" text={`${a}°`} fontSize={13} fontStyle="bold" fill={ANGLE_COLORS.vertical1} />
          </>
        )
      })()}
    </Group>
  )
}

function AngleBoard({
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
  const title = params.title ?? 'زاویه'
  const cx = width / 2
  const cy = height * 0.78

  const isInteractive = mode === 'interactive' && params.target !== undefined
  const staticAngle = params.angle ?? params.target ?? 60

  const [dragAngle, setDragAngle] = useState(params.startAngle ?? Math.max(0, staticAngle - 30))
  const [locked, setLocked] = useState(false)
  const [mood, setMood] = useState<FaceMood>('neutral')
  const successFired = useRef(false)
  const groupRef = useRef<Konva.Group>(null)
  const { breathScale, blink, eyeOffset } = useLivelyKonva()

  useEffect(() => {
    setDragAngle(params.startAngle ?? Math.max(0, (params.target ?? staticAngle) - 30))
    setLocked(false)
    setMood('neutral')
    successFired.current = false
  }, [params.target, params.startAngle, staticAngle])

  const handleDrag = useCallback(
    (px: number, py: number) => {
      if (locked) return
      setDragAngle(angleFromPoint(cx, cy, px, py))
    },
    [locked, cx, cy]
  )

  const handleDragEnd = useCallback(
    (px: number, py: number) => {
      if (locked || params.target === undefined) return
      const deg = angleFromPoint(cx, cy, px, py)
      if (Math.abs(deg - params.target) <= SUCCESS_TOLERANCE) {
        setDragAngle(params.target)
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
        setDragAngle(deg)
        onWrong?.()
        onSpeak?.('نزدیک‌تر شو — با دقت به عدد روی زاویه نگاه کن.')
        setAnimation?.('Thinking')
      }
    },
    [locked, cx, cy, params.target, onSuccess, onWrong, onSpeak, setAnimation]
  )

  const showAngleValue = isInteractive ? dragAngle : staticAngle
  const p0 = rayEndpoint(cx, cy, 0, RAY_LEN)
  const pFree = rayEndpoint(cx, cy, showAngleValue, RAY_LEN)
  const labelMid = rayEndpoint(cx, cy, showAngleValue / 2, 46)

  return (
    <div className="space-y-3" dir="rtl">
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          {params.showVerticalPair ? (
            <VerticalAnglesDemo width={width} height={height} referenceAngle={params.verticalReferenceAngle ?? staticAngle} />
          ) : (
            <Group>
              <Arc
                x={cx}
                y={cy}
                innerRadius={0}
                outerRadius={44}
                angle={showAngleValue}
                rotation={-showAngleValue}
                fill={locked ? ANGLE_COLORS.correctFill : ANGLE_COLORS.arcFill}
              />
              <Line points={[cx, cy, p0.x, p0.y]} stroke={ANGLE_COLORS.fixedRay} strokeWidth={3} lineCap="round" />

              {params.referenceAngle !== undefined ? (
                <Text
                  x={cx - 90}
                  y={cy + 14}
                  width={180}
                  align="center"
                  text={`زاویهٔ مرجع: ${params.referenceAngle}°`}
                  fontSize={12}
                  fontStyle="bold"
                  fill="#64748B"
                />
              ) : null}

              <Text x={labelMid.x - 22} y={labelMid.y - 10} width={44} align="center" text={`${showAngleValue}°`} fontSize={14} fontStyle="bold" fill={locked ? ANGLE_COLORS.correctArc : ANGLE_COLORS.arc} />

              <Circle x={cx} y={cy} radius={3.5} fill="#0F172A" />

              {isInteractive ? (
                <Group
                  ref={groupRef}
                  x={pFree.x}
                  y={pFree.y}
                  draggable={!locked}
                  dragBoundFunc={(pos) => {
                    const deg = angleFromPoint(cx, cy, pos.x, pos.y)
                    return rayEndpoint(cx, cy, deg, RAY_LEN)
                  }}
                  onDragMove={(e) => handleDrag(e.target.x(), e.target.y())}
                  onDragEnd={(e) => handleDragEnd(e.target.x(), e.target.y())}
                  onMouseEnter={(e) => {
                    if (!locked) e.target.getStage()!.container().style.cursor = 'grab'
                  }}
                  onMouseLeave={(e) => {
                    e.target.getStage()!.container().style.cursor = 'default'
                  }}
                >
                  <Line points={[cx - pFree.x, cy - pFree.y, 0, 0]} stroke={ANGLE_COLORS.freeRay} strokeWidth={3} lineCap="round" />
                  <Group scaleX={breathScale} scaleY={breathScale}>
                    <Circle radius={15} fill={ANGLE_COLORS.freeRay} stroke={ANGLE_COLORS.freeRayStroke} strokeWidth={2} shadowBlur={5} shadowColor="rgba(0,0,0,0.2)" />
                    <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
                  </Group>
                </Group>
              ) : (
                <Line points={[cx, cy, pFree.x, pFree.y]} stroke={ANGLE_COLORS.freeRay} strokeWidth={3} lineCap="round" />
              )}
            </Group>
          )}
        </Layer>
      </KonvaWhiteboard>

      {isInteractive ? (
        <p className="text-center text-sm text-slate-500">
          نقطهٔ بنفش را بکش تا زاویه دقیقاً {params.target}° شود (فعلاً {dragAngle}°)
        </p>
      ) : null}
      <RelationLabel relation={params.relation} />
    </div>
  )
}

/** AngleVisual — رسم و ساخت زاویه با Konva؛ حالت‌ها: demo | static | interactive */
export function AngleVisual(props: MathVisualComponentProps) {
  return <AngleBoard {...props} />
}
