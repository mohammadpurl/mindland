'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  animationId: string
}

export function LessonAnimateStage({ animationId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      if (animationId === 'fraction-intro') {
        tl.from('.pizza-slice', {
          scale: 0,
          rotation: -30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.5,
          ease: 'back.out(2)',
        })
        tl.to('.pizza-glow', {
          scale: 1.08,
          repeat: 2,
          yoyo: true,
          duration: 0.6,
          ease: 'sine.inOut',
        })
      } else {
        tl.from(rootRef.current, { opacity: 0, y: 20, duration: 0.5 })
      }
    }, rootRef)
    return () => ctx.revert()
  }, [animationId])

  if (animationId !== 'fraction-intro') {
    return (
      <div ref={rootRef} className="h-40 flex items-center justify-center text-white/70">
        انیمیشن «{animationId}» در حال اجراست
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative h-52 flex items-center justify-center">
      <div className="pizza-glow absolute w-40 h-40 rounded-full bg-orange-400/20 blur-2xl" />
      <div className="relative w-36 h-36 rounded-full border-2 border-yellow-300/70 bg-orange-500/20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="pizza-slice absolute inset-2 rounded-full"
            style={{
              background: `conic-gradient(from ${i * 90}deg, rgba(251,146,60,0.95) 0deg 80deg, transparent 80deg)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
