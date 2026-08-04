'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from 'framer-motion'
import { Lock, Rocket, Sparkles } from 'lucide-react'
import {
  buildDefaultPlanetStations,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  FLIGHT_PATH_D,
  VIEW_H,
  VIEW_W,
  type PlanetCategory,
  type PlanetStation,
} from './planetStations'

export type { PlanetCategory, PlanetStation }
export {
  buildDefaultPlanetStations,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  FLIGHT_PATH_D,
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

function Spaceship({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle + 90})`} aria-hidden>
      <ellipse cx={0} cy={6} rx={7} ry={3} fill="#38BDF8" opacity={0.45} />
      <path d="M 0 -16 L 8 10 L 0 6 L -8 10 Z" fill="#F8FAFC" stroke="#0EA5E9" strokeWidth={1.2} />
      <circle cx={0} cy={-4} r={3.2} fill="#7DD3FC" stroke="#0284C7" strokeWidth={1} />
      <path d="M -8 8 L -12 16 L -4 10 Z" fill="#FB923C" />
      <path d="M 8 8 L 12 16 L 4 10 Z" fill="#FB923C" />
      <path d="M -3 10 L 0 20 L 3 10" fill="#FDE68A" opacity={0.9} />
    </g>
  )
}

function StarField({ seed = 1 }: { seed?: number }) {
  const stars = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = []
    let s = seed * 9973
    const rnd = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }
    for (let i = 0; i < 90; i++) {
      out.push({
        x: rnd() * VIEW_W,
        y: rnd() * VIEW_H,
        r: 0.4 + rnd() * 1.6,
        o: 0.25 + rnd() * 0.7,
      })
    }
    return out
  }, [seed])

  return (
    <g aria-hidden>
      {stars.map((st, i) => (
        <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#E2E8F0" opacity={st.o} />
      ))}
    </g>
  )
}

function PlanetCard({
  station,
  x,
  y,
  active,
  reducedMotion,
  side,
}: {
  station: PlanetStation
  x: number
  y: number
  active: boolean
  reducedMotion: boolean
  side: 'left' | 'right'
}) {
  const locked = Boolean(station.locked)
  const catColor = CATEGORY_COLORS[station.category]

  const card = (
    <motion.div
      initial={false}
      animate={{
        opacity: active ? 1 : 0.45,
        scale: active ? 1 : 0.92,
        filter: locked ? 'grayscale(0.35)' : active ? 'none' : 'saturate(0.7)',
      }}
      transition={
        reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 22 }
      }
      className={[
        'absolute w-[9.5rem] sm:w-[11rem] md:w-[13.5rem] -translate-x-1/2 -translate-y-1/2',
        locked ? 'cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      style={{
        left: side === 'left' ? '-4.5rem' : '4.5rem',
        top: 0,
      }}
    >
      <div
        className={[
          'relative rounded-2xl border p-3 md:p-3.5 shadow-lg backdrop-blur-md transition',
          active
            ? 'border-white/25 bg-slate-950/75'
            : 'border-white/10 bg-slate-950/55',
        ].join(' ')}
        style={{
          boxShadow: active ? `0 0 28px ${station.accent}33` : undefined,
        }}
      >
        {/* سیاره */}
        <div className="mb-2 flex items-start gap-2.5">
          <span
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl shadow-inner md:h-14 md:w-14 md:text-2xl"
            style={{
              background: `radial-gradient(circle at 30% 28%, ${station.accent}, ${station.planetFrom} 45%, ${station.planetTo})`,
              boxShadow: `inset -6px -4px 12px rgba(0,0,0,0.35), 0 0 16px ${station.accent}55`,
            }}
            aria-hidden
          >
            {station.emoji}
            {locked ? (
              <span className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/90 text-slate-200 ring-1 ring-white/20">
                <Lock className="h-3 w-3" />
              </span>
            ) : null}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[9px] font-bold md:text-[10px]" style={{ color: catColor }}>
              {CATEGORY_LABELS[station.category]}
              {locked ? ' · به‌زودی' : ''}
            </p>
            <h3 className="text-[11px] font-extrabold leading-snug text-white md:text-sm">
              {station.label}
            </h3>
          </div>
        </div>

        <p className="text-[10px] leading-5 text-slate-300 md:text-[11px] md:leading-5">
          {station.learn}
        </p>

        <ul className="mt-2 flex flex-wrap gap-1">
          {station.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full px-1.5 py-0.5 text-[8px] font-bold text-slate-900 md:text-[9px]"
              style={{ backgroundColor: station.accent }}
            >
              {h}
            </li>
          ))}
        </ul>

        {station.prerequisites && station.prerequisites.length > 0 ? (
          <div className="mt-2 space-y-1 border-t border-white/10 pt-2">
            <p className="text-[8px] font-bold text-slate-500 md:text-[9px]">پیش‌نیاز (ارجاع):</p>
            <ul className="flex flex-wrap gap-1">
              {station.prerequisites.map((p) => (
                <li key={p.href}>
                  <span className="inline-block rounded-md bg-sky-950/80 px-1.5 py-0.5 text-[8px] font-bold text-sky-200 md:text-[9px]">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!locked ? (
          <p className="mt-2 flex items-center gap-1 text-[9px] font-bold text-sky-300 md:text-[10px]">
            <Sparkles className="h-3 w-3" aria-hidden />
            {station.kind === 'prerequisite' ? 'برو به درس پیش‌نیاز' : 'ورود به ایستگاه'}
          </p>
        ) : (
          <p className="mt-2 text-[9px] font-bold text-slate-500 md:text-[10px]">به‌زودی باز می‌شود</p>
        )}
      </div>
    </motion.div>
  )

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left: `${(x / VIEW_W) * 100}%`,
    top: `${(y / VIEW_H) * 100}%`,
    zIndex: active ? 30 : 10,
  }

  if (locked) {
    return (
      <div style={wrapStyle} className="group relative" role="presentation">
        {card}
        <span className="pointer-events-none absolute left-1/2 top-16 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-800 opacity-0 shadow-lg transition group-hover:opacity-100">
          به‌زودی
        </span>
      </div>
    )
  }

  return (
    <Link href={station.href} style={wrapStyle} aria-label={`${station.label}: ${station.learn}`} className="block">
      {card}
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
}: {
  station: PlanetStation
  x: number
  y: number
  progress: MotionValue<number>
  reducedMotion: boolean
  side: 'left' | 'right'
  inView: boolean
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
  subtitle = 'با اسکرول فضاپیما را جلو ببر؛ هر سیاره یک ایستگاه است و می‌گوید آنجا چه یاد می‌گیری',
  pageHeader,
  children,
  fullBleed = true,
}: ScrollRoadmapProps) {
  const stations = useMemo(
    () => stationsProp ?? buildDefaultPlanetStations(lang),
    [stationsProp, lang]
  )
  const reducedMotion = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const pathLenRef = useRef(0)
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
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 90% 40% at 50% 0%, #0c4a6e88, transparent 55%), radial-gradient(ellipse 50% 30% at 15% 35%, #134e4a55, transparent 50%), radial-gradient(ellipse 45% 25% at 85% 60%, #9a341244, transparent 50%), linear-gradient(180deg, #020617 0%, #0B1224 45%, #020617 100%)',
        }}
      />

      <div className="relative z-10">
        {pageHeader ? (
          <div className="mx-auto max-w-5xl px-4 pt-6 text-slate-100 md:pt-8">{pageHeader}</div>
        ) : null}

        <div className="mx-auto mb-6 max-w-3xl px-4 text-center md:mb-10">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 md:text-sm">
            <Rocket className="h-3.5 w-3.5" aria-hidden />
            سفر فضایی یادگیری · تم تیره
          </p>
          <h2
            id="space-journey-heading"
            className="text-2xl font-extrabold tracking-tight text-white md:text-3xl"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold md:gap-3 md:text-xs">
            {(Object.keys(CATEGORY_LABELS) as PlanetCategory[]).map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-slate-200"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[key] }}
                />
                {CATEGORY_LABELS[key]}
              </span>
            ))}
            <span className="rounded-full bg-sky-400 px-2.5 py-1 text-slate-950" aria-live="polite">
              {progressPct}٪ سفر
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-2 sm:max-w-4xl md:max-w-5xl md:px-6">
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${VIEW_W} / ${VIEW_H}`,
              minHeight: 'min(3200px, 380vw)',
            }}
          >
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="pointer-events-none absolute inset-0 h-full w-full"
              role="img"
              aria-label="مسیر پرواز در کهکشان یادگیری"
              preserveAspectRatio="xMidYMin meet"
            >
              <defs>
                <linearGradient id="trail-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#FB923C" stopOpacity="0.75" />
                </linearGradient>
                <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="3" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <StarField seed={3} />

              <path
                d={FLIGHT_PATH_D}
                fill="none"
                stroke="url(#trail-glow)"
                strokeWidth={10}
                strokeLinecap="round"
                opacity={0.22}
                filter="url(#soft-glow)"
              />
              <path
                ref={pathRef}
                d={FLIGHT_PATH_D}
                fill="none"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="6 10"
                opacity={0.55}
              />

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
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-md justify-center px-4 pb-6">
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
export const ROAD_PATH_D = FLIGHT_PATH_D
