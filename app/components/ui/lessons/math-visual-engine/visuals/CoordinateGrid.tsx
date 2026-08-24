'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Konva from 'konva'
import KonvaLib from 'konva'
import { Arrow, Circle, Group, Layer, Line, Text } from 'react-konva'
import type {
  CoordinateGridParams,
  CoordinatePoint,
  MathVisualComponentProps,
  ReflectionAxis,
  RotationAngle,
} from '@/lib/math-visual-engine/types'
import { COORDINATE_COLORS } from '@/lib/math-visual-engine/konva-utils'
import { useLivelyKonva } from '../hooks/useLivelyKonva'
import { KonvaWhiteboard } from '../shared/KonvaWhiteboard'
import { LivelyFace, type FaceMood } from '../shared/LivelyFace'

const DEFAULT_SIZE = 520
const PADDING = 40

function parseParams(params: MathVisualComponentProps['params']): CoordinateGridParams {
  return (params ?? {}) as CoordinateGridParams
}

function reflectPoint(p: { x: number; y: number }, axis: ReflectionAxis): { x: number; y: number } {
  return axis === 'x' ? { x: p.x, y: -p.y } : { x: -p.x, y: p.y }
}

function rotatePoint(p: { x: number; y: number }, angle: RotationAngle): { x: number; y: number } {
  if (angle === 90) return { x: -p.y, y: p.x }
  if (angle === 180) return { x: -p.x, y: -p.y }
  return { x: p.y, y: -p.x }
}

/** بازهٔ نمایش را از پارامترها استنتاج می‌کند اگر range ندهند */
function inferRange(params: CoordinateGridParams): number {
  if (params.range !== undefined) return params.range
  const vals: number[] = [1]
  params.points?.forEach((p) => vals.push(Math.abs(p.x), Math.abs(p.y)))
  if (params.target) vals.push(Math.abs(params.target.x), Math.abs(params.target.y))
  if (params.startPoint) vals.push(Math.abs(params.startPoint.x), Math.abs(params.startPoint.y))
  if (params.reflect) {
    vals.push(Math.abs(params.reflect.point.x), Math.abs(params.reflect.point.y))
    const r = reflectPoint(params.reflect.point, params.reflect.axis)
    vals.push(Math.abs(r.x), Math.abs(r.y))
  }
  if (params.rotate) {
    vals.push(Math.abs(params.rotate.point.x), Math.abs(params.rotate.point.y))
    const r = rotatePoint(params.rotate.point, params.rotate.angle)
    vals.push(Math.abs(r.x), Math.abs(r.y))
  }
  const max = Math.max(...vals)
  return Math.max(4, Math.ceil(max) + 1)
}

function AxesAndGrid({
  range,
  toPx,
  size,
}: {
  range: number
  toPx: (x: number, y: number) => { px: number; py: number }
  size: number
}) {
  const ticks = useMemo(() => {
    const arr: number[] = []
    for (let v = -range; v <= range; v += 1) arr.push(v)
    return arr
  }, [range])

  const origin = toPx(0, 0)
  const xStart = toPx(-range, 0)
  const xEnd = toPx(range, 0)
  const yStart = toPx(0, -range)
  const yEnd = toPx(0, range)

  return (
    <Group>
      {ticks.map((v) => {
        const vx = toPx(v, 0)
        const vy = toPx(0, v)
        return (
          <Group key={v}>
            <Line points={[vx.px, PADDING, vx.px, size - PADDING]} stroke={COORDINATE_COLORS.grid} strokeWidth={1} />
            <Line points={[PADDING, vy.py, size - PADDING, vy.py]} stroke={COORDINATE_COLORS.grid} strokeWidth={1} />
          </Group>
        )
      })}

      <Arrow
        points={[xStart.px, origin.py, xEnd.px + 14, origin.py]}
        stroke={COORDINATE_COLORS.axis}
        fill={COORDINATE_COLORS.axis}
        strokeWidth={2}
        pointerLength={8}
        pointerWidth={8}
      />
      <Arrow
        points={[origin.px, yStart.py + 14, origin.px, yEnd.py - 14]}
        stroke={COORDINATE_COLORS.axis}
        fill={COORDINATE_COLORS.axis}
        strokeWidth={2}
        pointerLength={8}
        pointerWidth={8}
      />

      {ticks
        .filter((v) => v !== 0)
        .map((v) => {
          const vx = toPx(v, 0)
          const vy = toPx(0, v)
          return (
            <Group key={`label-${v}`}>
              <Text x={vx.px - 10} y={origin.py + 6} width={20} text={String(v)} fontSize={11} fill="#64748B" align="center" />
              <Text x={origin.px + 6} y={vy.py - 6} width={20} text={String(v)} fontSize={11} fill="#64748B" align="right" />
            </Group>
          )
        })}

      <Circle x={origin.px} y={origin.py} radius={3} fill={COORDINATE_COLORS.originDot} />
      <Text x={origin.px + 6} y={origin.py + 6} text="مبدأ (۰,۰)" fontSize={11} fontStyle="bold" fill="#334155" />
    </Group>
  )
}

function FixedPoint({
  px,
  py,
  label,
  color = COORDINATE_COLORS.fixedPoint,
  stroke = COORDINATE_COLORS.fixedPointStroke,
  mood = 'neutral',
}: {
  px: number
  py: number
  label?: string
  color?: string
  stroke?: string
  mood?: FaceMood
}) {
  const { breathScale, blink, eyeOffset } = useLivelyKonva()
  return (
    <Group x={px} y={py} scaleX={breathScale} scaleY={breathScale}>
      <Circle radius={15} fill={color} stroke={stroke} strokeWidth={2} shadowBlur={5} shadowColor="rgba(0,0,0,0.15)" />
      <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
      {label ? (
        <Text x={-40} y={-38} width={80} text={label} fontSize={12} fill="#334155" fontStyle="bold" align="center" />
      ) : null}
    </Group>
  )
}

function DraggableToken({
  startPx,
  startPy,
  minPx,
  maxPx,
  minPy,
  maxPy,
  mood,
  onDragEnd,
  disabled,
}: {
  startPx: number
  startPy: number
  minPx: number
  maxPx: number
  minPy: number
  maxPy: number
  mood: FaceMood
  onDragEnd: (px: number, py: number) => void
  disabled?: boolean
}) {
  const groupRef = useRef<Konva.Group>(null)
  const { breathScale, blink, eyeOffset } = useLivelyKonva()

  useEffect(() => {
    const node = groupRef.current
    if (!node) return
    node.to({ x: startPx, y: startPy, duration: 0.2, easing: KonvaLib.Easings.EaseOut })
  }, [startPx, startPy])

  return (
    <Group
      ref={groupRef}
      x={startPx}
      y={startPy}
      draggable={!disabled}
      dragBoundFunc={(pos) => ({
        x: Math.min(maxPx, Math.max(minPx, pos.x)),
        y: Math.min(maxPy, Math.max(minPy, pos.y)),
      })}
      onDragEnd={(e) => {
        if (disabled) return
        onDragEnd(e.target.x(), e.target.y())
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
      <Circle radius={16} fill={COORDINATE_COLORS.token} stroke={COORDINATE_COLORS.tokenStroke} strokeWidth={2} shadowBlur={6} shadowColor="rgba(0,0,0,0.2)" />
      <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
    </Group>
  )
}

function CoordinateGridBoard({
  mode,
  params: rawParams,
  width = DEFAULT_SIZE,
  height = DEFAULT_SIZE,
  onSpeak,
  setAnimation,
  onSuccess,
  onWrong,
}: MathVisualComponentProps) {
  const params = parseParams(rawParams)
  const title = params.title ?? 'صفحهٔ مختصات'
  const range = useMemo(() => inferRange(params), [params])
  const size = Math.min(width, height)
  const scale = (size - PADDING * 2) / (range * 2)

  const toPx = useCallback(
    (x: number, y: number) => ({ px: size / 2 + x * scale, py: size / 2 - y * scale }),
    [size, scale]
  )
  const fromPx = useCallback(
    (px: number, py: number) => ({ x: (px - size / 2) / scale, y: (size / 2 - py) / scale }),
    [size, scale]
  )

  const isReflectPractice = mode === 'interactive' && Boolean(params.reflect)
  const isRotatePractice = mode === 'interactive' && !params.reflect && Boolean(params.rotate)
  const isPlainPlacement = mode === 'interactive' && !params.reflect && !params.rotate && Boolean(params.target)

  const [mood, setMood] = useState<FaceMood>('neutral')
  const [locked, setLocked] = useState(false)
  const successFired = useRef(false)

  useEffect(() => {
    setMood('neutral')
    setLocked(false)
    successFired.current = false
  }, [mode, params.target?.x, params.target?.y, params.reflect, params.rotate])

  const targetPoint = useMemo(() => {
    if (params.target) return params.target
    if (params.reflect) return reflectPoint(params.reflect.point, params.reflect.axis)
    if (params.rotate) return rotatePoint(params.rotate.point, params.rotate.angle)
    return null
  }, [params.target, params.reflect, params.rotate])

  const startPoint = params.startPoint ?? { x: 0, y: 0 }
  const startPx = toPx(startPoint.x, startPoint.y)
  const gridMinPx = toPx(-range, range)
  const gridMaxPx = toPx(range, -range)

  const handleDrop = useCallback(
    (px: number, py: number) => {
      if (locked || !targetPoint) return
      const raw = fromPx(px, py)
      const snapped = { x: Math.round(raw.x), y: Math.round(raw.y) }
      if (snapped.x === targetPoint.x && snapped.y === targetPoint.y) {
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
        onSpeak?.('دوباره نگاه کن — مختصات درست کجاست؟')
        setAnimation?.('Thinking')
        setTimeout(() => setMood('neutral'), 700)
      }
    },
    [locked, targetPoint, fromPx, onSuccess, onSpeak, setAnimation, onWrong]
  )

  const fixedRefPoint = params.reflect?.point ?? params.rotate?.point ?? null
  const mirrorAxis = params.reflect?.axis

  return (
    <div className="space-y-3" dir="rtl">
      <KonvaWhiteboard width={size} height={size} title={title}>
        <Layer>
          <AxesAndGrid range={range} toPx={toPx} size={size} />

          {mirrorAxis ? (
            mirrorAxis === 'x' ? (
              <Line points={[PADDING, toPx(0, 0).py, size - PADDING, toPx(0, 0).py]} stroke={COORDINATE_COLORS.mirrorLine} strokeWidth={2.5} dash={[8, 6]} opacity={0.7} />
            ) : (
              <Line points={[toPx(0, 0).px, PADDING, toPx(0, 0).px, size - PADDING]} stroke={COORDINATE_COLORS.mirrorLine} strokeWidth={2.5} dash={[8, 6]} opacity={0.7} />
            )
          ) : null}

          {(mode === 'demo' || mode === 'static') && !fixedRefPoint
            ? (params.points ?? []).map((p: CoordinatePoint, i) => {
                const pos = toPx(p.x, p.y)
                return (
                  <FixedPoint
                    key={`${p.x}-${p.y}-${i}`}
                    px={pos.px}
                    py={pos.py}
                    label={p.label ?? `(${p.x}, ${p.y})`}
                    color={p.color ?? COORDINATE_COLORS.token}
                    stroke={COORDINATE_COLORS.tokenStroke}
                  />
                )
              })
            : null}

          {fixedRefPoint ? (
            <FixedPoint
              px={toPx(fixedRefPoint.x, fixedRefPoint.y).px}
              py={toPx(fixedRefPoint.x, fixedRefPoint.y).py}
              label={`A (${fixedRefPoint.x}, ${fixedRefPoint.y})`}
              mood="neutral"
            />
          ) : null}

          {(mode === 'demo' || mode === 'static') && fixedRefPoint && targetPoint ? (
            <FixedPoint
              px={toPx(targetPoint.x, targetPoint.y).px}
              py={toPx(targetPoint.x, targetPoint.y).py}
              label={`B (${targetPoint.x}, ${targetPoint.y})`}
              color={COORDINATE_COLORS.target}
              stroke={COORDINATE_COLORS.targetStroke}
              mood="happy"
            />
          ) : null}

          {isPlainPlacement || isReflectPractice || isRotatePractice ? (
            <>
              {targetPoint ? (
                <Group x={toPx(targetPoint.x, targetPoint.y).px} y={toPx(targetPoint.x, targetPoint.y).py}>
                  <Circle radius={18} stroke={COORDINATE_COLORS.target} strokeWidth={2} dash={[4, 4]} opacity={0.6} />
                </Group>
              ) : null}
              <DraggableToken
                startPx={startPx.px}
                startPy={startPx.py}
                minPx={gridMinPx.px}
                maxPx={gridMaxPx.px}
                minPy={gridMinPx.py}
                maxPy={gridMaxPx.py}
                mood={mood}
                disabled={locked}
                onDragEnd={handleDrop}
              />
            </>
          ) : null}
        </Layer>
      </KonvaWhiteboard>

      {isPlainPlacement ? (
        <p className="text-center text-sm text-slate-500">
          نشانگر بنفش را بکش و روی نقطه‌ی هدف ({targetPoint?.x}, {targetPoint?.y}) رها کن
        </p>
      ) : null}
      {isReflectPractice ? (
        <p className="text-center text-sm text-slate-500">
          نشانگر بنفش را روی تصویر آینه‌ای نقطه‌ی A حول محور {mirrorAxis === 'x' ? 'x' : 'y'} رها کن
        </p>
      ) : null}
      {isRotatePractice ? (
        <p className="text-center text-sm text-slate-500">
          نشانگر بنفش را روی جای نقطه‌ی A بعد از {params.rotate?.angle} درجه دوران حول مبدأ رها کن
        </p>
      ) : null}
    </div>
  )
}

/** CoordinateGrid — صفحهٔ مختصات با Konva؛ رسم نقطه، تقارن، دوران — حالت‌ها: demo | static | interactive */
export function CoordinateGrid(props: MathVisualComponentProps) {
  return <CoordinateGridBoard {...props} />
}
