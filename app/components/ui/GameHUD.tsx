// ============================================
// GameHUD — نمایش امتیاز، ستاره، مرحله
// ============================================
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { GameState } from '@/lib/animation-types'

interface Props {
  state: GameState
  levelLabel?: string
}

export function GameHUD({ state, levelLabel }: Props) {
  const scoreRef = useRef<HTMLDivElement>(null)
  const prevScore = useRef(state.score)

  useEffect(() => {
    if (state.score !== prevScore.current && scoreRef.current) {
      gsap.fromTo(scoreRef.current,
        { scale: 1.4, color: '#FFD54F' },
        { scale: 1, color: '#FFD54F', duration: 0.4, ease: 'back.out(2)' }
      )
      prevScore.current = state.score
    }
  }, [state.score])

  const stars = state.stars
  const progress = state.totalLevels > 1
    ? (state.currentLevel / state.totalLevels) * 100
    : 0

  return (
    <div className="w-full space-y-2 mb-3">
      {/* Progress bar */}
      {state.totalLevels > 1 && (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        {/* Score */}
        <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-center min-w-[72px]">
          <div className="text-[10px] text-white/50 mb-0.5">امتیاز</div>
          <div ref={scoreRef} className="text-lg font-bold text-yellow-400">
            {state.score}
          </div>
        </div>

        {/* Stars */}
        <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-center">
          <div className="text-[10px] text-white/50 mb-0.5">ستاره</div>
          <div className="text-xl tracking-wider">
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} className={i < stars ? 'text-yellow-400' : 'text-white/20'}>
                {i < stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="bg-blue-600 text-white rounded-xl px-4 py-2 text-center">
          <div className="text-[10px] text-blue-200 mb-0.5">مرحله</div>
          <div className="text-sm font-bold">
            {levelLabel ?? `${state.currentLevel + 1} / ${state.totalLevels}`}
          </div>
        </div>

        {/* Errors */}
        <div className="bg-white/10 border border-white/15 rounded-xl px-4 py-2 text-center min-w-[64px]">
          <div className="text-[10px] text-white/50 mb-0.5">اشتباه</div>
          <div className="text-lg font-bold text-red-400">{state.errors}</div>
        </div>
      </div>
    </div>
  )
}
