// ============================================
// Mainland Animation Engine — Exports
// ============================================

// Components
export { TeacherAvatar } from './TeacherAvatar'
export { GameHUD }       from './GameHUD'
export { LevelComplete } from './LevelComplete'

// Animations — FractionDragGame archived in _archive/lesson-engine-classic/

// Types
export type {
  LessonConfig,
  MathConfig,
  ScienceConfig,
  CodingConfig,
  GameState,
  GameResult,
  TeacherState,
  SubjectType,
  DifficultyLevel,
  InteractionType,
} from '@/lib/animation-types'

// Hooks
export { useGameState } from '@/hooks/useGameState'

// ============================================
// انیمیشن‌هایی که بعداً اضافه میشن:
// ============================================
//
// MATH:
// export { MultiplicationGrid }  from './animations/MultiplicationGrid'
// export { GeometryBuilder }     from './animations/GeometryBuilder'
// export { NumberLine }          from './animations/NumberLine'
// export { FractionCompare }     from './animations/FractionCompare'
//
// SCIENCE:
// export { AtomBuilder }         from './animations/AtomBuilder'
// export { ForceSimulator }      from './animations/ForceSimulator'
// export { PlantCycle }          from './animations/PlantCycle'
// export { SolarSystem }         from './animations/SolarSystem'
//
// CODING:
// export { CodePuzzle }          from './animations/CodePuzzle'
// export { LoopVisualizer }      from './animations/LoopVisualizer'
// export { AlgorithmTracer }     from './animations/AlgorithmTracer'
