'use client'

import { useChatContext } from "@/hooks/useChat";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button as buttonControl, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { avatarGltfLoaderExtension } from '@/lib/avatarGltfLoader';

const AVATAR_MESH_URL = '/TeacherAvatar_NoLogo.glb';
const AVATAR_ANIM_URL = '/Personel_Animation-5.glb';
const AVATAR_GLTF_OPTS = [true, true, avatarGltfLoaderExtension];

[
  '/TeacherAvatar_NoLogo.glb',
  'TeacherAvatar_NoLogo.glb',
  '/models/TeacherAvatar_NoLogo.glb',
  '/Personel_Animation-5.glb',
  '/models/Personel_Animation-5.glb',
].forEach((url) => useGLTF.clear(url));
useGLTF.preload(AVATAR_MESH_URL, ...AVATAR_GLTF_OPTS);
useGLTF.preload(AVATAR_ANIM_URL, ...AVATAR_GLTF_OPTS);


// Available animations in Personel_Animation-5.glb
const availableAnimations = [
  "Idle",
  "StandingGreeting",
  "ThumbsUp",
  "Pointing",
  "Talking",
  "Clapping",
  "ThoughtfulHead",
  "Bow",
  "Laughing",
  "Thankful",
  "Thinking"
];

// Helper function to find best matching animation
const findBestAnimation = (backendName, actions) => {
  // First try direct mapping
  const mappedName = animationMapping[backendName];
  if (mappedName && actions[mappedName]) {
    return mappedName;
  }

  // Try case-insensitive matching
  const lowerBackendName = backendName.toLowerCase();
  for (const animName of availableAnimations) {
    if (animName.toLowerCase().includes(lowerBackendName) ||
      lowerBackendName.includes(animName.toLowerCase())) {
      if (actions[animName]) {
        return animName;
      }
    }
  }

  // Try fallback animations
  for (const animName of availableAnimations) {
    if (actions[animName]) {
      return animName;
    }
  }

  return "Idle"; // Ultimate fallback
};

// Animation name mapping from backend to GLB (Personel_Animation-5.glb)
const animationMapping = {
  // Basic animations
  "Standing Idle": "Idle",
  "Idle": "Idle",
  "StandingIdle": "Idle",

  // Talking animations
  "Talking_0": "Talking",
  "Talking_1": "Talking",
  "Talking_2": "Talking",
  "Talking": "Talking",

  // Greeting and gestures
  "StandingGreeting": "StandingGreeting",
  "Greeting": "StandingGreeting",
  "Hello": "StandingGreeting",

  // Positive gestures
  "ThumbsUp": "ThumbsUp",
  "Thumbs Up": "ThumbsUp",
  "Good": "ThumbsUp",
  "Great": "ThumbsUp",

  // Pointing
  "Pointing": "Pointing",
  "Point": "Pointing",
  "Look": "Pointing",

  // Applause
  "Clapping": "Clapping",
  "Clap": "Clapping",
  "Applause": "Clapping",
  "Congratulations": "Clapping",

  // Thinking gestures
  "ThoughtfulHead": "ThoughtfulHead",
  "Thoughtful": "ThoughtfulHead",
  "Thinking": "Thinking",
  "Pondering": "ThoughtfulHead",

  // Respectful gestures
  "Bow": "Bow",
  "Bowing": "Bow",
  "Respect": "Bow",
  "Thankful": "Thankful",
  "Thanks": "Thankful",
  "Grateful": "Thankful",

  // Emotional expressions
  "Laughing": "Laughing",
  "Laugh": "Laughing",
  "Happy": "Laughing",
  "Joy": "Laughing",

  // Fallback for unknown animations
  "Angry": "StandingIdle",
  "Crying": "StandingIdle",
  "Sad": "StandingIdle",
  "Terrified": "StandingIdle",
  "Scared": "StandingIdle"
};

const facialExpressions = {
  default: {},
  smile: {
    browInnerUp: 0.17,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.44,
    noseSneerLeft: 0.1700000727403593,
    noseSneerRight: 0.14000002836874015,
    mouthPressLeft: 0.61,
    mouthPressRight: 0.41000000000000003,
  },
  funnyFace: {
    // Softer, friendly playful face (reduced extremes)
    browInnerUp: 0.15,
    eyeSquintLeft: 0.15,
    eyeSquintRight: 0.15,
    cheekPuff: 0.2,
    mouthSmileLeft: 0.35,
    mouthSmileRight: 0.35,
    mouthDimpleLeft: 0.2,
    mouthDimpleRight: 0.2,
    mouthPucker: 0.1,
    jawLeft: 0.1,
    noseSneerLeft: 0.1,
    noseSneerRight: 0.1,
  },
  sad: {
    mouthFrownLeft: 0.3,
    mouthFrownRight: 0.3,
    mouthShrugLower: 0.4,
    browInnerUp: 0.2,
    eyeSquintLeft: 0.35,
    eyeSquintRight: 0.35,
    eyeLookDownLeft: 0.3,
    eyeLookDownRight: 0.3,
    jawForward: 0.4,
  },
  surprised: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.5,
    jawOpen: 0.351,
    mouthFunnel: 1,
    browInnerUp: 1,
  },
  angry: {
    browDownLeft: 0.4,
    browDownRight: 0.4,
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.4,
    jawForward: 0.3,
    jawLeft: 0.3,
    mouthShrugLower: 0.3,
    noseSneerLeft: 0.4,
    noseSneerRight: 0.2,
    eyeLookDownLeft: 0.1,
    eyeLookDownRight: 0.1,
    cheekSquintLeft: 0.4,
    cheekSquintRight: 0.4,
    mouthClose: 0.1,
    mouthFunnel: 0.2,
    mouthDimpleRight: 0.4,
  },
  crazy: {
    browInnerUp: 0.9,
    jawForward: 1,
    noseSneerLeft: 0.5700000000000001,
    noseSneerRight: 0.51,
    eyeLookDownLeft: 0.39435766259644545,
    eyeLookUpRight: 0.4039761421719682,
    eyeLookInLeft: 0.9618479575523053,
    eyeLookInRight: 0.9618479575523053,
    jawOpen: 0.9618479575523053,
    mouthDimpleLeft: 0.9618479575523053,
    mouthDimpleRight: 0.9618479575523053,
    mouthStretchLeft: 0.27893590769016857,
    mouthStretchRight: 0.2885543872656917,
    mouthSmileLeft: 0.5578718153803371,
    mouthSmileRight: 0.38473918302092225,
    tongueOut: 0.9618479575523053,
  },
};

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const VISEME_MORPH_NAMES = new Set(Object.values(corresponding));

/** فقط مش‌های صورت — lipsync روی بدن/لباس اعمال نشود */
function isFaceSkinnedMesh(child) {
  if (!child?.isSkinnedMesh || !child.name) return false;
  const name = child.name.toLowerCase();
  return (
    name.includes('face') ||
    name.includes('head') ||
    name.includes('teeth') ||
    name.includes('tongue') ||
    name.includes('tounge') ||
    name.includes('wolf3d') ||
    name.includes('avatar')
  );
}

function forEachFaceMesh(scene, fn) {
  scene.traverse((child) => {
    if (isFaceSkinnedMesh(child)) fn(child);
  });
}

let setupMode = false;

export const Avatar = React.forwardRef((props, ref) => {
  const { scale: scaleProp = 1, ...restProps } = props;
  // Convert scale to array format [x, y, z]
  const scale = Array.isArray(scaleProp) ? scaleProp : [scaleProp, scaleProp, scaleProp];
  const { nodes, materials, scene } = useGLTF(AVATAR_MESH_URL, ...AVATAR_GLTF_OPTS);

  // Chat context for audio and lipsync
  const { lastAvatarMessage, setIsAvatarTalking, onMessagePlayed, chat, isProcessing, isAvatarTalking, showQRCode } = useChatContext();
  const [lipsync, setLipsync] = useState();
  const [audio, setAudio] = useState();

  // Refs and states must be declared FIRST (before any useEffect or other hooks that use them)
  const group = useRef();
  const hasPlayedPointingRef = useRef(false);
  const currentAnimationRef = useRef(null);
  const pointingAnimationLockRef = useRef(false);
  const hasStartedInitialIdleRef = useRef(false);
  const lastShowQRCodeRef = useRef(false);
  const speechActiveRef = useRef(false);
  const lastSpeechMessageIdRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [blink, setBlink] = useState(false); // Added missing blink state

  // Animations (now after ref)
  const { animations: animClips } = useGLTF(AVATAR_ANIM_URL, ...AVATAR_GLTF_OPTS);
  const animations = useAnimations(animClips, group);

  // تابع برای اعمال حالت‌های صورت
  const applyFacialExpression = React.useCallback((expressionName) => {
    if (expressionName === "default") {
      forEachFaceMesh(scene, (child) => {
        if (!child.morphTargetDictionary || !child.morphTargetInfluences) return;
        VISEME_MORPH_NAMES.forEach((morphName) => {
          const index = child.morphTargetDictionary[morphName];
          if (index !== undefined) child.morphTargetInfluences[index] = 0;
        });
      });
      return;
    }

    const expression = facialExpressions[expressionName];
    if (!expression) {
      console.warn(`Avatar: Expression "${expressionName}" not found`);
      return;
    }

    forEachFaceMesh(scene, (child) => {
      if (!child.morphTargetDictionary) return;
      Object.entries(expression).forEach(([morphName, value]) => {
        const index = child.morphTargetDictionary[morphName];
        if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
          child.morphTargetInfluences[index] = value;
        }
      });
    });
  }, [scene]);

  // تابع برای بستن کامل دهان
  const closeMouth = React.useCallback(() => {
    forEachFaceMesh(scene, (child) => {
      if (!child.morphTargetDictionary) return;
      VISEME_MORPH_NAMES.forEach((morphName) => {
        const index = child.morphTargetDictionary[morphName];
        if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
          child.morphTargetInfluences[index] = 0;
        }
      });
    });
  }, [scene]);

  // Animation setter function (added missing setAnimation)
  const setAnimation = React.useCallback((name) => {
    console.log("Avatar: setAnimation called with:", name);
    console.log("Avatar: Available actions:", Object.keys(animations.actions));

    if (!animations.actions || !animations.actions[name]) {
      console.warn("Avatar: Animation not found:", name);
      return;
    }

    // Avoid restarting the same animation
    if (currentAnimationRef.current === name) {
      return;
    }

    // Block interrupting Pointing animation (except for Talking)
    if (currentAnimationRef.current === 'Pointing' && name !== 'Talking') {
      console.log('Avatar: Blocked animation switch during Pointing →', name);
      return;
    }

    // Block if pointing animation is locked
    if (pointingAnimationLockRef.current && name !== 'Talking') {
      console.log('Avatar: Blocked animation switch during pointing lock →', name);
      return;
    }

    // Stop all current animations
    Object.values(animations.actions).forEach(action => {
      if (action.isRunning()) {
        action.fadeOut(0.3);
      }
    });

    // Play new animation
    const action = animations.actions[name];
    action.reset();

    // تنظیم سرعت انیمیشن
    action.timeScale = 1;
    if (name === 'Thinking' || name === 'Pointing') {
      action.setLoop(THREE.LoopOnce, 0);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    }

    action.fadeIn(0.3).play();
    console.log("Avatar: Playing animation:", name);
    currentAnimationRef.current = name;

    // Set lock for Pointing animation
    if (name === 'Pointing') {
      pointingAnimationLockRef.current = true;
      console.log('Avatar: Pointing animation locked');
    } else {
      pointingAnimationLockRef.current = false;
    }
  }, [animations.actions]);

  // Track if the model is fully loaded (updated material fixes)
  useEffect(() => {
    if (scene && Object.keys(nodes).length > 0) {
      // Fix material and geometry issues when model loads
      scene.traverse((child) => {
        if (child.isMesh) {
          // Fix material transparency and rendering issues
          if (child.material) {
            // عمومی: خاموش کردن emissive برای جلوگیری از glow غیرطبیعی
            if (child.material.emissive) {
              child.material.emissive.setHex(0x000000); // کاملاً خاموش
            }

            // صورت/پوست: تنظیم رنگ طبیعی تر پوست (کاهش زردی)
            if (child.name && (child.name.toLowerCase().includes('face') ||
              child.name.toLowerCase().includes('skin') ||
              child.name.toLowerCase().includes('head'))) {
              if (child.material.color) {
                // رنگ پوست با ته‌مایه خنثی/صورتی ملایم
                child.material.color.setHex(0xE6C1B3);
                child.material.color.multiplyScalar(1.1);
              }
              child.material.roughness = 0.7; // کمی مات‌تر
              child.material.metalness = 0; // صفر برای پوست
            }

            // چشم‌ها: کاهش emissive و color
            if (child.name && (child.name.toLowerCase().includes('eye') ||
              child.name.toLowerCase().includes('iris') ||
              child.name.toLowerCase().includes('pupil'))) {
              if (child.material.color) {
                child.material.color.multiplyScalar(0.75); // کاهش به 0.75
              }
              child.material.emissiveIntensity = 0; // خاموش کردن glow چشم
            }

            // زبان: قرمز کردن
            if (child.name && child.name === 'Tounge') {
              if (child.material.color) {
                child.material.color.setHex(0xC65350); // قرمز
                child.material.color.multiplyScalar(0.5); // تیره‌تر
              }
              child.material.roughness = 0.8;
              child.material.metalness = 0;
            }





            // مژه/ابرو: فقط node های واقعی
            if (child.name && (
              child.name === 'Eyelashes' ||
              child.name === 'eyebrow'
            )) {
              child.material.transparent = true;
              child.material.alphaTest = 0.05; // کاهش برای شفافیت بهتر
              child.material.opacity = 0.6; // افزایش به 0.6 برای کمتر محو بودن
              child.material.side = THREE.DoubleSide;
              child.material.depthWrite = false;
              child.material.blending = THREE.NormalBlending;

              // روشن‌تر و کمرنگ‌تر کردن color
              if (child.material.color) {
                // تنظیم مستقیم رنگ قهوه‌ای روشن‌تر
                child.material.color.setHex(0xD2691E); // قهوه‌ای روشن‌تر
                child.material.color.multiplyScalar(1.2); // کمی روشن‌تر
              }
              // اضافه: کمی roughness برای بافت طبیعی
              child.material.roughness = 0.9;
            }
            else if (child.name && child.name === 'Hair' || child.name === 'Logo') {
              child.material.transparent = true;
              child.material.alphaTest = 0.05;
              child.material.opacity = 0.8;
              child.material.side = THREE.DoubleSide;
              child.material.depthWrite = false;
              child.material.blending = THREE.NormalBlending;
              // رنگ اصلی مو حفظ شود - هیچ تغییری روی رنگ نمی‌دهیم
            }
            else {
              // Regular materials
              child.material.transparent = false;
              child.material.alphaTest = 0.1;
              child.material.side = THREE.FrontSide;
            }

            child.material.depthWrite = true;
            child.material.depthTest = true;

            // Fix texture issues
            if (child.material.map) {
              child.material.map.flipY = false;
              child.material.map.generateMipmaps = true;
            }
            child.material.needsUpdate = true; // Force update
          }

          // Logo: طلایی
          if (child.name && child.name === 'Logo') {
            if (child.material.color) {
              child.material.color.setHex(0xEBD170); // طلایی
            }
            child.material.roughness = 0.3;
            child.material.metalness = 0.8;
          }

          // Hair: قهوه‌ای روشن

          // Enable real-time shadows
          child.castShadow = true;
          child.receiveShadow = true; // فعال برای دریافت سایه روی ابرو/مژه

          // Fix geometry culling and clipping issues
          if (child.geometry) {
            child.geometry.computeBoundingSphere();
            child.geometry.computeBoundingBox();
            child.geometry.computeVertexNormals();
          }

          // Ensure proper rendering order for hair and other elements
          child.renderOrder = 0;
          child.frustumCulled = true;
          // عمومی
          child.castShadow = true;
          child.receiveShadow = false;
        }
      });

      setIsModelLoaded(true);
    }
  }, [scene, nodes]);

  // Debug: Log actual node names and structure (keep for debugging)
  useEffect(() => {
    console.log("=== .glb DEBUG ===");
    console.log("NODES:", Object.keys(nodes));
    console.log("MATERIALS:", Object.keys(materials));
    console.log("SCENE CHILDREN:", scene.children.map(child => child.name));

    // Find all skinned meshes (truncated part completed)
    const skinnedMeshes = [];
    scene.traverse((child) => {
      if (child.isSkinnedMesh) {
        skinnedMeshes.push({
          name: child.name,
          geometry: child.geometry ? 'exists' : 'missing',
          material: child.material ? 'exists' : 'missing',
          morphTargetDictionary: child.morphTargetDictionary ? Object.keys(child.morphTargetDictionary) : 'none'
        });
      }
    });
    console.log("SKINNED MESHES:", skinnedMeshes);
  }, [scene]);

  // Leva controls for materials (updated)
  const { eyelashOpacity, faceBrightness, eyeBrightness, listAllNodes, brightenFace, setNaturalSkin, setWarmSkin } = useControls("Avatar Materials", {
    setNaturalSkin: buttonControl(() => {
      scene.traverse((child) => {
        if (child.isMesh && child.material && child.name &&
          (child.name.toLowerCase().includes('face') ||
            child.name.toLowerCase().includes('skin') ||
            child.name.toLowerCase().includes('head'))) {
          child.material.color.setHex(0xE6C1B3); // تون خنثی‌تر
          child.material.color.multiplyScalar(1.1);
          child.material.needsUpdate = true;
          console.log(`Set natural skin for: ${child.name}`);
        }
      });
    }),
    setWarmSkin: buttonControl(() => {
      scene.traverse((child) => {
        if (child.isMesh && child.material && child.name &&
          (child.name.toLowerCase().includes('face') ||
            child.name.toLowerCase().includes('skin') ||
            child.name.toLowerCase().includes('head'))) {
          child.material.color.setHex(0xD8B0A3); // کمی گرم اما نه زرد
          child.material.color.multiplyScalar(1.0);
          child.material.needsUpdate = true;
          console.log(`Set warm skin for: ${child.name}`);
        }
      });
    }),
    brightenFace: buttonControl(() => {
      scene.traverse((child) => {
        if (child.isMesh && child.material && child.name &&
          (child.name.toLowerCase().includes('face') ||
            child.name.toLowerCase().includes('skin') ||
            child.name.toLowerCase().includes('head'))) {
          if (child.material.color) {
            child.material.color.multiplyScalar(2.0); // دو برابر روشن‌تر
          }
          child.material.needsUpdate = true;
          console.log(`Brightened: ${child.name}`);
        }
      });
    }),
    listAllNodes: buttonControl(() => {
      console.log("=== ALL NODE NAMES ===");
      const nodeNames = [];
      scene.traverse((child) => {
        if (child.isMesh) {
          const info = {
            name: child.name,
            hasMaterial: !!child.material,
            materialType: child.material ? child.material.type : 'none',
            color: child.material && child.material.color ? child.material.color.getHexString() : 'none'
          };
          nodeNames.push(info);
          console.log(`${info.name} - Material: ${info.materialType}, Color: ${info.color}`);
        }
      });
      console.table(nodeNames);
    }),
    highlightHairNodes: buttonControl(() => {
      console.log("=== HIGHLIGHTING HAIR/EYEBROW NODES ===");
      scene.traverse((child) => {
        if (child.isMesh && child.name) {
          const lowerName = child.name.toLowerCase();
          if (lowerName.includes('hair') ||
            lowerName.includes('eyebrow') ||
            lowerName.includes('eyelash') ||
            lowerName.includes('brow') ||
            lowerName.includes('lash') ||
            lowerName.includes('base005') ||
            lowerName.includes('mika014')) {
            const originalColor = child.material.color.clone();
            child.material.color.setHex(0xFF0000); // قرمز برای تست
            child.material.needsUpdate = true;
            console.log(`Red highlight: "${child.name}" - Original color: ${originalColor.getHexString()}`);

            // برگرداندن بعد از 3 ثانیه
            setTimeout(() => {
              child.material.color.copy(originalColor);
              child.material.needsUpdate = true;
            }, 3000);
          }
        }
      });
    }),
    highlightMika014: buttonControl(() => {
      console.log("=== HIGHLIGHTING mika014 ===");
      scene.traverse((child) => {
        if (child.isMesh && child.name && child.name.includes('mika014')) {
          console.log(`Found mika014: "${child.name}"`);
          const originalColor = child.material.color.clone();
          child.material.color.setHex(0x00FF00); // سبز
          child.material.needsUpdate = true;
          setTimeout(() => {
            child.material.color.copy(originalColor);
            child.material.needsUpdate = true;
          }, 5000);
        }
      });
    }),
    highlightBase005: buttonControl(() => {
      console.log("=== HIGHLIGHTING base005 ===");
      scene.traverse((child) => {
        if (child.isMesh && child.name && child.name.toLowerCase().includes('base005')) {
          console.log(`Found base005: "${child.name}"`);
          const originalColor = child.material.color.clone();
          child.material.color.setHex(0x0000FF); // آبی
          child.material.needsUpdate = true;
          setTimeout(() => {
            child.material.color.copy(originalColor);
            child.material.needsUpdate = true;
          }, 5000);
        }
      });
    }),
    testSpecificNodes: buttonControl(() => {
      console.log("=== TESTING SPECIFIC NODES ===");
      const testNodes = [
        'male_02_male_02_referencesmd_MESH003_1',
        'male_02_male_02_referencesmd_MESH003_3'
      ];

      testNodes.forEach(nodeName => {
        scene.traverse((child) => {
          if (child.isMesh && child.name === nodeName) {
            console.log(`Testing node: ${nodeName}`);
            const originalColor = child.material.color.clone();
            child.material.color.setHex(0xFF00FF); // رنگ بنفش برای تست
            child.material.needsUpdate = true;

            setTimeout(() => {
              child.material.color.copy(originalColor);
              child.material.needsUpdate = true;
              console.log(`Restored node: ${nodeName}`);
            }, 3000);
          }
        });
      });
    }),
    testAllNodesOneByOne: buttonControl(() => {
      console.log("=== TESTING ALL NODES ONE BY ONE ===");
      const allNodes = [];
      scene.traverse((child) => {
        if (child.isMesh && child.name) {
          allNodes.push(child.name);
        }
      });

      console.log("All nodes:", allNodes);

      // تست هر node به صورت جداگانه
      allNodes.forEach((nodeName, index) => {
        setTimeout(() => {
          scene.traverse((child) => {
            if (child.isMesh && child.name === nodeName) {
              console.log(`Testing node ${index + 1}/${allNodes.length}: ${nodeName}`);
              const originalColor = child.material.color.clone();
              child.material.color.setHex(0xFF0000); // قرمز
              child.material.needsUpdate = true;

              setTimeout(() => {
                child.material.color.copy(originalColor);
                child.material.needsUpdate = true;
                console.log(`Restored: ${nodeName}`);
              }, 2000);
            }
          });
        }, index * 3000); // هر 3 ثانیه یک node
      });
    }),
    testDarkNodes: buttonControl(() => {
      console.log("=== TESTING DARK COLORED NODES ===");
      scene.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
          const color = child.material.color;
          const brightness = (color.r + color.g + color.b) / 3;

          // اگر رنگ تیره باشد (کمتر از 0.3)
          if (brightness < 0.3) {
            console.log(`Dark node: ${child.name} - Brightness: ${brightness.toFixed(3)}`);
            const originalColor = child.material.color.clone();
            child.material.color.setHex(0x00FF00); // سبز
            child.material.needsUpdate = true;

            setTimeout(() => {
              child.material.color.copy(originalColor);
              child.material.needsUpdate = true;
            }, 3000);
          }
        }
      });
    }),
    eyelashOpacity: {
      value: 0.6, // افزایش پیش‌فرض به 0.6
      min: 0.1, max: 0.8, step: 0.05,
      onChange: (v) => {
        scene.traverse((child) => {
          if (child.isMesh && child.material && child.name &&
            (child.name === 'Eyelashes' ||
              child.name === 'eyebrow')) {
            child.material.opacity = v;
            child.material.transparent = true;
            child.material.alphaTest = v > 0.3 ? 0.05 : 0.02;
            child.material.depthWrite = false;
            if (child.material.color) {
              child.material.color.multiplyScalar(v > 0.3 ? 4.0 : 2.5); // تطبیقی با 4.0 برای روشن‌تر
              // lerp به سمت قهوه‌ای روشن‌تر و factor بالاتر
              child.material.color.lerp(new THREE.Color(0.8, 0.6, 0.4), 0.5);
            }
            child.material.needsUpdate = true;
          }
        });
      }
    },
    faceBrightness: {
      value: 2.2,
      min: 0.5, max: 3.0, step: 0.1,
      onChange: (v) => {
        scene.traverse((child) => {
          if (child.isMesh && child.material && child.name &&
            (child.name.toLowerCase().includes('face') ||
              child.name.toLowerCase().includes('skin') ||
              child.name.toLowerCase().includes('head'))) {
            if (child.material.color) {
              child.material.color.multiplyScalar(v);
            }
            child.material.emissive?.setHex(0x000000);
            child.material.needsUpdate = true;
          }
        });
      }
    },
    eyeBrightness: {
      value: 0.75,
      min: 0.5, max: 1.0, step: 0.05,
      onChange: (v) => {
        scene.traverse((child) => {
          if (child.isMesh && child.material && child.name &&
            (child.name.toLowerCase().includes('eye') ||
              child.name.toLowerCase().includes('iris') ||
              child.name.toLowerCase().includes('pupil'))) {
            if (child.material.color) {
              child.material.color.multiplyScalar(v);
            }
            child.material.emissive?.setHex(0x000000);
            child.material.emissiveIntensity = 0;
            child.material.needsUpdate = true;
          }
        });
      }
    },
    showOriginalCharacter: buttonControl(() => {
      // Reset all materials to original state
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          if (child.material.emissive) {
            child.material.emissive.setHex(0x000000);
          }
          // Only keep eyelash transparency settings
          if (child.name && (child.name.toLowerCase().includes('eyelash') ||
            child.name.toLowerCase().includes('lash') ||
            child.name.toLowerCase().includes('eyebrow') ||
            child.name.toLowerCase().includes('brow'))) {
            child.material.transparent = true;
            child.material.opacity = 0.6;
            child.material.alphaTest = 0.05;
            child.material.depthWrite = false;
          }
          child.material.needsUpdate = true;
        }
      });
      console.log("Showing original character - no lighting modifications");
    })
  });

  // Essential Animation Controls - Only Idle, Talking, Thinking
  const { animationSpeed } = useControls("Avatar Animations", {
    animationSpeed: {
      value: 1.5,
      min: 0.5, max: 3.0, step: 0.1,
      onChange: (v) => {
        // تنظیم سرعت همه انیمیشن‌ها
        Object.values(animations.actions).forEach(action => {
          if (action) {
            action.timeScale = v;
          }
        });
      }
    },
    setSpeed2x: buttonControl(() => {
      Object.values(animations.actions).forEach(action => {
        if (action) {
          action.timeScale = 2.0;
        }
      });
      console.log("Animation speed set to 2x");
    }),
    setSpeed3x: buttonControl(() => {
      Object.values(animations.actions).forEach(action => {
        if (action) {
          action.timeScale = 3.0;
        }
      });
      console.log("Animation speed set to 3x");
    }),
    closeMouth: buttonControl(() => {
      closeMouth();
      console.log("Avatar: Manually closed mouth");
    }),
    listAllWhiteNodes: buttonControl(() => {
      const whiteNodes = [];
      scene.traverse((child) => {
        if (child.isMesh && child.name && child.material && child.material.color) {
          const hex = child.material.color.getHexString().toLowerCase();
          if (hex === 'ffffff' || hex === 'ffffffff') {
            whiteNodes.push({
              name: child.name,
              color: hex,
              materialType: child.material.type
            });
          }
        }
      });
      console.log("White nodes found:", whiteNodes);
      console.log("Total white nodes:", whiteNodes.length);
    }),
    playIdle: buttonControl(() => {
      setAnimation("Idle");
      console.log("Avatar: Playing Idle animation");
    }),
    playTalking: buttonControl(() => {
      setAnimation("Talking");
      console.log("Avatar: Playing Talking animation");
    }),
    playThinking: buttonControl(() => {
      setAnimation("Thinking");
      console.log("Avatar: Playing Thinking animation");
    }),
    playPointing: buttonControl(() => {
      setAnimation("Pointing");
      console.log("Avatar: Playing Pointing animation");
    }),
    playLaughing: buttonControl(() => {
      setAnimation("Laughing");
      console.log("Avatar: Playing Laughing animation");
    }),
    stopAll: buttonControl(() => {
      // Stop all animations
      Object.values(animations.actions).forEach(action => {
        if (action.isRunning()) {
          action.fadeOut(0.3);
        }
      });
      console.log("Avatar: Stopped all animations");
    })
  });

  // Facial Expression Controls
  const { } = useControls("Facial Expressions", {
    smile: buttonControl(() => {
      applyFacialExpression("smile");
    }),
    funnyFace: buttonControl(() => {
      applyFacialExpression("funnyFace");
    }),
    sad: buttonControl(() => {
      applyFacialExpression("sad");
    }),
    surprised: buttonControl(() => {
      applyFacialExpression("surprised");
    }),
    angry: buttonControl(() => {
      applyFacialExpression("angry");
    }),
    default: buttonControl(() => {
      applyFacialExpression("default");
    }),
    crazy: buttonControl(() => {
      applyFacialExpression("crazy");
    })
  });

  // Animation state management based on processing and talking states
  useEffect(() => {
    // Detect QR Code becoming true (not just being true)
    const qrJustActivated = showQRCode && !lastShowQRCodeRef.current;

    // Handle QR Code - play Pointing when QR just becomes visible
    if (qrJustActivated) {
      hasPlayedPointingRef.current = true;
      setAnimation("Pointing");
      console.log("Avatar: QR shown - playing Pointing once");
      lastShowQRCodeRef.current = true;
      return;
    }

    // When QR is hidden, reset the flag
    if (!showQRCode) {
      hasPlayedPointingRef.current = false;
      lastShowQRCodeRef.current = false;
    }

    // Skip if Pointing is locked or currently playing (allow only Talking to interrupt)
    if (pointingAnimationLockRef.current || currentAnimationRef.current === 'Pointing') {
      console.log('Avatar: Skipping animation change - Pointing is locked or playing');
      return;
    }

    // هنگام پخش صدا/lipsync انیمیشن را این effect عوض نکند (جلوگیری از لرزش)
    if (speechActiveRef.current) {
      return;
    }

    // Normal animation flow
    if (isProcessing && !isAvatarTalking) {
      // API call in progress - show Thinking animation
      setAnimation("Thinking");
      console.log("Avatar: Processing - showing Thinking animation");
    } else if (isAvatarTalking) {
      // Audio is playing - show Talking animation
      setAnimation("Talking");
      console.log("Avatar: Talking - showing Talking animation");
    } else {
      // Default state - show Idle animation
      setAnimation("Idle");
      console.log("Avatar: Idle - showing Idle animation");
    }
  }, [isProcessing, isAvatarTalking, setAnimation, showQRCode]);

  // Audio and lipsync logic
  useEffect(() => {
    const messageId = lastAvatarMessage?.id;
    if (!lastAvatarMessage || !messageId) {
      return;
    }
    if (lastSpeechMessageIdRef.current === messageId) {
      return;
    }
    lastSpeechMessageIdRef.current = messageId;

    if (lastAvatarMessage.animation) {
      const animName = findBestAnimation(lastAvatarMessage.animation, animations.actions);
      setAnimation(animName);
    }
    setLipsync(lastAvatarMessage.lipsync);

    if (lastAvatarMessage.facialExpression) {
      applyFacialExpression(lastAvatarMessage.facialExpression);
    }

    const endSpeech = () => {
      speechActiveRef.current = false;
      setIsAvatarTalking(false);
      setLipsync(undefined);
      setAudio(undefined);
      closeMouth();
      applyFacialExpression("default");
      onMessagePlayed();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("mindland:speech-ended"));
      }
    };

    if (lastAvatarMessage.audio) {
      speechActiveRef.current = true;
      const audioEl = new Audio("data:audio/mp3;base64," + lastAvatarMessage.audio);
      setIsAvatarTalking(true);

      const playAudio = async () => {
        try {
          await audioEl.play();
          setAudio(audioEl);
        } catch (error) {
          console.warn("Audio play failed:", error);
          endSpeech();
        }
      };

      playAudio();
      audioEl.onended = endSpeech;
      return () => {
        audioEl.pause();
        audioEl.onended = null;
      };
    }

    if (lastAvatarMessage.useBrowserTts && lastAvatarMessage.text && typeof window !== "undefined" && window.speechSynthesis) {
      speechActiveRef.current = true;
      const startTime = performance.now();
      const fakeAudio = {
        get currentTime() {
          return (performance.now() - startTime) / 1000;
        },
      };

      const speak = () => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastAvatarMessage.text);
        utterance.lang = "fa-IR";
        const voices = window.speechSynthesis.getVoices();
        const faVoice = voices.find((v) => v.lang.startsWith("fa"));
        if (faVoice) utterance.voice = faVoice;

        utterance.onstart = () => {
          setIsAvatarTalking(true);
          setAudio(fakeAudio);
        };
        utterance.onend = endSpeech;
        utterance.onerror = endSpeech;
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          speak();
        };
      } else {
        speak();
      }

      return () => {
        window.speechSynthesis.cancel();
        speechActiveRef.current = false;
      };
    }
  }, [lastAvatarMessage?.id, lastAvatarMessage?.audio, lastAvatarMessage?.useBrowserTts, applyFacialExpression, setAnimation, onMessagePlayed, setIsAvatarTalking, closeMouth]);

  // Blink effect (original, now with state)
  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);


  // Lipsync + Blink per-frame updates
  useFrame(() => {
    // اگر صحبت تمام شده، دهان را ببند (اما ادامه بده تا پلک اجرا شود)
    if (!audio && !lipsync) {
      closeMouth();
    }

    // فقط اگر audio و lipsync داریم، دهان را حرکت بده
    if (audio && lipsync) {
      const currentAudioTime = audio.currentTime || 0;
      const appliedMorphTargets = [];

      for (let i = 0; i < lipsync.mouthCues.length; i++) {
        const mouthCue = lipsync.mouthCues[i];
        if (
          currentAudioTime >= mouthCue.start &&
          currentAudioTime <= mouthCue.end
        ) {
          appliedMorphTargets.push(corresponding[mouthCue.value]);
          forEachFaceMesh(scene, (child) => {
            if (!child.morphTargetDictionary) return;
            const morphName = corresponding[mouthCue.value];
            const index = child.morphTargetDictionary[morphName];
            if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
              child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                child.morphTargetInfluences[index],
                0.35,
                0.2
              );
            }
          });
          break;
        }
      }

      Object.values(corresponding).forEach((value) => {
        if (appliedMorphTargets.includes(value)) return;
        forEachFaceMesh(scene, (child) => {
          if (!child.morphTargetDictionary) return;
          const index = child.morphTargetDictionary[value];
          if (index !== undefined && child.morphTargetInfluences[index] !== undefined) {
            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
              child.morphTargetInfluences[index],
              0,
              0.25
            );
          }
        });
      });
    }

    // Blink control: smoothly close/open eyelids when blink flag toggles
    const blinkMorphNames = [
      'eyeBlinkLeft', 'eyeBlinkRight', 'eyeBlink',
      'blink', 'Blink', 'BlinkLeft', 'BlinkRight',
      'eyeCloseLeft', 'eyeCloseRight', 'eyesClosed'
    ];
    scene.traverse((child) => {
      if (!isFaceSkinnedMesh(child) || !child.morphTargetDictionary || !child.morphTargetInfluences) return;
      blinkMorphNames.forEach((name) => {
        const idx = child.morphTargetDictionary[name];
        if (idx !== undefined) {
          const target = blink ? 1 : 0;
          child.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[idx] ?? 0,
            target,
            0.35
          );
        }
      });
    });
  });

  // Start with Idle animation on mount (only once)
  useEffect(() => {
    // Check if animations are loaded and initial Idle hasn't been set yet
    if (animations && animations.actions && animations.actions['Idle'] && !hasStartedInitialIdleRef.current && currentAnimationRef.current === null) {
      hasStartedInitialIdleRef.current = true;
      // Temporarily disable lock to allow initial Idle
      pointingAnimationLockRef.current = false;
      console.log("Avatar: Setting initial Idle animation");
      // Call setAnimation directly with bypass
      const action = animations.actions['Idle'];
      if (action) {
        action.reset();
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.timeScale = 1;
        action.fadeIn(0.3).play();
        currentAnimationRef.current = 'Idle';
        console.log("Avatar: Initial Idle animation started");
      }
    }
  }, [animations.actions]);

  // After any one-shot animation finishes, return to Idle
  useEffect(() => {
    if (!animations || !animations.mixer) return;
    const onFinished = (e) => {
      console.log('Avatar: Animation finished event:', e.action.getClip().name, 'loop:', e.action.loop);
      // Only switch if the finished action is a LoopOnce animation and not currently Talking
      if (e.action.loop === THREE.LoopOnce && currentAnimationRef.current !== 'Talking') {
        console.log('Avatar: One-shot animation finished, returning to Idle');
        // Release pointing lock
        pointingAnimationLockRef.current = false;
        setAnimation('Idle');
      }
    };
    animations.mixer.addEventListener('finished', onFinished);
    return () => animations.mixer.removeEventListener('finished', onFinished);
  }, [animations.mixer, setAnimation]);
  // Expose loading state to parent components (now after group ref)
  React.useImperativeHandle(ref, () => ({
    isModelLoaded,
    ...group.current
  }));

  return (
    <group {...restProps} dispose={null} ref={group} scale={scale}>
      {/* Render the entire scene directly to avoid geometry errors */}
      <primitive
        object={scene}
        onUpdate={(self) => {
          // Fix material issues that might cause background problems (updated)
          self.traverse((child) => {
            if (child.isMesh) {
              // Ensure proper material settings with reduced brightness
              if (child.material) {
                // عمومی: emissive خاموش
                if (child.material.emissive) {
                  child.material.emissive.setHex(0x000000);
                }

                // صورت/پوست: در این مرحله رنگ را تغییر نده؛ فقط پارامترهای فیزیکی
                if (child.name && (child.name.toLowerCase().includes('face') ||
                  child.name.toLowerCase().includes('skin') ||
                  child.name.toLowerCase().includes('head'))) {
                  child.material.roughness = 0.7;
                  child.material.metalness = 0;
                  child.material.transparent = false;
                  child.material.alphaTest = 0.0;
                  child.material.depthWrite = true;
                  child.material.side = THREE.FrontSide;
                }

                // چشم‌ها
                if (child.name && (child.name.toLowerCase().includes('eye') ||
                  child.name.toLowerCase().includes('iris') ||
                  child.name.toLowerCase().includes('pupil'))) {
                  if (child.material.color) {
                    child.material.color.multiplyScalar(0.75);
                  }
                  child.material.emissiveIntensity = 0;
                }

                // زبان: قرمز کردن
                if (child.name && child.name === 'Tounge') {
                  if (child.material.color) {
                    child.material.color.setHex(0xC65350);
                    child.material.color.multiplyScalar(0.5);
                  }
                  child.material.roughness = 0.8;
                  child.material.metalness = 0;
                }

                // Logo: طلایی
                if (child.name && child.name === 'Logo') {
                  if (child.material.color) {
                    child.material.color.setHex(0xFFD700); // طلایی
                  }
                  child.material.roughness = 0.3;
                  child.material.metalness = 0.8;
                }





                // مژه/ابرو - فقط node های واقعی
                if (child.name && (
                  child.name === 'Eyelashes' ||
                  child.name === 'eyebrow'
                )) {
                  child.material.transparent = true;
                  child.material.alphaTest = 0.05;
                  child.material.opacity = 0.6;
                  child.material.side = THREE.DoubleSide;
                  child.material.depthWrite = false;
                  child.material.blending = THREE.NormalBlending;
                  if (child.material.color) {
                    // تنظیم مستقیم رنگ قهوه‌ای روشن‌تر
                    child.material.color.setHex(0xD2691E); // قهوه‌ای روشن‌تر
                    child.material.color.multiplyScalar(1.2); // کمی روشن‌تر
                  }
                  child.material.roughness = 0.9;
                } else {
                  child.material.transparent = false;
                  child.material.alphaTest = 0.1;
                  child.material.side = THREE.FrontSide;
                }

                // Fix any transparency issues
                if (child.material.map) {
                  child.material.map.flipY = false;
                }
                child.material.needsUpdate = true;
              }

              // Ensure meshes cast real shadows
              child.castShadow = true;
              child.receiveShadow = true;

              // Fix geometry culling issues
              if (child.geometry) {
                child.geometry.computeBoundingSphere();
                child.geometry.computeBoundingBox();
              }
            }
          });
        }}
      />
    </group>
  );
});

