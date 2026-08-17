'use client'

import { Environment, Lightformer } from '@react-three/drei'

interface Props {
  /** شدت IBL روی متریال PBR آواتار */
  intensity?: number
}

/**
 * IBL محلی — preset="city" از raw.githack.com فایل HDR می‌گیرد
 * و در محیط آفلاین/فیلترشده Failed to fetch می‌دهد.
 */
export function AvatarEnvironment({ intensity = 0.85 }: Props) {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[4, 6, 4]}
        intensity={0.55}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <Environment resolution={256} environmentIntensity={intensity}>
        <Lightformer
          form="rect"
          intensity={2}
          color="#fff5eb"
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 4, -2]}
          scale={[12, 10, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#dce8f5"
          rotation={[0, Math.PI / 2, 0]}
          position={[-4, 1.5, 1]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.9}
          color="#fff8f0"
          rotation={[0, -Math.PI / 2, 0]}
          position={[4, 2, 1]}
          scale={[8, 4, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.45}
          color="#ffffff"
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 3, 0]}
          scale={3}
        />
      </Environment>
    </>
  )
}
