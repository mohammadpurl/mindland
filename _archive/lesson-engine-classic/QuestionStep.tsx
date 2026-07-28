'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { QuestionStep as QuestionStepType } from '@/lib/lesson-engine/types'

interface Props {
  step: QuestionStepType
  onAnswer: (optionId: string) => boolean
}

export function QuestionStep({ step, onAnswer }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const ctx = gsap.context(() => {
      gsap.from('.lesson-option', {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.45,
        ease: 'back.out(1.6)',
      })
    }, rootRef)
    return () => ctx.revert()
  }, [step.id])

  return (
    <div ref={rootRef} className="w-full max-w-xl mx-auto">
      <h3 className="text-lg md:text-xl font-extrabold text-white mb-4 text-center leading-8">
        {step.question}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {step.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="lesson-option rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20
                       text-white font-bold py-4 px-3 transition-colors"
            onClick={() => onAnswer(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
