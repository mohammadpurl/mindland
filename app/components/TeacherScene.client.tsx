'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import * as THREE from 'three'
import { Experience } from '@/app/components/Experience'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'
import { ChatProvider } from '@/hooks/useChat'
import { Leva } from 'leva'

interface Props {
  className?: string
  height?: string
  /** اگر ChatProvider والد وجود دارد false بگذارید */
  withChatProvider?: boolean
  /** اگر LessonAvatarBridge در والد است false بگذارید */
  withBridge?: boolean
}

function CanvasScene({
  className,
  height,
}: {
  className: string
  height: string
}) {
  const [avatarLocked, setAvatarLocked] = useState(false)

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ height }}>
      <Leva hidden />
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3], fov: 45 }}
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
          <Experience avatarLocked={avatarLocked} onAvatarLockChange={setAvatarLocked} />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}

export default function TeacherSceneClient({
  className = '',
  height = '320px',
  withChatProvider = true,
  withBridge = true,
}: Props) {
  const scene = <CanvasScene className={className} height={height} />

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
