'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Circle, Group, Layer, Line, Text } from 'react-konva'
import type {
  MathVisualComponentProps,
  PolygonParams,
  PolygonShapeKind,
  PolygonShapeSpec,
} from '@/lib/math-visual-engine/types'
import {
  GEO_COLORS,
  parallelogramPoints,
  parallelogramSplitTriangles,
  polygonCentroid,
  shapeFill,
  shapeStroke,
  squarePoints,
  trianglePoints,
} from '@/lib/math-visual-engine/geo-utils'
import { KonvaWhiteboard } from '../shared/KonvaWhiteboard'

const DEFAULT_W = 600
const DEFAULT_H = 420

function parseParams(params: MathVisualComponentProps['params']): PolygonParams {
  return (params ?? {}) as PolygonParams
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function ShapeFace({
  mood = 'neutral',
  scale = 1,
}: {
  mood?: PolygonShapeSpec['mood']
  scale?: number
}) {
  const eyeY = mood === 'curious' ? -4 : mood === 'sad' ? 2 : 0
  const mouth =
    mood === 'sad'
      ? { y: 14, open: false, sad: true }
      : mood === 'happy'
        ? { y: 12, open: true, sad: false }
        : { y: 12, open: false, sad: false }

  return (
    <Group scaleX={scale} scaleY={scale}>
      <Circle x={-10} y={eyeY} radius={4} fill="#fff" stroke={GEO_COLORS.face} strokeWidth={1.2} />
      <Circle x={-10} y={eyeY} radius={1.8} fill={GEO_COLORS.face} />
      <Circle x={10} y={eyeY} radius={4} fill="#fff" stroke={GEO_COLORS.face} strokeWidth={1.2} />
      <Circle x={10} y={eyeY} radius={1.8} fill={GEO_COLORS.face} />
      {mouth.open ? (
        <Circle x={0} y={mouth.y} radius={5} fill="#F97316" stroke={GEO_COLORS.face} strokeWidth={1} />
      ) : (
        <Line
          points={mouth.sad ? [-8, mouth.y + 4, 0, mouth.y, 8, mouth.y + 4] : [-8, mouth.y, 8, mouth.y]}
          stroke={GEO_COLORS.face}
          strokeWidth={2}
          lineCap="round"
        />
      )}
    </Group>
  )
}

function DimensionGuides({
  kind,
  cx,
  cy,
  base,
  height,
  skew = 28,
  highlight,
}: {
  kind: PolygonShapeKind
  cx: number
  cy: number
  base: number
  height: number
  skew?: number
  highlight?: PolygonShapeSpec['highlight']
}) {
  const showBase = !highlight || highlight === 'base' || highlight === 'area'
  const showHeight = !highlight || highlight === 'height' || highlight === 'area'
  const baseW = highlight === 'base' || highlight === 'area' ? 3.5 : 2
  const heightW = highlight === 'height' || highlight === 'area' ? 3.5 : 2

  const topY = cy - height / 2
  const baseY = cy + height / 2
  const mark = 9

  /** متوازی‌الاضلاع: ارتفاع از رأس بالا-چپ عمود بر قاعده (مثل کتاب درسی) */
  if (kind === 'parallelogram') {
    const pts = parallelogramPoints(cx, cy, base, height, skew)
    const topLeftX = pts[0]!
    const topLeftY = pts[1]!
    const baseLeftX = pts[6]!
    const baseRightX = pts[4]!
    const footX = topLeftX
    const footY = baseY

    return (
      <Group>
        {showBase ? (
          <>
            <Text
              x={(baseLeftX + baseRightX) / 2 - 20}
              y={baseY + 10}
              width={40}
              text="قاعده"
              fontSize={12}
              fill={GEO_COLORS.base}
              fontStyle="bold"
              align="center"
            />
          </>
        ) : null}
        {showHeight ? (
          <>
            <Line
              points={[footX, topLeftY, footX, footY]}
              stroke={GEO_COLORS.height}
              strokeWidth={heightW}
              dash={[7, 5]}
              lineCap="round"
            />
            {/* علامت قائمه روی قاعده */}
            <Line
              points={[footX, footY - mark, footX + mark, footY - mark, footX + mark, footY]}
              stroke={GEO_COLORS.height}
              strokeWidth={1.75}
            />
            <Text
              x={footX + 10}
              y={(topLeftY + footY) / 2 - 8}
              width={44}
              text="ارتفاع"
              fontSize={12}
              fill={GEO_COLORS.height}
              fontStyle="bold"
              align="left"
            />
          </>
        ) : null}
      </Group>
    )
  }

  /** مثلث / مربع / مستطیل */
  const baseX1 = cx - base / 2
  const baseX2 = cx + base / 2
  const heightX = kind === 'triangle' ? cx : cx - base / 2 + 10

  return (
    <Group>
      {showBase ? (
        <>
          <Line
            points={[baseX1, baseY + 12, baseX2, baseY + 12]}
            stroke={GEO_COLORS.base}
            strokeWidth={baseW}
            lineCap="round"
          />
          <Text
            x={cx - 24}
            y={baseY + 16}
            width={48}
            text="قاعده"
            fontSize={12}
            fill={GEO_COLORS.base}
            fontStyle="bold"
            align="center"
          />
        </>
      ) : null}
      {showHeight ? (
        <>
          <Line
            points={[heightX, baseY, heightX, topY]}
            stroke={GEO_COLORS.height}
            strokeWidth={heightW}
            dash={[6, 4]}
            lineCap="round"
          />
          <Line
            points={[heightX, baseY - mark, heightX + mark, baseY - mark, heightX + mark, baseY]}
            stroke={GEO_COLORS.height}
            strokeWidth={1.5}
          />
          <Text
            x={heightX + 10}
            y={(baseY + topY) / 2 - 8}
            width={40}
            text="ارتفاع"
            fontSize={11}
            fill={GEO_COLORS.height}
            fontStyle="bold"
            align="left"
          />
        </>
      ) : null}
    </Group>
  )
}

/**
 * انیمیشن محوری: متوازی‌الاضلاع → قطر → دو مثلث رنگی → بیرون آمدن یکی
 */
function ParallelogramSplitReveal({
  cx,
  cy,
  baseUnits = 6,
  heightUnits = 4,
  formula,
  canvasWidth,
  canvasHeight,
  animate,
  replayKey,
}: {
  cx: number
  cy: number
  baseUnits?: number
  heightUnits?: number
  formula?: string
  canvasWidth: number
  canvasHeight: number
  animate: boolean
  replayKey: number
}) {
  const base = baseUnits * 26
  const height = heightUnits * 24
  const skew = 28
  const points = useMemo(() => parallelogramPoints(0, 0, base, height, skew), [base, height, skew])
  const split = useMemo(() => parallelogramSplitTriangles(points), [points])
  const leaveCenter = useMemo(() => polygonCentroid(split.leave), [split.leave])
  const stayCenter = useMemo(() => polygonCentroid(split.stay), [split.stay])

  const [t, setT] = useState(animate ? 0 : 1)

  useEffect(() => {
    if (!animate) {
      setT(1)
      return
    }
    setT(0)
    const t0 = performance.now()
    const duration = 5200
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
  }, [animate, base, height, replayKey])

  // فازها واضح‌تر و طولانی‌تر
  const phaseCut = Math.min(1, Math.max(0, (t - 0.12) / 0.18))
  const phaseColor = Math.min(1, Math.max(0, (t - 0.32) / 0.2))
  const phaseLeave = easeOutCubic(Math.min(1, Math.max(0, (t - 0.55) / 0.4)))

  const leaveOffsetX = 155 * phaseLeave
  const leaveOffsetY = -28 * phaseLeave
  const leaveLift = 1 + 0.06 * phaseLeave

  const solidOpacity = Math.max(0, 1 - phaseColor * 1.15)
  const halvesOpacity = phaseColor
  const diagonalOpacity = Math.min(1, phaseCut * 1.2)

  return (
    <Group x={cx} y={cy}>
      {/* جای خالی مثلث بعد از خروج */}
      {phaseLeave > 0.08 ? (
        <Line
          points={split.leave}
          closed
          fill="rgba(245,158,11,0.14)"
          stroke={GEO_COLORS.triangleStroke}
          strokeWidth={2}
          dash={[6, 4]}
          opacity={0.7 * phaseLeave}
        />
      ) : null}

      {/* مثلث باقی‌مانده (آبی) */}
      <Line
        points={split.stay}
        closed
        fill={GEO_COLORS.parallelogram}
        stroke={GEO_COLORS.parallelogramStroke}
        strokeWidth={3}
        opacity={Math.max(0.05, halvesOpacity)}
      />
      {halvesOpacity > 0.4 ? (
        <Group x={stayCenter.x} y={stayCenter.y} opacity={halvesOpacity}>
          <ShapeFace mood="happy" scale={0.72} />
        </Group>
      ) : null}
      {phaseLeave > 0.25 ? (
        <Text
          x={stayCenter.x - 44}
          y={height / 2 + 18}
          width={88}
          text="مثلث ۲"
          fontSize={14}
          fill={GEO_COLORS.parallelogramStroke}
          fontStyle="bold"
          align="center"
          opacity={phaseLeave}
        />
      ) : null}

      {/* مثلث بیرون‌آمده (نارنجی) — روی بقیه تا دیده شود */}
      <Group x={leaveOffsetX} y={leaveOffsetY} scaleX={leaveLift} scaleY={leaveLift}>
        <Line
          points={split.leave}
          closed
          fill={GEO_COLORS.triangle}
          stroke={GEO_COLORS.triangleStroke}
          strokeWidth={3.5}
          opacity={Math.max(0.05, halvesOpacity)}
          shadowBlur={phaseLeave > 0.1 ? 14 : 0}
          shadowColor="rgba(180,83,9,0.35)"
        />
        {halvesOpacity > 0.35 ? (
          <Group x={leaveCenter.x} y={leaveCenter.y} opacity={halvesOpacity}>
            <ShapeFace mood={phaseLeave > 0.4 ? 'happy' : 'curious'} scale={0.85} />
          </Group>
        ) : null}
        {phaseLeave > 0.2 ? (
          <Text
            x={leaveCenter.x - 44}
            y={leaveCenter.y + 36}
            width={88}
            text="مثلث ۱"
            fontSize={14}
            fill={GEO_COLORS.triangleStroke}
            fontStyle="bold"
            align="center"
            opacity={phaseLeave}
          />
        ) : null}
      </Group>

      {/* شکل یکدست اولیه — محو می‌شود */}
      <Line
        points={points}
        closed
        fill={GEO_COLORS.parallelogram}
        stroke={GEO_COLORS.parallelogramStroke}
        strokeWidth={3}
        opacity={0.95 * solidOpacity}
        listening={false}
      />
      {solidOpacity > 0.4 ? (
        <Group opacity={solidOpacity} listening={false}>
          <ShapeFace mood="happy" scale={0.95} />
        </Group>
      ) : null}

      {/* قطر برش */}
      <Line
        points={split.diagonal}
        stroke="#475569"
        strokeWidth={3}
        dash={[10, 6]}
        opacity={diagonalOpacity}
        lineCap="round"
      />

      {phaseLeave > 0.45 ? (
        <Text
          x={-canvasWidth / 2 + 20}
          y={-canvasHeight / 2 + 14}
          width={canvasWidth - 40}
          text="متوازی‌الاضلاع = دو مثلث هم‌اندازه"
          fontSize={15}
          fill="#0F172A"
          fontStyle="bold"
          align="center"
          opacity={Math.min(1, (phaseLeave - 0.45) / 0.25)}
        />
      ) : null}

      {formula ? (
        <Text
          x={-canvasWidth / 2 + 40}
          y={canvasHeight / 2 - 34}
          width={canvasWidth - 80}
          text={formula}
          fontSize={15}
          fill="#0F172A"
          fontStyle="bold"
          align="center"
        />
      ) : null}
    </Group>
  )
}

function DrawnShape({
  spec,
  cx,
  cy,
  showDimensions,
  showSplit,
  breath,
}: {
  spec: PolygonShapeSpec
  cx: number
  cy: number
  showDimensions?: boolean
  showSplit?: boolean
  breath: number
}) {
  const isCircle = spec.kind === 'circle'
  const base = (spec.base ?? 5) * 28
  const height = (spec.height ?? 4) * 26
  const radiusPx = (spec.radius ?? 3) * 27
  const fill = shapeFill(spec.kind)
  const stroke = shapeStroke(spec.kind)

  let points: number[] = []
  if (spec.kind === 'triangle') {
    points = trianglePoints(0, 0, base, height)
  } else if (spec.kind === 'square') {
    const size = Math.min(base, height)
    points = squarePoints(0, 0, size)
  } else if (spec.kind === 'parallelogram' || spec.kind === 'rectangle') {
    points = parallelogramPoints(0, 0, base, height)
  }

  const split =
    showSplit && spec.kind === 'parallelogram' ? parallelogramSplitTriangles(points) : null

  const labelY = isCircle ? radiusPx + (showDimensions ? 30 : 16) : height / 2 + (showDimensions ? 44 : 28)

  return (
    <Group x={cx} y={cy} scaleX={breath} scaleY={breath}>
      {isCircle ? (
        <Circle
          radius={radiusPx}
          fill={fill}
          stroke={stroke}
          strokeWidth={3}
          opacity={0.92}
          shadowBlur={8}
          shadowColor="rgba(0,0,0,0.12)"
        />
      ) : split ? (
        <>
          <Line
            points={split.stay}
            closed
            fill={GEO_COLORS.parallelogram}
            stroke={GEO_COLORS.parallelogramStroke}
            strokeWidth={3}
            opacity={0.9}
          />
          <Line
            points={split.leave}
            closed
            fill={GEO_COLORS.triangle}
            stroke={GEO_COLORS.triangleStroke}
            strokeWidth={3}
            opacity={0.9}
          />
          <Line
            points={split.diagonal}
            stroke={GEO_COLORS.split}
            strokeWidth={2}
            dash={[7, 5]}
          />
        </>
      ) : (
        <Line
          points={points}
          closed
          fill={fill}
          stroke={stroke}
          strokeWidth={3}
          opacity={0.92}
          shadowBlur={8}
          shadowColor="rgba(0,0,0,0.12)"
        />
      )}
      <ShapeFace mood={spec.mood ?? 'happy'} scale={spec.kind === 'triangle' ? 0.95 : isCircle ? 0.85 : 1} />
      {isCircle && showDimensions ? (
        <>
          <Line points={[0, 0, radiusPx, 0]} stroke={GEO_COLORS.radius} strokeWidth={2.5} dash={[6, 4]} />
          <Circle x={radiusPx} y={0} radius={3.5} fill={GEO_COLORS.radius} />
          <Text x={radiusPx / 2 - 22} y={-20} width={44} text="شعاع" fontSize={11} fill={GEO_COLORS.radius} fontStyle="bold" align="center" />
        </>
      ) : null}
      {spec.label ? (
        <Text
          x={-70}
          y={labelY}
          width={140}
          text={spec.label}
          fontSize={14}
          fill="#334155"
          fontStyle="bold"
          align="center"
        />
      ) : null}
      {showDimensions && !isCircle ? (
        <DimensionGuides
          kind={spec.kind}
          cx={0}
          cy={0}
          base={base}
          height={height}
          highlight={spec.highlight}
        />
      ) : null}
    </Group>
  )
}

/**
 * PolygonVisual — همان روال ویژوال‌های درس (وایت‌برد + orchestrator)
 */
export function PolygonVisual({
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
  const shapes = params.shapes?.length
    ? params.shapes
    : [{ kind: 'triangle' as const, label: 'مثلث', mood: 'curious' as const }]
  const title = params.title ?? 'هندسه'
  const quiz = params.quiz
  const isQuiz = mode === 'interactive' && Boolean(quiz)
  const splitReveal = Boolean(params.splitReveal) || (mode === 'demo' && params.showTriangleSplit)
  const animateReveal =
    typeof params.splitReveal === 'object' ? params.splitReveal.animate !== false : mode !== 'static'

  const [choice, setChoice] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)
  const [breath, setBreath] = useState(1)
  const [replayKey, setReplayKey] = useState(0)
  const successFired = useRef(false)

  useEffect(() => {
    if (splitReveal) return
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      setBreath(1 + Math.sin(((now - t0) / 1000) * 2) * 0.018)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [splitReveal])

  useEffect(() => {
    setChoice(null)
    setLocked(false)
    successFired.current = false
    setReplayKey(0)
  }, [quiz?.answerIndex, quiz?.kind, title, splitReveal])

  const handlePick = useCallback(
    (index: number) => {
      if (!quiz || locked) return
      setChoice(index)
      if (index === quiz.answerIndex) {
        setLocked(true)
        if (!successFired.current) {
          successFired.current = true
          onSuccess?.()
          if (!onSuccess) {
            onSpeak?.('آفرین! درست بود!')
            setAnimation?.('ThumbsUp')
          }
        }
      } else {
        onWrong?.()
        onSpeak?.('دوباره فکر کن!')
        setAnimation?.('Thinking')
        setTimeout(() => setChoice(null), 700)
      }
    },
    [quiz, locked, onSuccess, onSpeak, setAnimation, onWrong]
  )

  const paraSpec = shapes.find((s) => s.kind === 'parallelogram') ?? shapes[0]
  const layout =
    shapes.length === 1
      ? [{ cx: width / 2, cy: height / 2 - 10 }]
      : [
          { cx: width * 0.28, cy: height / 2 - 10 },
          { cx: width * 0.72, cy: height / 2 - 10 },
        ]

  return (
    <div className="space-y-3" dir="rtl">
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          {splitReveal ? (
            <ParallelogramSplitReveal
              key={`split-${replayKey}-${title}`}
              cx={width / 2 - 40}
              cy={height / 2 - 8}
              baseUnits={paraSpec?.base ?? 6}
              heightUnits={paraSpec?.height ?? 4}
              formula={params.formula}
              canvasWidth={width}
              canvasHeight={height}
              animate={animateReveal}
              replayKey={replayKey}
            />
          ) : (
            <>
              {shapes.map((spec, i) => {
                const pos = layout[i] ?? layout[0]!
                return (
                  <DrawnShape
                    key={`${spec.kind}-${i}`}
                    spec={spec}
                    cx={pos.cx}
                    cy={pos.cy}
                    showDimensions={params.showDimensions}
                    showSplit={params.showTriangleSplit && spec.kind === 'parallelogram'}
                    breath={breath}
                  />
                )
              })}
              {params.formula ? (
                <Text
                  x={40}
                  y={height - 48}
                  width={width - 80}
                  text={params.formula}
                  fontSize={16}
                  fill="#0F172A"
                  fontStyle="bold"
                  align="center"
                />
              ) : null}
            </>
          )}
        </Layer>
      </KonvaWhiteboard>

      {splitReveal ? (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition"
            onClick={() => setReplayKey((k) => k + 1)}
          >
            پخش دوبارهٔ انیمیشن
          </button>
        </div>
      ) : null}

      {isQuiz && quiz ? (
        <div className="space-y-2">
          {quiz.prompt ? (
            <p className="text-center text-sm text-slate-600 font-medium">{quiz.prompt}</p>
          ) : null}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {quiz.options.map((opt, index) => {
              const selected = choice === index
              const correct = locked && index === quiz.answerIndex
              let cls =
                'min-w-[10rem] rounded-2xl px-4 py-3 text-sm font-bold border-2 transition disabled:opacity-50 '
              if (correct) cls += 'border-emerald-500 bg-emerald-50 text-emerald-800'
              else if (selected && !locked) cls += 'border-rose-400 bg-rose-50 text-rose-800'
              else cls += 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'

              return (
                <button
                  key={opt}
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
        </div>
      ) : null}
    </div>
  )
}
