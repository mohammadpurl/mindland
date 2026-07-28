'use client'

import { Circle, Group, Line } from 'react-konva'

export type FaceMood = 'neutral' | 'happy' | 'sad'

/** چهره کودک‌پسند روی اشکال هندسی (دایره، چندضلعی، …) */
export function LivelyFace({
  mood,
  blink,
  eyeOffset,
}: {
  mood: FaceMood
  blink: boolean
  eyeOffset: { x: number; y: number }
}) {
  const eyeScaleY = blink ? 0.12 : 1
  const mouthY = mood === 'happy' ? 14 : mood === 'sad' ? 20 : 17

  return (
    <Group>
      <Group x={-18 + eyeOffset.x} y={-6 + eyeOffset.y} scaleY={eyeScaleY}>
        <Circle radius={5} fill="#fff" stroke="#92400E" strokeWidth={1.5} />
        <Circle radius={2.2} fill="#1e293b" x={mood === 'happy' ? 1 : 0} y={mood === 'sad' ? -1 : 0} />
      </Group>
      <Group x={18 + eyeOffset.x} y={-6 + eyeOffset.y} scaleY={eyeScaleY}>
        <Circle radius={5} fill="#fff" stroke="#92400E" strokeWidth={1.5} />
        <Circle radius={2.2} fill="#1e293b" x={mood === 'happy' ? -1 : 0} y={mood === 'sad' ? -1 : 0} />
      </Group>
      {mood === 'happy' ? (
        <Line
          points={[-12, mouthY, 0, mouthY + 10, 12, mouthY]}
          stroke="#92400E"
          strokeWidth={2.5}
          lineCap="round"
          tension={0.4}
        />
      ) : mood === 'sad' ? (
        <Line
          points={[-10, mouthY + 8, 0, mouthY, 10, mouthY + 8]}
          stroke="#92400E"
          strokeWidth={2.5}
          lineCap="round"
          tension={0.4}
        />
      ) : (
        <Line points={[-8, mouthY + 4, 8, mouthY + 4]} stroke="#92400E" strokeWidth={2} lineCap="round" />
      )}
      {mood === 'happy' && (
        <>
          <Circle x={-28} y={8} radius={6} fill="#FDA4AF" opacity={0.55} />
          <Circle x={28} y={8} radius={6} fill="#FDA4AF" opacity={0.55} />
        </>
      )}
    </Group>
  )
}
