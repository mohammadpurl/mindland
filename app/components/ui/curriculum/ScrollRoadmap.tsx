'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Lock, Rocket, Zap } from 'lucide-react'
import {
  buildDefaultPlanetStations,
  buildFlightPath,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  VIEW_W,
  type PlanetCategory,
  type PlanetStation,
} from './planetStations'

export type { PlanetCategory, PlanetStation }
export {
  buildDefaultPlanetStations,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
}

export interface ScrollRoadmapProps {
  lang: string
  stations?: PlanetStation[]
  className?: string
  title?: string
  subtitle?: string
  pageHeader?: ReactNode
  children?: ReactNode
  fullBleed?: boolean
}

interface PathPoint {
  x: number
  y: number
  angle: number
}

function samplePath(path: SVGPathElement, t: number, totalLen: number): PathPoint {
  const len = Math.min(totalLen, Math.max(0, t * totalLen))
  const p = path.getPointAtLength(len)
  const look = Math.min(totalLen, len + 2)
  const p2 = path.getPointAtLength(look)
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI
  return { x: p.x, y: p.y, angle }
}

/** فضاپیمای موشکی — بدنهٔ سفید، بالهٔ قرمز، شعلهٔ چشمک‌زن */
function Spaceship({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle + 90})`} aria-hidden>
      <motion.path
        d="M 0 15 C 4 15 7 22 7 28 C 7 24 3 21 0 21 C -3 21 -7 24 -7 28 C -7 22 -4 15 0 15 Z"
        fill="url(#flame-grad)"
        animate={{ scaleY: [1, 0.6, 1], opacity: [0.95, 0.65, 0.95] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '0px 15px' }}
      />
      <path d="M -6 6 L -11 15 L -3 11 Z" fill="#EF4444" stroke="#991B1B" strokeWidth={0.6} />
      <path d="M 6 6 L 11 15 L 3 11 Z" fill="#EF4444" stroke="#991B1B" strokeWidth={0.6} />
      <path d="M 0 -17 C 6 -12 8 2 8 15 C 8 17 -8 17 -8 15 C -8 2 -6 -12 0 -17 Z" fill="url(#body-grad)" stroke="#94A3B8" strokeWidth={0.8} />
      <path d="M 0 -17 C 3 -14 4.5 -8 4.5 -3 C 4.5 0 -4.5 0 -4.5 -3 C -4.5 -8 -3 -14 0 -17 Z" fill="#EF4444" />
      <circle cx={0} cy={2} r={3.4} fill="#7DD3FC" stroke="#F1F5F9" strokeWidth={1.1} />
      <circle cx={0} cy={2} r={1.5} fill="#0EA5E9" />
    </g>
  )
}

function StarField({ seed = 1, viewH }: { seed?: number; viewH: number }) {
  const stars = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = []
    let s = seed * 9973
    const rnd = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }
    for (let i = 0; i < 160; i++) {
      out.push({
        x: rnd() * VIEW_W,
        y: rnd() * viewH,
        r: 0.4 + rnd() * 1.7,
        o: 0.25 + rnd() * 0.7,
      })
    }
    return out
  }, [seed, viewH])

  return (
    <g aria-hidden>
      {stars.map((st, i) => (
        <motion.circle
          key={i}
          cx={st.x}
          cy={st.y}
          r={st.r}
          fill={i % 5 === 0 ? '#FFE9C9' : i % 3 === 0 ? '#CFE3FF' : '#FFFFFF'}
          animate={{ opacity: [st.o * 0.4, st.o, st.o * 0.4] }}
          transition={{ duration: 3 + (i % 5), repeat: Infinity, ease: 'easeInOut', delay: (i % 7) * 0.3 }}
        />
      ))}
    </g>
  )
}

/** حلقهٔ چرخان نقطه‌دار دور سیاره — حس مدار */
function OrbitRing({ size = 150 }: { size?: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full border border-dashed border-white/15"
      style={{ inset: -16, width: size + 32, height: size + 32 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
    >
      <span
        className="absolute -top-[3px] left-1/2 h-[9px] w-[9px] -translate-x-1/2 rounded-full"
        style={{ background: '#E2E8FF', boxShadow: '0 0 10px rgba(226,232,255,0.9)' }}
      />
    </motion.div>
  )
}

function PlanetCard({
  station,
  x,
  y,
  active,
  reducedMotion,
  side,
  viewH,
  index,
}: {
  station: PlanetStation
  x: number
  y: number
  active: boolean
  reducedMotion: boolean
  side: 'left' | 'right'
  viewH: number
  index: number
}) {
  const locked = Boolean(station.locked)
  const glow = station.glow ?? `${station.accent}55`
  const ring = station.ring ?? `${station.accent}80`
  const num = String(index + 1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

  const planet = (
    <motion.div
      className="pointer-events-none absolute h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 md:h-[92px] md:w-[92px]"
      animate={reducedMotion ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 6 + (index % 3), repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="absolute rounded-full blur-xl"
        style={{ inset: -18, background: `radial-gradient(circle, ${glow} 0%, transparent 68%)` }}
        aria-hidden
      />
      <OrbitRing size={92} />
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background: `linear-gradient(145deg, ${station.planetFrom}, ${station.planetTo})`,
          boxShadow: `inset -14px -18px 32px rgba(0,0,0,0.5), inset 10px 12px 22px rgba(255,255,255,0.22), 0 14px 34px rgba(0,0,0,0.45)${active ? `, 0 0 24px ${glow}` : ''}`,
        }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(14px 9px at 28% 32%, rgba(0,0,0,0.22), transparent 70%), radial-gradient(20px 12px at 66% 58%, rgba(0,0,0,0.18), transparent 70%), radial-gradient(11px 8px at 44% 76%, rgba(255,255,255,0.2), transparent 70%)',
          }}
        />
        <div className="absolute inset-x-[-10%] top-[56%] h-[10px] rotate-[-3deg] bg-white/12 blur-[2px]" />
      </div>
      <div
        className="absolute inset-x-[-22%] top-[45%] h-4 -rotate-[14deg] rounded-full"
        style={{ border: `4px solid ${ring}`, boxShadow: '0 0 14px rgba(255,255,255,0.12)' }}
        aria-hidden
      />
      <span className="absolute -right-1.5 -top-2.5 rounded-full border border-white/20 bg-[#0b1030] px-1.5 py-0.5 text-[10px] font-bold text-sky-100 shadow">
        {num}
      </span>
      {locked ? (
        <span className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/90 text-slate-300 ring-1 ring-white/20">
          <Lock className="h-3 w-3" />
        </span>
      ) : null}
      <div className="flex h-full w-full items-center justify-center text-2xl md:text-3xl" aria-hidden>
        {station.emoji}
      </div>
    </motion.div>
  )

  const card = (
    <motion.div
      initial={false}
      animate={{
        opacity: active ? 1 : 0.5,
        scale: active ? 1 : 0.94,
      }}
      whileHover={locked ? undefined : { y: -4 }}
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
      className={[
        'absolute top-0 w-[15.5rem] -translate-y-1/2 sm:w-[16.5rem] md:w-[18rem]',
        locked ? 'cursor-not-allowed' : 'cursor-pointer',
        side === 'left' ? 'right-[5.5rem] md:right-[6.5rem]' : 'left-[5.5rem] md:left-[6.5rem]',
      ].join(' ')}
    >
      <div
        className="relative rounded-[22px] border p-4 shadow-2xl backdrop-blur-md md:p-5"
        style={{
          background: 'rgba(14,19,50,0.72)',
          borderColor: active ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.14)',
        }}
      >
        <div className="mb-1.5 flex items-center gap-2 text-[11px] text-slate-300 md:text-xs">
          <span className="rounded-full bg-white/8 px-2.5 py-1 font-bold" style={{ backgroundColor: 'rgba(255,255,255,.08)' }}>
            {station.level ?? CATEGORY_LABELS[station.category]}
          </span>
          <span>{station.lessonsCount ?? station.highlights.length} درس</span>
          {locked ? <span className="text-slate-500">· به‌زودی</span> : null}
        </div>
        <h3 className="mb-1.5 text-base font-extrabold text-white md:text-lg">{station.label}</h3>
        <p className="text-[13px] leading-7 text-slate-300 md:text-sm">{station.learn}</p>

        {station.prerequisites && station.prerequisites.length > 0 ? (
          <div className="mt-2.5 space-y-1 border-t border-white/10 pt-2">
            <p className="text-[10px] font-bold text-slate-500 md:text-[11px]">پیش‌نیاز (ارجاع):</p>
            <ul className="flex flex-wrap gap-1">
              {station.prerequisites.map((p) => (
                <li key={p.href}>
                  <span className="inline-block rounded-md bg-sky-950/80 px-2 py-0.5 text-[10px] font-bold text-sky-200 md:text-[11px]">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-3.5 flex items-center gap-2.5">
          {!locked ? (
            <span
              className="rounded-xl px-4 py-2 text-[13px] font-extrabold text-[#06121f]"
              style={{ background: 'linear-gradient(120deg,#22d3ee,#6366f1)' }}
            >
              فرود روی سیاره
            </span>
          ) : (
            <span className="rounded-xl border border-white/15 px-4 py-2 text-[13px] font-bold text-slate-400">
              به‌زودی باز می‌شود
            </span>
          )}
          {station.xp ? (
            <span className="flex items-center gap-1 text-[12px] font-bold text-amber-200/90">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              {station.xp} امتیاز
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  )

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left: `${(x / VIEW_W) * 100}%`,
    top: `${(y / viewH) * 100}%`,
    zIndex: active ? 30 : 10,
  }

  const inner = (
    <div className="relative" style={{ width: 0, height: 0 }}>
      {planet}
      {card}
    </div>
  )

  if (locked) {
    return (
      <div style={wrapStyle} role="presentation">
        {inner}
      </div>
    )
  }

  return (
    <Link href={station.href} style={wrapStyle} aria-label={`${station.label}: ${station.learn}`}>
      {inner}
    </Link>
  )
}

function PlanetWithProgress({
  station,
  x,
  y,
  progress,
  reducedMotion,
  side,
  inView,
  viewH,
  index,
}: {
  station: PlanetStation
  x: number
  y: number
  progress: MotionValue<number>
  reducedMotion: boolean
  side: 'left' | 'right'
  inView: boolean
  viewH: number
  index: number
}) {
  const [active, setActive] = useState(() => progress.get() >= station.t)

  useMotionValueEvent(progress, 'change', (v) => {
    if (!inView && !reducedMotion) return
    setActive(v >= station.t - 0.01)
  })

  return (
    <PlanetCard
      station={station}
      x={x}
      y={y}
      active={active}
      reducedMotion={reducedMotion}
      side={side}
      viewH={viewH}
      index={index}
    />
  )
}

/**
 * سفر فضایی مسیر یادگیری — سیاره‌ها به‌عنوان ایستگاه + فضاپیما روی مسیر پرواز
 */
export function ScrollRoadmap({
  lang,
  stations: stationsProp,
  className = '',
  title = 'کهکشان یادگیری مایلند',
  subtitle = 'سوار سفینه شو و از سیاره‌ای به سیاره‌ی بعد سفر کن — هر سیاره یک مهارت تازه است.',
  pageHeader,
  children,
  fullBleed = true,
}: ScrollRoadmapProps) {
  const stations = useMemo(
    () => stationsProp ?? buildDefaultPlanetStations(lang),
    [stationsProp, lang]
  )
  const { d: pathD, viewH } = useMemo(() => buildFlightPath(stations.length), [stations.length])
  const reducedMotion = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const pathLenRef = useRef(0)
  const [pathLen, setPathLen] = useState(0)
  const [inView, setInView] = useState(true)
  const [stationPts, setStationPts] = useState<PathPoint[]>([])
  const [ship, setShip] = useState<PathPoint>({ x: 200, y: 60, angle: 90 })
  const [progressPct, setProgressPct] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 85,
    damping: reducedMotion ? 100 : 26,
    restDelta: 0.001,
  })

  const progress = reducedMotion ? scrollYProgress : smoothProgress

  /** بخش طی‌شدهٔ مسیر — با نور آبی روشن مشخص می‌شود */
  const trailDashoffset = useTransform(progress, (v) => {
    const len = pathLenRef.current
    return len > 0 ? len * (1 - v) : 0
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false
        setInView(visible)
        if (visible) {
          const path = pathRef.current
          const total = pathLenRef.current
          if (path && total > 0) {
            const v = progress.get()
            setShip(samplePath(path, v, total))
            setProgressPct(Math.round(v * 100))
          }
        }
      },
      { root: null, rootMargin: '120px 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [progress])

  const recompute = useCallback(() => {
    const path = pathRef.current
    if (!path) return
    const total = path.getTotalLength()
    pathLenRef.current = total
    setPathLen(total)
    setStationPts(stations.map((s) => samplePath(path, s.t, total)))
    const v = progress.get()
    setShip(samplePath(path, v, total))
    setProgressPct(Math.round(v * 100))
  }, [stations, progress])

  useEffect(() => {
    recompute()
    window.addEventListener('resize', recompute)
    return () => window.removeEventListener('resize', recompute)
  }, [recompute])

  useMotionValueEvent(progress, 'change', (v) => {
    if (!inView) return
    const path = pathRef.current
    const total = pathLenRef.current
    if (!path || total <= 0) return
    setShip(samplePath(path, v, total))
    setProgressPct(Math.round(v * 100))
  })

  return (
    <section
      ref={sectionRef}
      className={`relative isolate w-full overflow-hidden ${className}`}
      dir="rtl"
      aria-labelledby="space-journey-heading"
      data-full-bleed={fullBleed ? 'true' : 'false'}
      style={{ background: '#050718' }}
    >
      {/* هدر — سحابی بنفش با ستاره‌های چشمک‌زن */}
      <div
        className="relative pb-1"
        style={{ background: 'radial-gradient(120% 90% at 50% -10%, #2b1b6b 0%, #150f3d 45%, #070a1f 100%)' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {Array.from({ length: 24 }).map((_, i) => {
            const left = ((i * 37) % 100)
            const top = ((i * 53) % 90) + 4
            return (
              <motion.span
                key={i}
                className="absolute h-[3px] w-[3px] rounded-full bg-white"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: (i % 6) * 0.4 }}
              />
            )
          })}
        </div>

        {pageHeader ? (
          <div className="relative mx-auto max-w-5xl px-4 pt-6 text-slate-100 md:pt-8">{pageHeader}</div>
        ) : null}

        <div className="relative mx-auto max-w-3xl px-4 pb-7 pt-2 text-center md:pb-9">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1.5 text-[13px] text-[#cbd5ff]">
            <Rocket className="h-3.5 w-3.5" aria-hidden />
            مسیر کهکشانی {title}
          </p>
          <h2
            id="space-journey-heading"
            className="text-3xl font-black tracking-tight text-white md:text-4xl"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-[15px] leading-8 text-[#a9b3dd] md:text-base">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold md:gap-2.5 md:text-xs">
            {(Object.keys(CATEGORY_LABELS) as PlanetCategory[]).map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[#b6c0e8]"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[key] }} />
                {CATEGORY_LABELS[key]}
              </span>
            ))}
            <span className="rounded-full bg-gradient-to-l from-[#6366f1] to-[#22d3ee] px-3 py-1.5 text-[#06121f]" aria-live="polite">
              {progressPct}٪ سفر
            </span>
          </div>
        </div>
      </div>

      {/* آسمان پرستاره + سحابی‌های در حال حرکت */}
      <div
        className="relative"
        style={{
          background:
            'linear-gradient(180deg, #070a1f 0%, #0a0f2e 18%, #141032 46%, #0b1030 72%, #060819 100%)',
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(60% 40% at 78% 12%, rgba(56,189,248,0.16), transparent 70%), radial-gradient(50% 35% at 18% 48%, rgba(168,85,247,0.18), transparent 70%), radial-gradient(55% 40% at 70% 82%, rgba(45,212,191,0.13), transparent 70%)',
          }}
        />

        <div className="relative mx-auto w-full max-w-3xl px-2 pt-4 sm:max-w-4xl md:max-w-5xl md:px-6">
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${VIEW_W} / ${viewH}`,
              minHeight: 'min(70vh, 560px)',
            }}
          >
            <svg
              viewBox={`0 0 ${VIEW_W} ${viewH}`}
              className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
              role="img"
              aria-label="مسیر پرواز در کهکشان یادگیری"
              preserveAspectRatio="xMidYMin meet"
            >
              <defs>
                <linearGradient id="orbit-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.55" />
                </linearGradient>
                <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="55%" stopColor="#E2E8F5" />
                  <stop offset="100%" stopColor="#A9B4CC" />
                </linearGradient>
                <linearGradient id="flame-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FEF3C7" />
                  <stop offset="55%" stopColor="#FB923C" />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                </linearGradient>
                <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <StarField seed={3} viewH={viewH} />

              {/* مسیر خاموش (کل مسیر) */}
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={26}
                strokeLinecap="round"
              />
              <path
                d={pathD}
                fill="none"
                stroke="url(#orbit-grad)"
                strokeWidth={2.5}
                strokeDasharray="14 18"
                strokeLinecap="round"
                opacity={0.6}
              />
              {/* مسیر طی‌شده — نور آبی روشن */}
              {pathLen > 0 ? (
                <motion.path
                  ref={pathRef}
                  d={pathD}
                  fill="none"
                  stroke="#67E8F9"
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={pathLen}
                  style={{ strokeDashoffset: trailDashoffset }}
                  opacity={0.9}
                  filter="url(#soft-glow)"
                />
              ) : (
                <path ref={pathRef} d={pathD} fill="none" stroke="none" />
              )}

              <g transform={`translate(${ship.x}, ${ship.y})`}>
                <Spaceship angle={ship.angle} />
              </g>
            </svg>

            <div className="absolute inset-0" aria-label="سیاره‌های ایستگاه یادگیری">
              {stations.map((station, i) => {
                const pt = stationPts[i]
                if (!pt) return null
                return (
                  <PlanetWithProgress
                    key={station.id}
                    station={station}
                    x={pt.x}
                    y={pt.y}
                    progress={progress}
                    reducedMotion={reducedMotion}
                    side={i % 2 === 0 ? 'left' : 'right'}
                    inView={inView}
                    viewH={viewH}
                    index={i}
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative mx-auto flex max-w-md flex-col items-center gap-3 px-4 pb-10 pt-6 text-center">
          <p className="text-lg font-extrabold text-white">پایان {title} 🏆</p>
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-sky-100 backdrop-blur hover:bg-white/15"
            onClick={() => {
              sectionRef.current?.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
              })
            }}
          >
            بازگشت به پایگاه پرتاب
          </button>
        </div>

        {children ? (
          <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-4">{children}</div>
        ) : null}
      </div>
    </section>
  )
}

/** سازگاری با نام‌های قبلی */
export type RoadStation = PlanetStation
export type RoadStationCategory = PlanetCategory
export const buildDefaultRoadStations = buildDefaultPlanetStations
