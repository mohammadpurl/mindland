'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type Konva from 'konva'
import { Circle, Group, Layer, Line, Rect, Text } from 'react-konva'
import type { MathVisualComponentProps, PercentBarParams } from '@/lib/math-visual-engine/types'
import { PERCENT_BAR_COLORS } from '@/lib/math-visual-engine/konva-utils'
import { LivelyFace, type FaceMood } from '../shared/LivelyFace'
import { useLivelyKonva } from '../hooks/useLivelyKonva'
import { KonvaWhiteboard } from '../shared/KonvaWhiteboard'

const DEFAULT_W = 560
const DEFAULT_H = 240
const PADDING = 44
const BAR_H = 64
const SUCCESS_TOLERANCE = 2

function parseParams(params: MathVisualComponentProps['params']): PercentBarParams {
  return (params ?? {}) as PercentBarParams
}

function toFa(n: number): string {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)
}

function PercentBarBoard({
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
  const title = params.title ?? 'نوار درصد'
  const barLeft = PADDING
  const barRight = width - PADDING
  const barWidth = barRight - barLeft
  const barY = height * 0.42

  const isInteractive = mode === 'interactive' && params.target !== undefined
  const staticPercent = Math.max(0, Math.min(100, params.percent ?? params.target ?? 50))

  const [percent, setPercent] = useState(
    isInteractive ? Math.max(0, Math.min(100, params.startPercent ?? 0)) : staticPercent
  )
  const [locked, setLocked] = useState(false)
  const [mood, setMood] = useState<FaceMood>('neutral')
  const successFired = useRef(false)
  const groupRef = useRef<Konva.Group>(null)
  const { breathScale, blink, eyeOffset } = useLivelyKonva()

  useEffect(() => {
    setPercent(isInteractive ? Math.max(0, Math.min(100, params.startPercent ?? 0)) : staticPercent)
    setLocked(false)
    setMood('neutral')
    successFired.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, params.target, params.startPercent, staticPercent])

  const percentToX = useCallback((p: number) => barLeft + (p / 100) * barWidth, [barLeft, barWidth])
  const xToPercent = useCallback(
    (x: number) => Math.max(0, Math.min(100, Math.round(((x - barLeft) / barWidth) * 100))),
    [barLeft, barWidth]
  )

  const handleDrag = useCallback(
    (x: number) => {
      if (locked) return
      setPercent(xToPercent(x))
    },
    [locked, xToPercent]
  )

  const handleDragEnd = useCallback(
    (x: number) => {
      if (locked || params.target === undefined) return
      const p = xToPercent(x)
      if (Math.abs(p - params.target) <= SUCCESS_TOLERANCE) {
        setPercent(params.target)
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
        setPercent(p)
        onWrong?.()
        onSpeak?.('دوباره نگاه کن — عدد روی نوار را با هدف مقایسه کن.')
        setAnimation?.('Thinking')
      }
    },
    [locked, xToPercent, params.target, onSuccess, onWrong, onSpeak, setAnimation]
  )

  const fillX = percentToX(percent)
  const fillColor = locked ? PERCENT_BAR_COLORS.correctFill : PERCENT_BAR_COLORS.fill
  const fillStroke = locked ? PERCENT_BAR_COLORS.correctStroke : PERCENT_BAR_COLORS.fillStroke
  const partLabel = params.partLabel ?? `${toFa(percent)}٪`

  return (
    <div className="space-y-3" dir="rtl">
      <KonvaWhiteboard width={width} height={height} title={title}>
        <Layer>
          {params.wholeLabel ? (
            <Text x={0} y={14} width={width} align="center" text={params.wholeLabel} fontSize={13} fontStyle="bold" fill="#334155" />
          ) : null}

          <Rect x={barLeft} y={barY} width={barWidth} height={BAR_H} cornerRadius={14} fill={PERCENT_BAR_COLORS.track} stroke={PERCENT_BAR_COLORS.trackStroke} strokeWidth={2} />
          <Rect
            x={barLeft}
            y={barY}
            width={Math.max(0, fillX - barLeft)}
            height={BAR_H}
            cornerRadius={14}
            fill={fillColor}
            opacity={0.85}
          />

          {[0, 25, 50, 75, 100].map((tick) => {
            const x = percentToX(tick)
            return (
              <Group key={tick}>
                <Line points={[x, barY - 6, x, barY + BAR_H + 6]} stroke={PERCENT_BAR_COLORS.tick} strokeWidth={1.5} opacity={0.6} />
                <Text x={x - 18} y={barY + BAR_H + 10} width={36} align="center" text={`${toFa(tick)}٪`} fontSize={11} fill="#64748B" />
              </Group>
            )
          })}

          <Text
            x={barLeft}
            y={barY + BAR_H / 2 - 9}
            width={Math.max(40, fillX - barLeft)}
            align="center"
            text={partLabel}
            fontSize={16}
            fontStyle="bold"
            fill="#FFFFFF"
          />

          {isInteractive ? (
            <Group
              ref={groupRef}
              x={fillX}
              y={barY + BAR_H / 2}
              draggable={!locked}
              dragBoundFunc={(pos) => ({
                x: Math.max(barLeft, Math.min(barRight, pos.x)),
                y: barY + BAR_H / 2,
              })}
              onDragMove={(e) => handleDrag(e.target.x())}
              onDragEnd={(e) => handleDragEnd(e.target.x())}
              onMouseEnter={(e) => {
                if (!locked) e.target.getStage()!.container().style.cursor = 'grab'
              }}
              onMouseLeave={(e) => {
                e.target.getStage()!.container().style.cursor = 'default'
              }}
            >
              <Group scaleX={breathScale} scaleY={breathScale}>
                <Circle radius={19} fill={PERCENT_BAR_COLORS.handle} stroke={fillStroke} strokeWidth={3} shadowBlur={6} shadowColor="rgba(0,0,0,0.25)" />
                <LivelyFace mood={mood} blink={blink} eyeOffset={eyeOffset} />
              </Group>
            </Group>
          ) : null}
        </Layer>
      </KonvaWhiteboard>

      {isInteractive ? (
        <p className="text-center text-sm text-slate-500">
          دستگیره را بکش تا نوار دقیقاً {toFa(params.target ?? 0)}٪ پر شود (فعلاً {toFa(percent)}٪)
        </p>
      ) : null}
    </div>
  )
}

/** PercentBar — نوار درصد با Konva؛ حالت‌ها: demo | static | interactive */
export function PercentBar(props: MathVisualComponentProps) {
  return <PercentBarBoard {...props} />
}
