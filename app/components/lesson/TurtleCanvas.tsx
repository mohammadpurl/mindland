'use client'

import { useEffect, useRef } from 'react'
import { parseTurtleOutput, type TurtleLine } from '@/lib/pythonTurtleRuntime'

const PADDING = 24
const CANVAS_SIZE = 280

function boundsOf(lines: TurtleLine[]) {
  let minX = 0
  let maxX = 0
  let minY = 0
  let maxY = 0
  for (const l of lines) {
    minX = Math.min(minX, l.x1, l.x2)
    maxX = Math.max(maxX, l.x1, l.x2)
    minY = Math.min(minY, l.y1, l.y2)
    maxY = Math.max(maxY, l.y1, l.y2)
  }
  const w = Math.max(maxX - minX, 40)
  const h = Math.max(maxY - minY, 40)
  return { minX, minY, w, h }
}

export function TurtleCanvas({ output }: { output: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lines = parseTurtleOutput(output)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_SIZE * dpr
    canvas.height = CANVAS_SIZE * dpr
    canvas.style.width = `${CANVAS_SIZE}px`
    canvas.style.height = `${CANVAS_SIZE}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    if (lines.length === 0) {
      ctx.fillStyle = '#64748b'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('لاک‌پشت اینجا نقاشی می‌کشه…', CANVAS_SIZE / 2, CANVAS_SIZE / 2)
      return
    }

    const { minX, minY, w, h } = boundsOf(lines)
    const scale = Math.min(
      (CANVAS_SIZE - PADDING * 2) / w,
      (CANVAS_SIZE - PADDING * 2) / h
    )

    const mapX = (x: number) => PADDING + (x - minX) * scale
    const mapY = (y: number) => CANVAS_SIZE - PADDING - (y - minY) * scale

    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'

    for (const l of lines) {
      ctx.beginPath()
      ctx.moveTo(mapX(l.x1), mapY(l.y1))
      ctx.lineTo(mapX(l.x2), mapY(l.y2))
      ctx.stroke()
    }

    const last = lines[lines.length - 1]
    if (last) {
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(mapX(last.x2), mapY(last.y2), 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [lines, output])

  return (
    <div className="mt-3 rounded-xl border border-sky-500/30 bg-slate-950/80 p-2">
      <p className="mb-2 text-center text-[10px] font-bold text-sky-300">نقاشی لاک‌پشت</p>
      <canvas
        ref={canvasRef}
        className="mx-auto block rounded-lg"
        aria-label="بوم نقاشی turtle"
        role="img"
      />
    </div>
  )
}
