'use client'

import type { ReactNode } from 'react'
import { Layer, Line, Rect, Stage, Text } from 'react-konva'
import { gridLines } from './konva-utils'

interface Props {
  width: number
  height: number
  title: string
  children: ReactNode
}

/** پس‌زمینه وایت‌برد با grid ملایم */
export function WhiteboardFrame({ width, height, title, children }: Props) {
  const lines = gridLines(width, height)

  return (
    <div className="fraction-whiteboard-frame">
      <p className="fraction-whiteboard-frame__title">{title}</p>
      <Stage width={width} height={height} className="rounded-xl overflow-hidden shadow-inner">
        <Layer listening={false}>
          <Rect width={width} height={height} fill="#FFFEF7" />
          {lines.map((l) => (
            <Line key={l.key} points={l.points} stroke="#E8E4D9" strokeWidth={1} />
          ))}
        </Layer>
        {children}
      </Stage>
    </div>
  )
}

/** برچسب کسر در Konva */
export function FractionLabel({
  x,
  y,
  numerator,
  denominator,
  size = 'lg',
}: {
  x: number
  y: number
  numerator: number
  denominator: number
  size?: 'sm' | 'lg'
}) {
  const fontSize = size === 'lg' ? 28 : 18
  const lineW = size === 'lg' ? 36 : 24
  return (
    <>
      <Text
        x={x}
        y={y}
        text={String(numerator)}
        fontSize={fontSize}
        fill="#1e293b"
        fontStyle="bold"
        width={lineW}
        align="center"
      />
      <Line
        points={[x, y + fontSize + 4, x + lineW, y + fontSize + 4]}
        stroke="#1e293b"
        strokeWidth={2}
      />
      <Text
        x={x}
        y={y + fontSize + 10}
        text={String(denominator)}
        fontSize={fontSize}
        fill="#1e293b"
        fontStyle="bold"
        width={lineW}
        align="center"
      />
    </>
  )
}
