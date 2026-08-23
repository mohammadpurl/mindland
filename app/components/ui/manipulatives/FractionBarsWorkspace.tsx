'use client'

import { useMemo } from 'react'
import { Group, Line, Rect, Text } from 'react-konva'
import { DEFAULT_TRAY_HEIGHT, Workspace } from './Workspace'
import type { PieceTemplate, WorkspacePiece } from '@/lib/manipulatives/types'

interface BarData extends Record<string, unknown> {
  denominator: number
}

/** طول «کامل» (۱) روی بوم — همه‌چیز نسبت به همین طول مقایسه می‌شود */
const WHOLE_WIDTH = 480
const BAR_HEIGHT = 40
const REF_X = 40
/** مختصات‌ها نسبت‌به‌بومند (زیر قفسه)؛ Workspace خودش قفسه را جدا اضافه می‌کند */
const REF_Y = 26
const ROW_START_X = REF_X
const ROW_START_Y = REF_Y + 76
const ROW_HEIGHT = 54
const ROW_COUNT = 6
const SNAP_DIST = 16

const DENOMINATORS = [2, 3, 4, 5, 6, 8, 10, 12]

/** یک رنگ برای هر مخرج — اینجا رنگ کمک تشخیص «واحد» است، برخلاف FractionCircle که عمداً یک‌رنگ بود */
const BAR_COLORS: Record<number, { fill: string; stroke: string }> = {
  2: { fill: '#F87171', stroke: '#B91C1C' },
  3: { fill: '#FB923C', stroke: '#C2410C' },
  4: { fill: '#FBBF24', stroke: '#B45309' },
  5: { fill: '#A3E635', stroke: '#4D7C0F' },
  6: { fill: '#34D399', stroke: '#047857' },
  8: { fill: '#22D3EE', stroke: '#0E7490' },
  10: { fill: '#818CF8', stroke: '#4338CA' },
  12: { fill: '#F472B6', stroke: '#BE185D' },
}

function barWidth(denominator: number): number {
  return WHOLE_WIDTH / denominator
}

function templates(): PieceTemplate<BarData>[] {
  return DENOMINATORS.map((d) => ({
    templateId: `bar-${d}`,
    label: `۱/${d}`,
    data: { denominator: d },
  }))
}

/**
 * snap مخصوص کاشی کسر: y روی نزدیک‌ترین ردیف قفل می‌شود؛ x یا به شروع ردیف
 * می‌چسبد یا به لبهٔ کاشی مجاور در همان ردیف — دقیقاً رفتاری که کاشی‌های
 * واقعی کسر (Cuisenaire-style) دارند. مقادیر y مطلقِ صحنه‌اند (شامل قفسه)
 * چون Workspace مختصات قطعات را مطلق نگه می‌دارد.
 */
function snapBar(
  x: number,
  y: number,
  piece: WorkspacePiece<BarData>,
  others: WorkspacePiece<BarData>[]
): { x: number; y: number } {
  const pieceW = barWidth(piece.data.denominator)
  const rowStartYAbs = DEFAULT_TRAY_HEIGHT + ROW_START_Y

  let row = Math.round((y + BAR_HEIGHT / 2 - rowStartYAbs) / ROW_HEIGHT)
  row = Math.max(0, Math.min(ROW_COUNT - 1, row))
  const snappedY = rowStartYAbs + row * ROW_HEIGHT - BAR_HEIGHT / 2

  const sameRow = others.filter((o) => Math.abs(o.y - snappedY) < 6)

  const rowStartXAbs = ROW_START_X
  let snappedX = x
  if (Math.abs(x - rowStartXAbs) < SNAP_DIST) {
    snappedX = rowStartXAbs
  } else {
    for (const o of sameRow) {
      const oW = barWidth(o.data.denominator)
      const rightEdge = o.x + oW
      const leftEdge = o.x - pieceW
      if (Math.abs(x - rightEdge) < SNAP_DIST) {
        snappedX = rightEdge
        break
      }
      if (Math.abs(x - leftEdge) < SNAP_DIST) {
        snappedX = leftEdge
        break
      }
    }
  }

  return { x: snappedX, y: snappedY }
}

function BarShape({
  denominator,
  width,
  height = BAR_HEIGHT,
  showLabel = true,
}: {
  denominator: number
  width: number
  height?: number
  showLabel?: boolean
}) {
  const colors = BAR_COLORS[denominator] ?? BAR_COLORS[2]!
  return (
    <Group>
      <Rect
        width={width}
        height={height}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={2}
        cornerRadius={5}
        shadowBlur={3}
        shadowColor="rgba(0,0,0,0.15)"
      />
      {showLabel ? (
        <Text
          width={width}
          height={height}
          text={`۱/${denominator}`}
          fontSize={width < 34 ? 9 : 13}
          fontStyle="bold"
          fill="#1f2937"
          align="center"
          verticalAlign="middle"
        />
      ) : null}
    </Group>
  )
}

/** راهنمای ثابت: نوار «۱ کامل» بالای بوم + خطوط ردیف زیرش — هر دو نسبت‌به‌بوم (لوکال) */
function FractionBarsGuide() {
  const rows = Array.from({ length: ROW_COUNT }, (_, i) => ROW_START_Y + i * ROW_HEIGHT)
  return (
    <Group listening={false}>
      <Rect
        x={REF_X}
        y={REF_Y}
        width={WHOLE_WIDTH}
        height={BAR_HEIGHT}
        fill="#F1F5F2"
        stroke="#94A3B8"
        strokeWidth={2}
        dash={[6, 4]}
        cornerRadius={5}
      />
      <Text
        x={REF_X}
        y={REF_Y + BAR_HEIGHT / 2 - 8}
        width={WHOLE_WIDTH}
        align="center"
        text="۱ کامل"
        fontSize={13}
        fontStyle="bold"
        fill="#475569"
      />
      {rows.map((y) => (
        <Line
          key={y}
          points={[ROW_START_X, y + BAR_HEIGHT, ROW_START_X + WHOLE_WIDTH, y + BAR_HEIGHT]}
          stroke="#E5E7DA"
          strokeWidth={1}
          dash={[3, 5]}
        />
      ))}
    </Group>
  )
}

export interface FractionBarsWorkspaceProps {
  width?: number
  height?: number
}

/**
 * فضای کار آزاد کاشی‌های کسر — جایگزین بخش «کشیدن به هدف ثابت» در FractionCircle.
 * اینجا هیچ هدفی از پیش تعیین نشده؛ کودک آزاد است هر تعداد کاشی از هر مخرج بردارد
 * و زیر نوار «کامل» بچیند تا خودش هم‌ارزی و مقایسه را کشف کند — مثلاً دو کاشی ۱/۴
 * را کنار هم بگذارد و ببیند دقیقاً به‌اندازهٔ یک کاشی ۱/۲ است.
 */
export function FractionBarsWorkspace({ width = 600, height = 480 }: FractionBarsWorkspaceProps) {
  const tpls = useMemo(templates, [])

  return (
    <Workspace<BarData>
      width={width}
      height={height}
      trayHeight={DEFAULT_TRAY_HEIGHT}
      title="کاشی‌های کسر"
      hint="از قفسه بکش، زیر نوار کامل بچین"
      templates={tpls}
      sizeOf={(data) => ({ width: barWidth(data.denominator), height: BAR_HEIGHT })}
      snap={snapBar}
      renderCanvasGuide={() => <FractionBarsGuide />}
      renderTemplatePreview={(t) => (
        <Group x={-24} y={-16}>
          <BarShape denominator={t.data.denominator} width={48} height={32} />
        </Group>
      )}
      renderPiece={(piece, state) => (
        <Group
          opacity={state.dragging ? 0.85 : 1}
          scaleX={state.dragging ? 1.03 : 1}
          scaleY={state.dragging ? 1.03 : 1}
        >
          <BarShape denominator={piece.data.denominator} width={barWidth(piece.data.denominator)} />
        </Group>
      )}
    />
  )
}
