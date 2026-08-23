'use client'

import { Html } from '@react-three/drei'
import { ClassroomBoardPanel } from './ClassroomBoard'
import { useClassroomBoardOptional } from '@/hooks/useClassroomBoard'
import { classroomPlacement } from '@/lib/classroom/placement'

export function ClassroomBoard3D() {
  const ctx = useClassroomBoardOptional()
  const board = ctx?.board ?? {}

  return (
    <Html
      transform
      occlude={false}
      distanceFactor={classroomPlacement.board.distanceFactor}
      position={classroomPlacement.board.position}
      rotation={classroomPlacement.board.rotation}
      style={{ pointerEvents: 'none' }}
    >
      <div className="classroom-board-html-wrap">
        <ClassroomBoardPanel
          title={board.title}
          lines={board.lines}
          code={board.code}
          checklist={board.checklist}
          speaking={board.speaking}
        />
      </div>
    </Html>
  )
}
