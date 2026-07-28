// ============================================
// LevelComplete — پنجره پایان مرحله
// ============================================
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface Props {
  stars: 1 | 2 | 3
  score: number
  isLast: boolean
  onNext: () => void
  onReplay: () => void
}

const MESSAGES = {
  3: { emoji: '🏆', title: 'عالی! بدون هیچ اشتباهی!', color: 'text-yellow-400' },
  2: { emoji: '🌟', title: 'آفرین! خیلی خوب بود!',   color: 'text-blue-300' },
  1: { emoji: '👍', title: 'خوب بود! دوباره تمرین کن!', color: 'text-green-300' },
}

export function LevelComplete({ stars, score, isLast, onNext, onReplay }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const starsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!wrapRef.current) return
    gsap.fromTo(wrapRef.current,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
    )
    // stagger star reveal
    if (starsRef.current) {
      const starEls = starsRef.current.children
      gsap.fromTo(starEls,
        { scale: 0, rotation: -30 },
        { scale: 1, rotation: 0, duration: 0.4, stagger: 0.15, ease: 'back.out(2)', delay: 0.3 }
      )
    }
    // confetti
    const colors = ['#FF6B35','#42A5F5','#FFD54F','#AB47BC','#4CAF50']
    for (let i = 0; i < 24; i++) {
      const el = document.createElement('div')
      el.style.cssText = `position:fixed;width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;
        border-radius:50%;background:${colors[i%colors.length]};
        left:${30+Math.random()*40}%;top:${20+Math.random()*30}%;z-index:1000;pointer-events:none`
      document.body.appendChild(el)
      const ang = Math.random() * Math.PI * 2
      gsap.fromTo(el,
        { x: 0, y: 0, opacity: 1, scale: 1 },
        { x: Math.cos(ang)*(80+Math.random()*100), y: Math.sin(ang)*(60+Math.random()*80),
          opacity: 0, scale: 0, duration: 1.2+Math.random()*0.6, ease: 'power2.out',
          delay: Math.random()*0.3, onComplete: () => el.remove() }
      )
    }
  }, [])

  const msg = MESSAGES[stars]

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl
                    flex flex-col items-center justify-center gap-4 z-50">
      <div ref={wrapRef} className="flex flex-col items-center gap-4">
        <div className="text-6xl animate-bounce">{msg.emoji}</div>
        <h2 className={`text-xl font-bold text-center ${msg.color}`}>{msg.title}</h2>
        <div className="text-white/60 text-sm">امتیاز کسب‌شده: <span className="text-yellow-400 font-bold">{score}</span></div>

        <div ref={starsRef} className="flex gap-2 text-4xl">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className={i < stars ? '' : 'opacity-20'}>
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onReplay}
            className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10
                       text-white text-sm font-medium hover:bg-white/20 transition-all"
          >
            ↺ دوباره
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400
                       text-gray-900 text-sm font-bold hover:scale-105 transition-all"
          >
            {isLast ? '🎊 تمام شد!' : 'مرحله بعدی ←'}
          </button>
        </div>
      </div>
    </div>
  )
}
