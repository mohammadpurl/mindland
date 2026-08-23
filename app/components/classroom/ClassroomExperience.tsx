'use client'

import {
  CameraControls,
  Environment,
} from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Avatar } from '@/app/components/Avatar'
import { ClassroomBoard3D } from '@/app/components/classroom/ClassroomBoard3D'
import {
  ClassroomModel,
  ProceduralClassroom,
} from '@/app/components/classroom/ProceduralClassroom'
import { useChatContext } from '@/hooks/useChat'
import {
  CAMERA_DEFAULT,
  CAMERA_SPEAKING,
  CLASSROOM_GLB,
  classroomPlacement,
} from '@/lib/classroom/placement'

function ClassroomGltfOrFallback() {
  /** پیش‌فرض false — تا قبل از تأیید HEAD، useGLTF اجرا نشود */
  const [glbReady, setGlbReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(CLASSROOM_GLB, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setGlbReady(res.ok)
      })
      .catch(() => {
        if (!cancelled) setGlbReady(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (!glbReady) {
    return <ProceduralClassroom {...classroomPlacement.classroom} />
  }

  return (
    <Suspense fallback={<ProceduralClassroom {...classroomPlacement.classroom} />}>
      <ClassroomModel
        url={CLASSROOM_GLB}
        position={classroomPlacement.classroom.position}
        scale={classroomPlacement.classroom.scale}
      />
    </Suspense>
  )
}

export function ClassroomExperience() {
  const controls = useRef<CameraControls>(null)
  const avatarRef = useRef(null)
  const { isAvatarTalking } = useChatContext()

  useEffect(() => {
    controls.current?.setLookAt(0, 0.8, 4.5, 0.2, 0.5, -2, false)
  }, [])

  useEffect(() => {
    if (!controls.current) return
    if (isAvatarTalking) {
      controls.current.setPosition(...CAMERA_SPEAKING.position, true)
      controls.current.zoomTo(CAMERA_SPEAKING.zoom, true)
    } else {
      controls.current.setPosition(...CAMERA_DEFAULT.position, true)
      controls.current.zoomTo(CAMERA_DEFAULT.zoom, true)
    }
  }, [isAvatarTalking])

  return (
    <>
      <CameraControls
        ref={controls}
        minZoom={0.9}
        maxZoom={2.5}
        polarRotateSpeed={-0.25}
        azimuthRotateSpeed={-0.25}
        mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 16 }}
        touches={{ one: 0, two: 512, three: 0 }}
      />
      <Environment background>
        <mesh scale={100}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#fff8f0" side={THREE.BackSide} />
        </mesh>
      </Environment>
      <ambientLight intensity={0.55} color="#ffe8dc" />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Suspense fallback={null}>
        <ClassroomGltfOrFallback />
        <ClassroomBoard3D />
        <group
          position={classroomPlacement.teacher.position}
          rotation={classroomPlacement.teacher.rotation}
          scale={classroomPlacement.teacher.scale}
        >
          <Avatar ref={avatarRef} />
        </group>
      </Suspense>
    </>
  )
}
