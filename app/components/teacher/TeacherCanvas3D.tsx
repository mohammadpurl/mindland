'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import type { RootState } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import * as THREE from 'three'
import { Experience } from '@/app/components/Experience'

interface Props {
  avatarLocked: boolean
  onAvatarLockChange: (locked: boolean) => void
  onAvatarLoaded?: (loaded: boolean) => void
}

/** فقط این فایل به R3F وابسته است — جدا لود می‌شود تا React تک‌نسخه بماند */
export default function TeacherCanvas3D({
  avatarLocked,
  onAvatarLockChange,
  onAvatarLoaded,
}: Props) {
  return (
    <>
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
        style={{ zIndex: 1 }}
      >
        <Suspense fallback={null}>
          <Experience
            onAvatarLoaded={onAvatarLoaded}
            avatarLocked={avatarLocked}
            onAvatarLockChange={onAvatarLockChange}
          />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  )
}
