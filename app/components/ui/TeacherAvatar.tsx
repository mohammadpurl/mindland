// ============================================
// TeacherAvatar — معلم انیمیشنی
// ============================================
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import type { TeacherState } from '@/lib/animation-types'

interface Props {
  teacher: TeacherState
  size?: number
}

const EMOTION_COLORS = {
  happy:       { shirt: '#185FA5', mouth: 'M25 38 Q30 44 35 38' },
  encouraging: { shirt: '#0F6E56', mouth: 'M25 38 Q30 43 35 38' },
  explaining:  { shirt: '#185FA5', mouth: 'M26 39 Q30 42 34 39' },
  celebrating: { shirt: '#993C1D', mouth: 'M24 38 Q30 46 36 38' },
}

export function TeacherAvatar({ teacher, size = 80 }: Props) {
  const svgRef  = useRef<SVGSVGElement>(null)
  const mouthRef = useRef<SVGPathElement>(null)
  const bodyRef  = useRef<SVGRectElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval>>()

  // idle float
  useEffect(() => {
    if (!svgRef.current) return
    const tween = gsap.to(svgRef.current, {
      y: -5, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut',
    })
    return () => { tween.kill() }
  }, [])

  // talking mouth
  useEffect(() => {
    clearInterval(timerRef.current)
    if (!teacher.speaking || !mouthRef.current) return
    let t = 0
    const base = EMOTION_COLORS[teacher.emotion].mouth
    timerRef.current = setInterval(() => {
      t++
      const o = Math.sin(t * 0.7) * 2.5
      const pts = base.split(' ')
      // shift Q control point y
      const updated = pts.map((pt, i) => {
        if (i === 2) {
          const parts = pt.split(',')
          return `${parts[0]},${parseFloat(parts[1]) + o}`
        }
        return pt
      }).join(' ')
      mouthRef.current!.setAttribute('d', updated)
      if (t > 30) clearInterval(timerRef.current)
    }, 80)
    return () => clearInterval(timerRef.current)
  }, [teacher.speaking, teacher.emotion])

  // emotion body color
  useEffect(() => {
    if (!bodyRef.current) return
    gsap.to(bodyRef.current, { fill: EMOTION_COLORS[teacher.emotion].shirt, duration: 0.4 })
    if (teacher.emotion === 'celebrating' && svgRef.current) {
      gsap.fromTo(svgRef.current,
        { rotation: -8 }, { rotation: 8, duration: 0.15, repeat: 5, yoyo: true, ease: 'none',
          onComplete: () => gsap.set(svgRef.current!, { rotation: 0 }) })
    }
  }, [teacher.emotion])

  const sc = size / 100

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Speech bubble */}
      {teacher.message && (
        <div
          className="bg-white border-2 border-blue-400 rounded-2xl rounded-br-sm px-3 py-2
                     text-sm text-gray-800 leading-relaxed max-w-[180px] shadow-md"
          style={{ fontSize: Math.max(11, size * 0.14) }}
        >
          {teacher.message}
        </div>
      )}

      <svg
        ref={svgRef}
        width={size}
        height={size * 1.4}
        viewBox="0 0 100 140"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hair */}
        <ellipse cx="50" cy="28" rx="22" ry="16" fill="#4A2C17" />
        {/* Head */}
        <ellipse cx="50" cy="42" rx="18" ry="20" fill="#F5C5A3" />
        {/* Eyes white */}
        <circle cx="43" cy="40" r="4" fill="white" />
        <circle cx="57" cy="40" r="4" fill="white" />
        {/* Pupils */}
        <circle cx="43" cy="40" r="2.2" fill="#2C2C2A" />
        <circle cx="57" cy="40" r="2.2" fill="#2C2C2A" />
        {/* Eye shine */}
        <circle cx="44" cy="39" r="0.8" fill="white" />
        <circle cx="58" cy="39" r="0.8" fill="white" />
        {/* Mouth */}
        <path
          ref={mouthRef}
          d={EMOTION_COLORS[teacher.emotion].mouth}
          stroke="#8B4513" strokeWidth="1.8" fill="none" strokeLinecap="round"
        />
        {/* Body */}
        <rect ref={bodyRef} x="30" y="62" width="40" height="48" rx="6" fill="#185FA5" />
        {/* Collar */}
        <rect x="43" y="62" width="14" height="12" rx="2" fill="#F5C5A3" />
        {/* Arms */}
        <line x1="30" y1="68" x2="14" y2="92" stroke="#F5C5A3" strokeWidth="7" strokeLinecap="round" />
        <line x1="70" y1="68" x2="86" y2="92" stroke="#F5C5A3" strokeWidth="7" strokeLinecap="round" />
        {/* Legs */}
        <line x1="42" y1="110" x2="36" y2="135" stroke="#F5C5A3" strokeWidth="7" strokeLinecap="round" />
        <line x1="58" y1="110" x2="64" y2="135" stroke="#F5C5A3" strokeWidth="7" strokeLinecap="round" />
      </svg>
    </div>
  )
}
