'use client'

import { useCallback, useRef, useState, type ReactNode } from 'react'
import type Konva from 'konva'
import { Group, Layer, Line, Rect, Stage, Text } from 'react-konva'
import { gridLines } from '@/lib/math-visual-engine/konva-utils'
import type { PieceSize, PieceTemplate, WorkspacePiece } from '@/lib/manipulatives/types'

/** ارتفاع پیش‌فرض نوار قفسه — ابزارهای تعاملی برای محاسبهٔ snap مطلق باید همین را وارد کنند */
export const DEFAULT_TRAY_HEIGHT = 92

let pieceCounter = 0
function nextPieceId(templateId: string): string {
  pieceCounter += 1
  return `${templateId}-${pieceCounter}-${Date.now().toString(36)}`
}

export interface WorkspaceProps<TData extends Record<string, unknown>> {
  width: number
  height: number
  /** ارتفاع نوار قفسه در بالای بوم — قفسه = منبع بی‌نهایت قطعه، نه یک تک‌قطعه که تمام شود */
  trayHeight?: number
  title?: string
  hint?: string
  templates: PieceTemplate<TData>[]
  initialPieces?: WorkspacePiece<TData>[]
  onPiecesChange?: (pieces: WorkspacePiece<TData>[]) => void
  renderPiece: (piece: WorkspacePiece<TData>, state: { dragging: boolean }) => ReactNode
  renderTemplatePreview: (template: PieceTemplate<TData>) => ReactNode
  /** راهنمای ثابت زمینهٔ بوم (مثل نوار «کامل» در کاشی کسر) — زیر قطعات، بدون تعامل */
  renderCanvasGuide?: () => ReactNode
  sizeOf: (data: TData) => PieceSize
  /** قطعه‌محورترین بخش هر ابزار: قفل‌شدن روی ردیف/لبهٔ قطعهٔ مجاور و… — هر ابزار منطق خودش را می‌دهد */
  snap?: (
    x: number,
    y: number,
    piece: WorkspacePiece<TData>,
    others: WorkspacePiece<TData>[]
  ) => { x: number; y: number }
}

/**
 * فضای کار عمومی: یک قفسهٔ بی‌نهایت‌قطعه بالا + یک بوم آزاد پایین.
 * کشیدن از قفسه به بوم = ساخت قطعهٔ تازه. کشیدن قطعهٔ روی بوم به سمت قفسه = حذف آن.
 * هر ابزار تعاملی (کسر، خط اعداد، بلوک پایه‌ده، …) فقط باید renderPiece/snap خودش را بدهد.
 */
export function Workspace<TData extends Record<string, unknown>>({
  width,
  height,
  trayHeight = DEFAULT_TRAY_HEIGHT,
  title,
  hint,
  templates,
  initialPieces,
  onPiecesChange,
  renderPiece,
  renderTemplatePreview,
  renderCanvasGuide,
  sizeOf,
  snap,
}: WorkspaceProps<TData>) {
  const [pieces, setPieces] = useState<WorkspacePiece<TData>[]>(initialPieces ?? [])
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null)

  const updatePieces = useCallback(
    (updater: (prev: WorkspacePiece<TData>[]) => WorkspacePiece<TData>[]) => {
      setPieces((prev) => {
        const next = updater(prev)
        onPiecesChange?.(next)
        return next
      })
    },
    [onPiecesChange]
  )

  const trayX = 24
  const trayGap = 14

  function templateSlotX(index: number): number {
    let x = trayX
    for (let i = 0; i < index; i++) {
      x += sizeOf(templates[i]!.data).width + trayGap
    }
    return x
  }

  const canvasTop = trayHeight

  const handleTemplateDragEnd = (template: PieceTemplate<TData>, index: number) => (
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    const node = e.target
    const dropY = node.y()
    const dropX = node.x()
    // همیشه پیش‌نمای قفسه را سرجایش برگردان — قفسه هیچ‌وقت خالی نمی‌شود
    node.position({ x: templateSlotX(index), y: trayHeight / 2 })

    if (dropY < canvasTop + 8) return // رها شده داخل خود قفسه — چیزی ساخته نشود

    const size = sizeOf(template.data)
    const raw = { x: dropX - size.width / 2, y: dropY - size.height / 2 }
    const piece: WorkspacePiece<TData> = {
      id: nextPieceId(template.templateId),
      templateId: template.templateId,
      x: raw.x,
      y: raw.y,
      data: template.data,
    }
    updatePieces((prev) => {
      const pos = snap ? snap(raw.x, raw.y, piece, prev) : raw
      return [...prev, { ...piece, x: pos.x, y: pos.y }]
    })
  }

  const handlePieceDragStart = (piece: WorkspacePiece<TData>) => () => {
    setDraggingId(piece.id)
    dragOriginRef.current = { x: piece.x, y: piece.y }
  }

  const handlePieceDragEnd = (piece: WorkspacePiece<TData>) => (
    e: Konva.KonvaEventObject<DragEvent>
  ) => {
    setDraggingId(null)
    const node = e.target
    const y = node.y()
    const x = node.x()

    if (y < canvasTop - 10) {
      // کشیده شد سمت قفسه → پس‌داده شد
      updatePieces((prev) => prev.filter((p) => p.id !== piece.id))
      return
    }

    updatePieces((prev) => {
      const pos = snap ? snap(x, y, piece, prev.filter((p) => p.id !== piece.id)) : { x, y }
      return prev.map((p) => (p.id === piece.id ? { ...p, x: pos.x, y: pos.y } : p))
    })
  }

  const lines = gridLines(width, height - canvasTop, 28)

  return (
    <div className="manipulative-workspace" dir="rtl">
      {title ? <p className="manipulative-workspace__title">{title}</p> : null}
      <Stage width={width} height={height} className="rounded-2xl overflow-hidden shadow-inner">
        {/* زمینهٔ بوم */}
        <Layer listening={false}>
          <Rect width={width} height={height} fill="#FBFBF7" />
          <Rect y={canvasTop} width={width} height={height - canvasTop} fill="#FFFEF9" />
          {lines.map((l) => (
            <Line
              key={l.key}
              points={[l.points[0]!, l.points[1]! + canvasTop, l.points[2]!, l.points[3]! + canvasTop]}
              stroke="#EFEADB"
              strokeWidth={1}
            />
          ))}
          {renderCanvasGuide ? <Group y={canvasTop}>{renderCanvasGuide()}</Group> : null}
        </Layer>

        {/* نوار قفسه */}
        <Layer>
          <Rect width={width} height={trayHeight} fill="#F1F5F2" />
          <Line points={[0, trayHeight, width, trayHeight]} stroke="#CBD5C9" strokeWidth={2} />
          {templates.map((template, index) => {
            const size = sizeOf(template.data)
            return (
              <Group
                key={template.templateId}
                x={templateSlotX(index)}
                y={trayHeight / 2}
                draggable
                onDragEnd={handleTemplateDragEnd(template, index)}
                onMouseEnter={(e) => {
                  e.target.getStage()!.container().style.cursor = 'grab'
                }}
                onMouseLeave={(e) => {
                  e.target.getStage()!.container().style.cursor = 'default'
                }}
              >
                {renderTemplatePreview(template)}
              </Group>
            )
          })}
          {hint ? (
            <Text
              x={width - 240}
              y={trayHeight / 2 - 9}
              width={220}
              align="left"
              text={hint}
              fontSize={11}
              fill="#7C8D86"
            />
          ) : null}
        </Layer>

        {/* بوم آزاد */}
        <Layer>
          {pieces.map((piece) => (
            <Group
              key={piece.id}
              x={piece.x}
              y={piece.y}
              draggable
              onDragStart={handlePieceDragStart(piece)}
              onDragEnd={handlePieceDragEnd(piece)}
              onMouseEnter={(e) => {
                e.target.getStage()!.container().style.cursor = 'grab'
              }}
              onMouseLeave={(e) => {
                e.target.getStage()!.container().style.cursor = 'default'
              }}
            >
              {renderPiece(piece, { dragging: draggingId === piece.id })}
            </Group>
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
