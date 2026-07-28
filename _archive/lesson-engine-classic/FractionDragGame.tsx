// ============================================
// FractionDragGame — بازی کسر با Drag & Drop
// ============================================
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { TeacherAvatar } from '@/app/components/ui/TeacherAvatar'
import { GameHUD } from '@/app/components/ui/GameHUD'
import { LevelComplete } from '@/app/components/ui/LevelComplete'
import { useGameState } from '@/hooks/useGameState'
import type { TeacherState } from '@/lib/animation-types'

interface Level {
  denom: number
  target: number
  label: string
  hint: string
  color: string
}

const LEVELS: Level[] = [
  { denom: 4, target: 1, label: 'مرحله ۱', hint: '۱ برش از ۴ بکش! 🍕',         color: '#FF8C42' },
  { denom: 4, target: 2, label: 'مرحله ۲', hint: '۲ تا از ۴ برش بکش! 💪',      color: '#FF6B35' },
  { denom: 6, target: 3, label: 'مرحله ۳', hint: '۳ تا از ۶ برش — نیمه پیتزا!',color: '#42A5F5' },
  { denom: 6, target: 4, label: 'مرحله ۴', hint: '۴ تا از ۶ بکش — دقیق باش!', color: '#AB47BC' },
  { denom: 8, target: 5, label: 'مرحله ۵', hint: '۵ تا از ۸ برش — آخرین مرحله!', color: '#4CAF50' },
]

const NS = 'http://www.w3.org/2000/svg'

function buildPizzaSVG(
  el: SVGSVGElement,
  denom: number,
  filled: number,
  color: string,
  size = 106
) {
  el.innerHTML = ''
  const cx = size / 2, cy = size / 2, r = size / 2 - 5
  const bg = document.createElementNS(NS, 'circle')
  Object.entries({ cx, cy, r, fill: '#2a1a0a', stroke: '#D4A017', 'stroke-width': '2' })
    .forEach(([k, v]) => bg.setAttribute(k, String(v)))
  el.appendChild(bg)

  for (let i = 0; i < denom; i++) {
    const a1 = (i / denom) * Math.PI * 2 - Math.PI / 2
    const a2 = ((i + 1) / denom) * Math.PI * 2 - Math.PI / 2
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1)
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2)
    const p = document.createElementNS(NS, 'path')
    p.setAttribute('d', `M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`)
    p.setAttribute('fill', i < filled ? color : 'rgba(255,255,255,0.05)')
    p.setAttribute('stroke', '#D4A017')
    p.setAttribute('stroke-width', '1.5')
    el.appendChild(p)
    if (i < filled) {
      const ma = (a1 + a2) / 2
      const dot = document.createElementNS(NS, 'circle')
      dot.setAttribute('cx', String(cx + r * 0.58 * Math.cos(ma)))
      dot.setAttribute('cy', String(cy + r * 0.58 * Math.sin(ma)))
      dot.setAttribute('r', '3')
      dot.setAttribute('fill', '#8B4513')
      el.appendChild(dot)
    }
  }
  const cap = document.createElementNS(NS, 'circle')
  Object.entries({ cx, cy, r: 6, fill: '#D4A017' })
    .forEach(([k, v]) => cap.setAttribute(k, String(v)))
  el.appendChild(cap)
}

function buildSliceEl(i: number, denom: number, color: string, size = 72): HTMLDivElement {
  const div = document.createElement('div')
  div.className = 'absolute cursor-grab touch-none select-none'
  div.style.width = size + 'px'
  div.style.height = size + 'px'
  div.dataset.idx = String(i)

  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('width', String(size))
  svg.setAttribute('height', String(size))
  svg.setAttribute('viewBox', `-${size / 2} -${size / 2} ${size} ${size}`)

  const r = size * 0.44
  const a1 = (i / denom) * Math.PI * 2 - Math.PI / 2
  const a2 = ((i + 1) / denom) * Math.PI * 2 - Math.PI / 2
  const x1 = r * Math.cos(a1), y1 = r * Math.sin(a1)
  const x2 = r * Math.cos(a2), y2 = r * Math.sin(a2)

  const p = document.createElementNS(NS, 'path')
  p.setAttribute('d', `M0,0 L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`)
  p.setAttribute('fill', color)
  p.setAttribute('stroke', '#D4A017')
  p.setAttribute('stroke-width', '1.5')
  svg.appendChild(p)

  const ma = (a1 + a2) / 2
  const dot = document.createElementNS(NS, 'circle')
  dot.setAttribute('cx', String(r * 0.55 * Math.cos(ma)))
  dot.setAttribute('cy', String(r * 0.55 * Math.sin(ma)))
  dot.setAttribute('r', '3')
  dot.setAttribute('fill', '#8B4513')
  svg.appendChild(dot)
  div.appendChild(svg)
  return div
}

export function FractionDragGame({
  embedded = false,
  onAllLevelsComplete,
}: {
  embedded?: boolean
  onAllLevelsComplete?: () => void
} = {}) {
  const sceneRef    = useRef<HTMLDivElement>(null)
  const srcPizzaRef = useRef<SVGSVGElement>(null)
  const destPizzaRef= useRef<SVGSVGElement>(null)
  const destZoneRef = useRef<HTMLDivElement>(null)
  const layerRef    = useRef<HTMLDivElement>(null)

  const { state, addError, completeLevel, nextLevel, reset } = useGameState(LEVELS.length)
  const [levelDone, setLevelDone] = useState(false)
  const [levelStars, setLevelStars] = useState<1|2|3>(3)
  const [dropped, setDropped] = useState(0)
  const droppedRef = useRef(0)
  const errorsRef  = useRef(0)

  const [teacher, setTeacher] = useState<TeacherState>({
    speaking: true,
    message: LEVELS[0].hint,
    emotion: 'explaining',
  })

  const lv = LEVELS[Math.min(state.currentLevel, LEVELS.length - 1)]

  const spawnSlices = useCallback(() => {
    if (!layerRef.current || !sceneRef.current || !destZoneRef.current) return
    layerRef.current.innerHTML = ''
    droppedRef.current = 0
    errorsRef.current  = 0
    setDropped(0)

    const sceneR = sceneRef.current.getBoundingClientRect()
    const srcEl  = sceneRef.current.querySelector<HTMLElement>('#srcZone')
    if (!srcEl) return
    const srcR = srcEl.getBoundingClientRect()
    const bx = srcR.left - sceneR.left + srcR.width  / 2 - 36
    const by = srcR.top  - sceneR.top  + srcR.height / 2 - 36

    for (let i = 0; i < lv.denom; i++) {
      const sl = buildSliceEl(i, lv.denom, lv.color)
      layerRef.current.appendChild(sl)
      gsap.set(sl, { x: bx, y: by })
      gsap.from(sl, { scale: 0, opacity: 0, duration: 0.35, delay: i * 0.06, ease: 'back.out(2)' })

      // --- drag logic ---
      let offX = 0, offY = 0

      const onDown = (e: PointerEvent) => {
        e.preventDefault()
        offX = e.clientX - (parseFloat(sl.style.transform?.match(/translateX\((.+)px\)/)?.[1] ?? '0') || gsap.getProperty(sl, 'x') as number)
        offY = e.clientY - (gsap.getProperty(sl, 'y') as number)
        sl.classList.replace('cursor-grab', 'cursor-grabbing')
        gsap.to(sl, { scale: 1.3, duration: 0.15, ease: 'back.out(2)' })
        sl.setPointerCapture(e.pointerId)
        sl.addEventListener('pointermove', onMove)
        sl.addEventListener('pointerup', onUp)
      }

      const onMove = (e: PointerEvent) => {
        if (!sceneRef.current) return
        const sr = sceneRef.current.getBoundingClientRect()
        gsap.set(sl, { x: e.clientX - sr.left - offX, y: e.clientY - sr.top - offY })
        const dz = destZoneRef.current!.getBoundingClientRect()
        const over = e.clientX > dz.left && e.clientX < dz.right && e.clientY > dz.top && e.clientY < dz.bottom
        destZoneRef.current!.style.borderColor = over ? '#FFD54F' : 'rgba(255,255,255,0.3)'
      }

      const onUp = (e: PointerEvent) => {
        sl.removeEventListener('pointermove', onMove)
        sl.removeEventListener('pointerup', onUp)
        sl.classList.replace('cursor-grabbing', 'cursor-grab')
        destZoneRef.current!.style.borderColor = 'rgba(255,255,255,0.3)'

        if (!sceneRef.current || !destZoneRef.current) return
        const dz = destZoneRef.current.getBoundingClientRect()
        const over = e.clientX > dz.left && e.clientX < dz.right && e.clientY > dz.top && e.clientY < dz.bottom

        if (over) {
          droppedRef.current += 1
          const cur = droppedRef.current
          setDropped(cur)

          // animate slice into dest
          const dr = destZoneRef.current.getBoundingClientRect()
          const sr = sceneRef.current.getBoundingClientRect()
          const tx = dr.left - sr.left + dr.width  / 2 - 36
          const ty = dr.top  - sr.top  + dr.height / 2 - 36
          gsap.to(sl, {
            x: tx, y: ty, scale: 0, opacity: 0, duration: 0.35, ease: 'back.in(1.5)',
            onComplete: () => {
              sl.remove()
              if (destPizzaRef.current) buildPizzaSVG(destPizzaRef.current, lv.denom, cur, lv.color)
            },
          })

          if (cur === lv.target) {
            // ✅ correct
            const { stars } = completeLevel(errorsRef.current)
            if (embedded) {
              setTeacher({ speaking: true, message: 'آفرین! 🎉 درسته!', emotion: 'celebrating' })
              setTimeout(() => onAllLevelsComplete?.(), 700)
              return
            }
            setLevelStars(stars as 1|2|3)
            setTeacher({ speaking: true, message: 'آفرین! 🎉 درسته!', emotion: 'celebrating' })
            setTimeout(() => setLevelDone(true), 700)

          } else if (cur > lv.target) {
            // ❌ too many
            errorsRef.current += 1
            addError()
            setTeacher({ speaking: true, message: 'اوه! زیاد شد! دوباره امتحان کن 😅', emotion: 'encouraging' })
            gsap.fromTo(destZoneRef.current, { x: -6 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' })
            setTimeout(() => {
              if (destPizzaRef.current) buildPizzaSVG(destPizzaRef.current, lv.denom, 0, lv.color)
              setTeacher({ speaking: true, message: lv.hint, emotion: 'explaining' })
              spawnSlices()
            }, 900)
          } else {
            const rem = lv.target - cur
            setTeacher({ speaking: true, message: `${rem} تا دیگه! 💪`, emotion: 'encouraging' })
          }
        } else {
          // snap back
          const sr = sceneRef.current.getBoundingClientRect()
          const srcEl = sceneRef.current.querySelector<HTMLElement>('#srcZone')!
          const srcR2 = srcEl.getBoundingClientRect()
          gsap.to(sl, {
            x: srcR2.left - sr.left + srcR2.width / 2 - 36,
            y: srcR2.top  - sr.top  + srcR2.height / 2 - 36,
            scale: 1, duration: 0.4, ease: 'back.out(1.5)',
          })
        }
      }

      sl.addEventListener('pointerdown', onDown)
    }
  }, [lv, addError, completeLevel, embedded, onAllLevelsComplete])

  // init / level change
  useEffect(() => {
    setLevelDone(false)
    setDropped(0)
    setTeacher({ speaking: true, message: lv.hint, emotion: 'explaining' })
    if (srcPizzaRef.current)  buildPizzaSVG(srcPizzaRef.current,  lv.denom, lv.denom, lv.color)
    if (destPizzaRef.current) buildPizzaSVG(destPizzaRef.current, lv.denom, 0, lv.color)
    const t = setTimeout(spawnSlices, 100)
    return () => clearTimeout(t)
  }, [state.currentLevel]) // eslint-disable-line

  const handleNext = () => {
    if (embedded && state.currentLevel >= LEVELS.length - 1) {
      onAllLevelsComplete?.()
      return
    }
    nextLevel()
    setLevelDone(false)
  }

  const handleReplay = () => {
    setLevelDone(false)
    if (destPizzaRef.current) buildPizzaSVG(destPizzaRef.current, lv.denom, 0, lv.color)
    spawnSlices()
  }

  return (
    <div className={`w-full mx-auto font-sans ${embedded ? 'max-w-none p-0' : 'max-w-2xl p-3'}`} dir="rtl">
      {!embedded && <GameHUD state={state} levelLabel={lv.label} />}

      {/* Scene */}
      <div
        ref={sceneRef}
        className="relative rounded-2xl overflow-hidden"
        style={{
          height: 380,
          background: 'linear-gradient(160deg,#0f3460 0%,#16213e 60%,#0f3460 100%)',
        }}
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-b from-green-700 to-green-900 rounded-b-2xl" />
        <div className="absolute bottom-12 left-0 right-0 h-1 bg-green-500/50" />

        {/* Teacher */}
        {!embedded && (
          <div className="absolute bottom-12 right-4 z-10">
            <TeacherAvatar teacher={teacher} size={70} />
          </div>
        )}

        {/* Source pizza */}
        <div className="absolute flex flex-col items-center gap-1" style={{ left: 60, bottom: 56 }}>
          <span className="text-xs font-bold text-white/70 bg-black/30 rounded px-2 py-0.5">پیتزای علی</span>
          <div id="srcZone" className="rounded-full border-2 border-dashed border-white/30" style={{ width: 114, height: 114 }}>
            <svg ref={srcPizzaRef} width="110" height="110" viewBox="0 0 110 110" />
          </div>
        </div>

        {/* Destination pizza */}
        <div className="absolute flex flex-col items-center gap-1" style={{ left: '50%', transform: 'translateX(-50%)', bottom: 56 }}>
          <span className="text-xs font-bold text-white/70 bg-black/30 rounded px-2 py-0.5">پیتزای نتیجه</span>
          <div
            ref={destZoneRef}
            className="rounded-full border-2 border-dashed transition-all duration-150"
            style={{ width: 114, height: 114, borderColor: 'rgba(255,255,255,0.3)' }}
          >
            <svg ref={destPizzaRef} width="110" height="110" viewBox="0 0 110 110" />
          </div>
          {/* Fraction badge */}
          <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl px-3 py-1 mt-1">
            <span className="text-lg font-bold text-yellow-400">{dropped > 0 ? dropped : '?'}</span>
            <div className="w-6 h-px bg-white/60 my-0.5" />
            <span className="text-base text-white/80">{lv.denom}</span>
          </div>
        </div>

        {/* Target fraction */}
        <div className="absolute bottom-14 left-4 flex flex-col items-center gap-1">
          <span className="text-[10px] text-white/50">هدف</span>
          <div className="flex flex-col items-center bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-3 py-1">
            <span className="text-lg font-bold text-yellow-400">{lv.target}</span>
            <div className="w-6 h-px bg-yellow-400/60 my-0.5" />
            <span className="text-base text-white/80">{lv.denom}</span>
          </div>
        </div>

        {/* Draggable slices layer */}
        <div ref={layerRef} className="absolute inset-0 pointer-events-none" style={{ pointerEvents: 'none' }}>
          {/* slices injected here */}
        </div>
        {/* override pointer-events for slice children */}
        <style>{`.absolute.cursor-grab{pointer-events:auto}`}</style>

        {/* Level complete overlay */}
        {levelDone && (
          <LevelComplete
            stars={levelStars}
            score={state.score}
            isLast={state.currentLevel >= LEVELS.length - 1}
            onNext={handleNext}
            onReplay={handleReplay}
          />
        )}
      </div>
    </div>
  )
}
