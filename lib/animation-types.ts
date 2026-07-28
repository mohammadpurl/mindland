// ============================================
// Mainland Animation Engine — Types & Config
// ============================================

export type SubjectType = 'math' | 'science' | 'coding'
export type DifficultyLevel = 1 | 2 | 3 | 4 | 5
export type InteractionType = 'drag-drop' | 'click' | 'type-answer' | 'watch'

export interface LessonConfig {
  id: string
  subject: SubjectType
  title: string
  difficulty: DifficultyLevel
  interaction: InteractionType
  data: MathConfig | ScienceConfig | CodingConfig
}

// ---- MATH ----
export interface FractionConfig {
  type: 'fraction-add' | 'fraction-sub' | 'fraction-visual'
  numerator1: number
  numerator2: number
  denominator: number
  showSteps: boolean
}

export interface GeometryConfig {
  type: 'triangle' | 'circle' | 'rectangle'
  interactive: boolean
  showFormula: boolean
}

export interface MathConfig {
  category: 'fraction' | 'geometry' | 'multiplication' | 'division'
  config: FractionConfig | GeometryConfig
}

// ---- SCIENCE ----
export interface ScienceConfig {
  category: 'physics' | 'chemistry' | 'biology'
  topic: string
  elements?: string[]
}

// ---- CODING ----
export interface CodingConfig {
  category: 'loops' | 'variables' | 'conditions' | 'functions'
  language: 'scratch-like' | 'python' | 'javascript'
  puzzle: string[]
}

// ---- GAME STATE ----
export interface GameState {
  score: number
  stars: number
  errors: number
  currentLevel: number
  totalLevels: number
  completed: boolean
  timeSpent: number
}

export interface GameResult {
  lessonId: string
  userId?: string
  score: number
  stars: number
  errors: number
  timeSpent: number
  completedAt: Date
}

// ---- TEACHER ----
export interface TeacherState {
  speaking: boolean
  message: string
  emotion: 'happy' | 'encouraging' | 'explaining' | 'celebrating'
}
