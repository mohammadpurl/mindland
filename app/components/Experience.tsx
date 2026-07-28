'use client'
import {
  CameraControls,
  Environment,
  Text
} from "@react-three/drei";
import { useControls } from "leva";
import { useChatContext } from "@/hooks/useChat";
import { Suspense, useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { AvatarPositionControls } from "./AvatarPositionControls";
import React from "react";
import * as THREE from "three";
import type { Vector3, Euler } from "three";


const Dots = (props: React.ComponentProps<'group'>) => {
  const { loading } = useChatContext();
  const [loadingText, setLoadingText] = React.useState("");
  React.useEffect(() => {
    if (!loading) {
      setLoadingText("");
      return;
    }
    const interval = setInterval(() => {
      setLoadingText((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);
  if (!loading) {
    return null;
  }
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

interface ExperienceProps {
  onAvatarLoaded?: (loaded: boolean) => void;
  avatarLocked?: boolean;
  onAvatarLockChange?: (locked: boolean) => void;
}

export const Experience: React.FC<ExperienceProps> = ({ onAvatarLoaded, avatarLocked, onAvatarLockChange }) => {
  const cameraControls = useRef<CameraControls>(null);
  const { cameraZoomed } = useChatContext();
  const avatarRef = useRef<{ isModelLoaded: boolean; position?: Vector3; rotation?: Euler; scale?: Vector3 } | null>(null);
  const [cameraLocked, setCameraLocked] = React.useState(false);
  const mainLightRef = useRef<THREE.DirectionalLight | null>(null);
  const backdropRef = useRef<THREE.Mesh | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const { camera } = useThree();

  // Leva controls for lighting (updated with lower defaults and new hemisphere)
  const { ambientIntensity, directionalIntensity, fillIntensity, hemisphereIntensity } = useControls("Scene Lighting", {
    ambientIntensity: { value: 0.01, min: 0.0, max: 0.05, step: 0.01 },  // خیلی کم کن (از 0.05 به 0.01) تا سایه washed out نشه
    directionalIntensity: { value: 1.8, min: 1.0, max: 3.0, step: 0.1 },  // کمی افزایش بده برای contrast بیشتر
    fillIntensity: { value: 0.02, min: 0.0, max: 0.1, step: 0.01 },       // کم نگه دار
    hemisphereIntensity: { value: 0.05, min: 0.0, max: 0.2, step: 0.01 }  // کم کن
  });

  useEffect(() => {
    cameraControls.current?.setLookAt(0, 3, 6, 0, 1.5, 0);
  }, []);

  useEffect(() => {
    if (cameraZoomed && cameraControls.current) {
      cameraControls.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current?.setLookAt(0, 3, 6, 0, 1.5, 0, true);
    }
  }, [cameraZoomed]);

  // Check if avatar is loaded
  useEffect(() => {
    const checkAvatarLoaded = () => {
      if (avatarRef.current?.isModelLoaded) {
        onAvatarLoaded?.(true);
      } else {
        // Check again after a short delay
        setTimeout(checkAvatarLoaded, 100);
      }
    };
    
    // Start checking after a short delay to allow initial load
    const timer = setTimeout(checkAvatarLoaded, 500);
    return () => clearTimeout(timer);
  }, [onAvatarLoaded]);

  // همگام‌سازی نور و صفحات دریافت‌کننده با موقعیت و مقیاس آواتار
  useFrame(() => {
    const avatarAny = (avatarRef.current as unknown) as THREE.Object3D | null;
    const hasWorldPos = avatarAny && typeof avatarAny.getWorldPosition === 'function';
    if (!hasWorldPos) {
      return;
    }
    const avatar = avatarAny as THREE.Object3D;

    // تنظیم هدف نور به سمت آواتار
    if (mainLightRef.current) {
      const light = mainLightRef.current;
      const avatarPos = new THREE.Vector3();
      avatar.getWorldPosition(avatarPos);
      
      // نور را از جلو و بالا به آواتار می‌تابانیم (نه از موقعیت دوربین)
      const lightPos = new THREE.Vector3(
        avatarPos.x + 2,  // کمی جلوتر از آواتار
        avatarPos.y + 4,  // بالا
        avatarPos.z + 3   // جلو
      );
      light.position.copy(lightPos);
      light.target.position.copy(avatarPos.clone().setY(avatarPos.y + 1.5));
      light.target.updateMatrixWorld();
      
      // تنظیم دوربین سایه برای سایه واضح
      const shadowCamera = light.shadow.camera;
      shadowCamera.left = -3;
      shadowCamera.right = 3;
      shadowCamera.top = 3;
      shadowCamera.bottom = -1;
      shadowCamera.updateProjectionMatrix();
      
    }

    // اندازه و موقعیت پس‌زمینه متناسب با آواتار و zoom
    if (backdropRef.current) {
      const bbox = new THREE.Box3().setFromObject(avatar);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      const avatarPos = new THREE.Vector3();
      avatar.getWorldPosition(avatarPos);

      // قرار دادن پس‌زمینه مستقیماً پشت آواتار (در جهت z منفی)
      const planePos = new THREE.Vector3(
        avatarPos.x,
        avatarPos.y + 1.5,  // ارتفاع وسط بدن
        avatarPos.z - 1.5   // پشت آواتار
      );
      backdropRef.current.position.copy(planePos);
      
      // صفحه رو به جلو (نه به سمت دوربین)
      backdropRef.current.rotation.set(0, 0, 0);
      
      // مقیاس صفحه بر اساس اندازه آواتار
      backdropRef.current.scale.set(
        Math.max(2.0, size.x * 1.5), 
        Math.max(2.5, size.y * 1.8), 
        1
      );
    }

    // زمین را زیر آواتار نگه داریم و با zoom مقیاس کنیم
    if (groundRef.current) {
      const pos = new THREE.Vector3();
      avatar.getWorldPosition(pos);
      groundRef.current.position.x = pos.x;
      groundRef.current.position.z = pos.z;
      
      // مقیاس زمین بر اساس فاصله دوربین
      const distance = camera.position.distanceTo(pos);
      const groundScale = Math.max(1, distance * 0.6);
      groundRef.current.scale.set(groundScale, 1, groundScale);
    }
  });

  return (
    <>
      <CameraControls 
        ref={cameraControls} 
        enabled={!cameraLocked && !avatarLocked}
        makeDefault={!cameraLocked && !avatarLocked}
      />
      
      {/* <Environment 
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr"
        background={false}
      /> */}
      <Environment background>
        <mesh scale={100}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.BackSide} />
        </mesh>
      </Environment>
      
      
      <ambientLight intensity={ambientIntensity} color="#f3f3f3" />
      <directionalLight
        ref={mainLightRef}
        position={[4, 6, 4]}
        intensity={directionalIntensity}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0001}
        shadow-normalBias={0.02}
      />

      {/* نور پرکننده */}
      <directionalLight position={[-3, 3, 3]} intensity={fillIntensity} color="#ffd6aa" />
      
      
      <hemisphereLight 
        intensity={hemisphereIntensity} 
        color="#f5f5f2"
        groundColor="#d7ccc8"
      />
      
      
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
     
      
      {/* <mesh ref={backdropRef} position={[0, 6, -6]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial 
          color="#ffffff"  // سفید نگه دار
          roughness={0.8}  // افزایش به 0.8 برای مات‌تر شدن (سایه بهتر diffuse می‌شه)
          metalness={0}    // تغییر از 5 به 0! (غیرفلزی)
          transparent={false}
          opacity={1}
        />
      </mesh> */}

     
      <mesh ref={groundRef} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial 
          color="#ffffff"  // سفید نگه دار
          roughness={1}  // کمی افزایش برای مات‌تر (از 1 به 0.9، optional)
          metalness={0.9}    // قبلاً 0 بود، خوبه
          transparent={false}
          opacity={1}
        />
      </mesh> 
      
      {/* @ts-expect-error - scale prop is added dynamically */}
      <Avatar ref={avatarRef} scale={0.7} />
     
      <AvatarPositionControls 
        avatarRef={avatarRef} 
        onCameraLockChange={setCameraLocked}
        isLocked={avatarLocked || false}
        onLockChange={onAvatarLockChange || (() => {})}
      />
       {/* <ContactShadows opacity={0.3} blur={2.5} far={4} scale={8} /> */}
     
    </>
  );
};