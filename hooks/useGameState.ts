// ============================================
// useGameState — مدیریت وضعیت بازی
// ============================================
'use client'

import { useState, useCallback, useRef } from 'react'
import type { GameState, GameResult } from '@/lib/animation-types'

const DEFAULT_STATE: GameState = {
  score: 0,
  stars: 0,
  errors: 0,
  currentLevel: 0,
  totalLevels: 1,
  completed: false,
  timeSpent: 0,
}

export function useGameState(totalLevels: number = 1) {
  const [state, setState] = useState<GameState>({ ...DEFAULT_STATE, totalLevels })
  const startTime = useRef(Date.now())

  const addScore = useCallback((points: number) => {
    setState(s => ({ ...s, score: Math.max(0, s.score + points) }))
  }, [])

  const addError = useCallback(() => {
    setState(s => ({ ...s, errors: s.errors + 1 }))
  }, [])

  const nextLevel = useCallback(() => {
    setState(s => {
      const next = s.currentLevel + 1
      if (next >= s.totalLevels) {
        return { ...s, currentLevel: next, completed: true }
      }
      return { ...s, currentLevel: next, errors: 0 }
    })
  }, [])

  const calcStars = useCallback((errors: number): 1 | 2 | 3 => {
    if (errors === 0) return 3
    if (errors <= 2) return 2
    return 1
  }, [])

  const completeLevel = useCallback((levelErrors?: number) => {
    const errs = levelErrors ?? state.errors
    const stars = calcStars(errs)
    const points = Math.max(0, 100 - errs * 15)
    setState(s => ({ ...s, score: s.score + points, stars: Math.max(s.stars, stars) }))
    return { stars, points }
  }, [state.errors, calcStars])

  const reset = useCallback(() => {
    startTime.current = Date.now()
    setState({ ...DEFAULT_STATE, totalLevels })
  }, [totalLevels])

  const getResult = useCallback((lessonId: string): GameResult => ({
    lessonId,
    score: state.score,
    stars: state.stars,
    errors: state.errors,
    timeSpent: Math.floor((Date.now() - startTime.current) / 1000),
    completedAt: new Date(),
  }), [state])

  return { state, addScore, addError, nextLevel, completeLevel, reset, getResult, calcStars }
}
