'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import * as THREE from 'three'
import { ClassroomExperience } from '@/app/components/classroom/ClassroomExperience'
import { ChatProvider } from '@/hooks/useChat'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { Leva } from 'leva'

interface Props {
  className?: string
  height?: string
  withChatProvider?: boolean
  withBridge?: boolean
}

function CanvasInner({ className, height }: { className: string; height: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ height }}>
      <Leva hidden />
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.8, 4.5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={(state: RootState) => {
          state.gl.toneMappingExposure = 0.72
          state.gl.shadowMap.enabled = true
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        className="!absolute inset-0"
      >
        <Suspense fallback={null}>
          <ClassroomExperience />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}

export default function ClassroomScene({
  className = '',
  height = 'min(42vh, 380px)',
  withChatProvider = true,
  withBridge = true,
}: Props) {
  const scene = <CanvasInner className={className} height={height} />

  if (!withChatProvider) {
    return scene
  }

  return (
    <ChatProvider>
      {withBridge && <LessonAvatarBridge />}
      {scene}
    </ChatProvider>
  )
}
