'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ScenarioBoardContent } from '@/lib/curriculum/scenarios/types'

export interface ClassroomBoardState extends ScenarioBoardContent {
  speaking?: boolean
}

interface ClassroomBoardContextValue {
  board: ClassroomBoardState
  setBoard: React.Dispatch<React.SetStateAction<ClassroomBoardState>>
}

const ClassroomBoardContext = createContext<ClassroomBoardContextValue | null>(null)

export function ClassroomBoardProvider({ children }: { children: ReactNode }) {
  const [board, setBoard] = useState<ClassroomBoardState>({})
  const value = useMemo(() => ({ board, setBoard }), [board])
  return (
    <ClassroomBoardContext.Provider value={value}>{children}</ClassroomBoardContext.Provider>
  )
}

export function useClassroomBoard() {
  const ctx = useContext(ClassroomBoardContext)
  if (!ctx) {
    throw new Error('useClassroomBoard must be used within ClassroomBoardProvider')
  }
  return ctx
}

/** Optional hook when provider may be absent */
export function useClassroomBoardOptional() {
  return useContext(ClassroomBoardContext)
}
