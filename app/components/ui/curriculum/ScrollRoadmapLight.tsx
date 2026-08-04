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
import { Lock, Rocket, Sparkles, CloudSun } from 'lucide-react'
import {
  buildDefaultPlanetStations,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  FLIGHT_PATH_D,
  sampleFlightPath,
  VIEW_H,
  VIEW_W,
  type PlanetCategory,
  type PlanetStation,
  type PathPoint,
} from './planetStations'

export interface ScrollRoadmapLightProps {
  lang: string
  stations?: PlanetStation[]
  className?: string
  title?: string
  subtitle?: string
  /** هدر صفحه روی آسمان تمام‌عرض */
  pageHeader?: ReactNode
  /** موضوعات و محتوای زیر مسیر — داخل همان جوّ فضا */
  children?: ReactNode
  /** پس‌زمینه لبه به لبهٔ صفحه (نه داخل کارت باریک) */
  fullBleed?: boolean
}

/** ابر پف‌دار ساده */
function CloudBlob({
  x,
  y,
  scale = 1,
  opacity = 0.95,
}: {
  x: number
  y: number
  scale?: number
  opacity?: number
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity} aria-hidden>
      <ellipse cx={0} cy={8} rx={42} ry={16} fill="#FFFFFF" />
      <ellipse cx={-22} cy={2} rx={22} ry={18} fill="#FFFFFF" />
      <ellipse cx={20} cy={0} rx={26} ry={20} fill="#FFFFFF" />
      <ellipse cx={-4} cy={-10} rx={20} ry={16} fill="#FFFFFF" />
      <ellipse cx={28} cy={10} rx={16} ry={12} fill="#F8FAFC" />
    </g>
  )
}

function SpaceshipLight({ angle }: { angle: number }) {
  return (
    <g transform={`rotate(${angle + 90})`} aria-hidden>
      <ellipse cx={0} cy={10} rx={9} ry={4} fill="#38BDF8" opacity={0.4} />
      <path
        d="M 0 -18 L 10 12 L 0 7 L -10 12 Z"
        fill="#FFFFFF"
        stroke="#0369A1"
        strokeWidth={1.5}
      />
      <circle cx={0} cy={-5} r={3.6} fill="#7DD3FC" stroke="#0284C7" strokeWidth={1.1} />
      <path d="M -10 9 L -14 19 L -4 12 Z" fill="#FB923C" />
      <path d="M 10 9 L 14 19 L 4 12 Z" fill="#FB923C" />
      <path d="M -3.5 12 L 0 24 L 3.5 12" fill="#FDE68A" />
    </g>
  )
}

function AtmosphereLayers() {
  /** آسمان آبی روشن → غروب → ورود به فضا — تمام عرض صفحه */
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            #7DD3FC 0%,
            #38BDF8 7%,
            #0EA5E9 14%,
            #0284C7 24%,
            #1D4ED8 34%,
            #312E81 46%,
            #1E1B4B 56%,
            #0F172A 70%,
            #020617 100%
          )`,
        }}
      />
      <div
        className="absolute left-1/2 top-[4%] h-[22%] w-[min(960px,100%)] -translate-x-1/2 rounded-full opacity-80 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(254,243,199,0.9) 0%, rgba(125,211,252,0.3) 42%, transparent 70%)',
        }}
      />
      <div
        className="absolute left-1/2 top-[40%] h-[18%] w-full -translate-x-1/2 opacity-50 blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(56,189,248,0.4) 0%, transparent 70%)',
        }}
      />
      {/* ابرهای CSS لبه‌ای برای حس تمام‌صفحه در دسکتاپ */}
      <div className="absolute left-[-5%] top-[8%] hidden h-24 w-48 rounded-[50%] bg-white/90 blur-[1px] md:block" />
      <div className="absolute left-[4%] top-[11%] hidden h-16 w-32 rounded-[50%] bg-white/85 md:block" />
      <div className="absolute right-[-3%] top-[10%] hidden h-28 w-56 rounded-[50%] bg-white/90 md:block" />
      <div className="absolute right-[8%] top-[14%] hidden h-14 w-36 rounded-[50%] bg-white/80 md:block" />
      <div className="absolute left-[10%] top-[22%] hidden h-20 w-44 rounded-[50%] bg-white/70 md:block" />
      <div className="absolute right-[12%] top-[26%] hidden h-16 w-40 rounded-[50%] bg-white/65 md:block" />
    </div>
  )
}

function SkyAndSpaceSvg({
  pathRef,
  ship,
  starOpacity,
  cloudOpacity,
}: {
  pathRef: React.RefObject<SVGPathElement | null>
  ship: PathPoint
  starOpacity: number
  cloudOpacity: number
}) {
  const stars = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = []
    let s = 4242
    const rnd = () => {
      s = (s * 16807) % 2147483647
      return (s - 1) / 2147483646
    }
    for (let i = 0; i < 120; i++) {
      out.push({
        x: rnd() * VIEW_W,
        /** ستاره‌ها بیشتر در نیمهٔ پایینی (فضا) */
        y: 900 + rnd() * (VIEW_H - 900),
        r: 0.5 + rnd() * 1.8,
        o: 0.35 + rnd() * 0.65,
      })
    }
    return out
  }, [])

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
      role="img"
      aria-label="پرواز از آسمان آبی تا فضا"
      preserveAspectRatio="xMidYMin meet"
    >
      <defs>
        <linearGradient id="trail-ascent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#BAE6FD" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="1" />
          <stop offset="45%" stopColor="#FDE68A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* خورشید بزرگ در ابتدای مسیر */}
      <circle cx={320} cy={120} r={70} fill="url(#sun-glow)" opacity={0.95} />
      <circle cx={320} cy={120} r={28} fill="#FEF08A" stroke="#F59E0B" strokeWidth={2} />

      {/* ابرهای سفید — لایه نزدیک و دور برای حس عمق */}
      <g opacity={cloudOpacity}>
        <CloudBlob x={70} y={160} scale={1.15} opacity={0.98} />
        <CloudBlob x={300} y={240} scale={0.85} opacity={0.9} />
        <CloudBlob x={120} y={380} scale={1.05} opacity={0.92} />
        <CloudBlob x={310} y={520} scale={0.7} opacity={0.85} />
        <CloudBlob x={90} y={640} scale={0.95} opacity={0.8} />
        <CloudBlob x={280} y={780} scale={0.75} opacity={0.7} />
        <CloudBlob x={150} y={900} scale={0.65} opacity={0.45} />
      </g>

      {/* ستاره‌ها — با اسکرول پررنگ‌تر می‌شوند */}
      <g opacity={starOpacity}>
        {stars.map((st, i) => (
          <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#F8FAFC" opacity={st.o} />
        ))}
      </g>

      {/* رد پرواز */}
      <path
        d={FLIGHT_PATH_D}
        fill="none"
        stroke="url(#trail-ascent)"
        strokeWidth={16}
        strokeLinecap="round"
        opacity={0.28}
      />
      <path
        ref={pathRef}
        d={FLIGHT_PATH_D}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray="10 14"
        opacity={0.75}
      />

      <g transform={`translate(${ship.x}, ${ship.y})`}>
        <SpaceshipLight angle={ship.angle} />
      </g>
    </svg>
  )
}

function PlanetCardLight({
  station,
  x,
  y,
  active,
  reducedMotion,
  side,
  depthTilt,
}: {
  station: PlanetStation
  x: number
  y: number
  active: boolean
  reducedMotion: boolean
  side: 'left' | 'right'
  /** حس عمق ساده بدون WebGL */
  depthTilt: number
}) {
  const locked = Boolean(station.locked)
  const catColor = CATEGORY_COLORS[station.category]
  const inSpaceZone = station.t > 0.45

  const card = (
    <motion.div
      initial={false}
      animate={{
        opacity: active ? 1 : 0.58,
        scale: active ? 1 : 0.94,
        rotateY: reducedMotion ? 0 : side === 'left' ? -depthTilt : depthTilt,
      }}
      transition={
        reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 22 }
      }
      className={[
        'absolute w-[10rem] sm:w-[11.5rem] md:w-[14rem] -translate-x-1/2 -translate-y-1/2',
        locked ? 'cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
      style={{
        left: side === 'left' ? '-4.75rem' : '4.75rem',
        top: 0,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
    >
      <div
        className={[
          'relative rounded-2xl border-2 p-3 shadow-lg md:p-3.5',
          inSpaceZone
            ? active
              ? 'border-sky-200/80 bg-white/95'
              : 'border-white/40 bg-white/85'
            : active
              ? 'border-sky-400 bg-white'
              : 'border-white/90 bg-white/95',
        ].join(' ')}
        style={{
          boxShadow: active
            ? `0 12px 32px rgba(14,165,233,0.28), 0 4px 12px rgba(15,23,42,0.1)`
            : '0 6px 16px rgba(15,23,42,0.08)',
        }}
      >
        <div className="mb-2 flex items-start gap-2.5">
          <span
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl md:h-14 md:w-14 md:text-2xl"
            style={{
              background: `radial-gradient(circle at 32% 28%, #fff 0%, ${station.accent} 28%, ${station.planetFrom} 58%, ${station.planetTo})`,
              boxShadow: `inset -5px -3px 10px rgba(0,0,0,0.18), 0 0 0 3px ${station.accent}`,
            }}
            aria-hidden
          >
            {station.emoji}
            {locked ? (
              <span className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
                <Lock className="h-3 w-3" />
              </span>
            ) : null}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[9px] font-bold md:text-[10px]" style={{ color: catColor }}>
              {CATEGORY_LABELS[station.category]}
              {locked ? ' · به‌زودی' : ''}
            </p>
            <h3 className="text-[11px] font-extrabold leading-snug text-slate-800 md:text-sm">
              {station.label}
            </h3>
          </div>
        </div>

        <p className="text-[10px] leading-5 text-slate-600 md:text-[11px] md:leading-5">
          {station.learn}
        </p>

        <ul className="mt-2 flex flex-wrap gap-1">
          {station.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full px-1.5 py-0.5 text-[8px] font-bold text-slate-800 md:text-[9px]"
              style={{ backgroundColor: station.accent }}
            >
              {h}
            </li>
          ))}
        </ul>

        {station.prerequisites && station.prerequisites.length > 0 ? (
          <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
            <p className="text-[8px] font-bold text-slate-500 md:text-[9px]">پیش‌نیاز (ارجاع):</p>
            <ul className="flex flex-wrap gap-1">
              {station.prerequisites.map((p) => (
                <li key={p.href}>
                  <span className="inline-block rounded-md bg-sky-50 px-1.5 py-0.5 text-[8px] font-bold text-sky-800 md:text-[9px]">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!locked ? (
          <p className="mt-2 flex items-center gap-1 text-[9px] font-bold text-sky-700 md:text-[10px]">
            <Sparkles className="h-3 w-3" aria-hidden />
            {station.kind === 'prerequisite' ? 'برو به درس پیش‌نیاز' : 'بزن بریم این ایستگاه!'}
          </p>
        ) : (
          <p className="mt-2 text-[9px] font-bold text-slate-400 md:text-[10px]">به‌زودی باز می‌شود</p>
        )}
      </div>
    </motion.div>
  )

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left: `${(x / VIEW_W) * 100}%`,
    top: `${(y / VIEW_H) * 100}%`,
    zIndex: active ? 30 : 10,
    perspective: '900px',
  }

  if (locked) {
    return (
      <div style={wrapStyle} className="group relative" role="presentation">
        {card}
        <span className="pointer-events-none absolute left-1/2 top-16 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-2 py-1 text-[10px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
          به‌زودی
        </span>
      </div>
    )
  }

  return (
    <Link
      href={station.href}
      style={wrapStyle}
      aria-label={`${station.label}: ${station.learn}`}
      className="block"
    >
      {card}
    </Link>
  )
}

function PlanetWithProgressLight({
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
    <PlanetCardLight
      station={station}
      x={x}
      y={y}
      active={active}
      reducedMotion={reducedMotion}
      side={side}
      depthTilt={active ? 8 : 4}
    />
  )
}

function phaseLabel(p: number): string {
  if (p < 0.22) return 'آسمان آبی · بین ابرها'
  if (p < 0.45) return 'خروج از جوّ · افق بنفش'
  if (p < 0.72) return 'ورود به فضا'
  return 'کهکشان یادگیری'
}

/**
 * تم روشن: آسمان آبی + ابر سفید → کم‌کم ورود به فضا
 * عمق لایه‌ای (ابر/ستاره/پرسپکتیو کارت) — بدون Three.js
 */
export function ScrollRoadmapLight({
  lang,
  stations: stationsProp,
  className = '',
  title = 'از آسمان تا فضا',
  subtitle = 'اول بین ابرهای سفید پرواز می‌کنی، بعد کم‌کم وارد فضا می‌شوی و به سیاره‌های یادگیری می‌رسی',
  pageHeader,
  children,
  fullBleed = true,
}: ScrollRoadmapLightProps) {
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
  const [progressRaw, setProgressRaw] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 90,
    damping: reducedMotion ? 100 : 28,
    restDelta: 0.001,
  })

  const progress = reducedMotion ? scrollYProgress : smoothProgress

  const cloudOpacityMV = useTransform(progress, [0, 0.2, 0.45, 0.6], [1, 0.85, 0.35, 0.08])
  const starOpacityMV = useTransform(progress, [0, 0.25, 0.45, 0.7], [0.05, 0.2, 0.55, 1])
  const [cloudOpacity, setCloudOpacity] = useState(1)
  const [starOpacity, setStarOpacity] = useState(0.05)

  useMotionValueEvent(cloudOpacityMV, 'change', (v) => {
    if (inView) setCloudOpacity(v)
  })
  useMotionValueEvent(starOpacityMV, 'change', (v) => {
    if (inView) setStarOpacity(v)
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
            setShip(sampleFlightPath(path, v, total))
            setProgressPct(Math.round(v * 100))
            setProgressRaw(v)
            setCloudOpacity(cloudOpacityMV.get())
            setStarOpacity(starOpacityMV.get())
          }
        }
      },
      { root: null, rootMargin: '120px 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [progress, cloudOpacityMV, starOpacityMV])

  const recompute = useCallback(() => {
    const path = pathRef.current
    if (!path) return
    const total = path.getTotalLength()
    pathLenRef.current = total
    setStationPts(stations.map((s) => sampleFlightPath(path, s.t, total)))
    const v = progress.get()
    setShip(sampleFlightPath(path, v, total))
    setProgressPct(Math.round(v * 100))
    setProgressRaw(v)
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
    setShip(sampleFlightPath(path, v, total))
    setProgressPct(Math.round(v * 100))
    setProgressRaw(v)
  })

  const phase = phaseLabel(progressRaw)

  return (
    <section
      ref={sectionRef}
      className={`relative isolate w-full overflow-hidden ${className}`}
      dir="rtl"
      aria-labelledby="space-journey-light-heading"
      data-journey-theme="light"
      data-full-bleed={fullBleed ? 'true' : 'false'}
    >
      {/* جوّ تمام‌عرض صفحه — دیگر داخل کارت باریک نیست */}
      <AtmosphereLayers />

      <div className="relative z-10">
        {pageHeader ? <div className="mx-auto max-w-5xl px-4 pt-6 md:pt-8">{pageHeader}</div> : null}

        <div className="mx-auto mb-4 max-w-3xl px-4 text-center md:mb-8">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-sky-900 shadow-sm backdrop-blur md:text-sm">
            <CloudSun className="h-3.5 w-3.5" aria-hidden />
            تم روشن · از آسمان تا فضا
          </p>
          <h2
            id="space-journey-light-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
          >
            {title}
          </h2>
          {subtitle ? (
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-700 md:text-base">
              {subtitle}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold md:gap-3 md:text-xs">
            {(Object.keys(CATEGORY_LABELS) as PlanetCategory[]).map((key) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200/80 bg-white/85 px-2.5 py-1 text-slate-700 shadow-sm backdrop-blur"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[key] }}
                />
                {CATEGORY_LABELS[key]}
              </span>
            ))}
            <span
              className="inline-flex items-center gap-1 rounded-full bg-sky-700 px-2.5 py-1 text-white shadow-sm"
              aria-live="polite"
            >
              <Rocket className="h-3 w-3" aria-hidden />
              {progressPct}٪ · {phase}
            </span>
          </div>
        </div>

        {/* مسیر پرواز — عریض‌تر، بدون قاب مستطیلی */}
        <div className="relative mx-auto w-full max-w-3xl px-2 sm:max-w-4xl md:max-w-5xl md:px-6">
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${VIEW_W} / ${VIEW_H}`,
              minHeight: 'min(3200px, 380vw)',
            }}
          >
            <SkyAndSpaceSvg
              pathRef={pathRef}
              ship={ship}
              starOpacity={starOpacity}
              cloudOpacity={cloudOpacity}
            />

            <div className="absolute inset-0" aria-label="سیاره‌های ایستگاه یادگیری">
              {stations.map((station, i) => {
                const pt = stationPts[i]
                if (!pt) return null
                return (
                  <PlanetWithProgressLight
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

            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold text-slate-700 shadow-md backdrop-blur md:text-xs">
                {phase}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-md justify-center px-4 py-6">
          <button
            type="button"
            className="rounded-xl border border-white/40 bg-white/85 px-4 py-2 text-xs font-bold text-sky-900 shadow-sm backdrop-blur hover:bg-white"
            onClick={() => {
              sectionRef.current?.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
              })
            }}
          >
            بازگشت به آسمان و ابرها
          </button>
        </div>

        {/* موضوعات روی پس‌زمینهٔ فضای انتهای سفر */}
        {children ? (
          <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-4">{children}</div>
        ) : null}
      </div>
    </section>
  )
}
