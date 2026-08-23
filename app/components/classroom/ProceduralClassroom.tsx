'use client'

import type { ComponentProps } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/** Procedural classroom when GLB is unavailable */
export function ProceduralClassroom(props: ComponentProps<'group'>) {
  return (
    <group {...props}>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.72, -2]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#c9a87c" />
      </mesh>
      {/* back wall */}
      <mesh position={[0, 0.2, -6.2]} receiveShadow>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#f0d4b8" />
      </mesh>
      {/* side walls */}
      <mesh position={[-5.8, 0.2, -2]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 5, 0.15]} />
        <meshStandardMaterial color="#e8c9a8" />
      </mesh>
      <mesh position={[5.8, 0.2, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[8, 5, 0.15]} />
        <meshStandardMaterial color="#e8c9a8" />
      </mesh>
      {/* blackboard frame */}
      <mesh position={[0.4, 0.35, -6.05]}>
        <boxGeometry args={[4.2, 2.2, 0.08]} />
        <meshStandardMaterial color="#3d2914" />
      </mesh>
      <mesh position={[0.4, 0.35, -6]}>
        <boxGeometry args={[3.9, 1.9, 0.02]} />
        <meshStandardMaterial color="#1a2420" />
      </mesh>
      {/* ceiling light */}
      <pointLight position={[0.4, 2.5, -3]} intensity={0.6} color="#fff5e6" distance={12} />
    </group>
  )
}

interface ClassroomModelProps {
  url: string
  position?: [number, number, number]
  scale?: number
}

export function ClassroomModel({ url, position = [0, 0, 0], scale = 1 }: ClassroomModelProps) {
  const { scene } = useGLTF(url)
  const cloned = scene.clone(true)
  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })
  return (
    <primitive object={cloned} position={position} scale={scale} />
  )
}
