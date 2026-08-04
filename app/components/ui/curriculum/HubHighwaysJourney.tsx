'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
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
import { sampleFlightPath, type PathPoint } from './planetStations'
import {
  buildHubSchoolNodes,
  HUB_LANES,
  HUB_VIEW_H,
  HUB_VIEW_W,
  ROLE_LABEL_FA,
  type HubLane,
  type HubLaneId,
  type HubSchoolNode,
} from './hubHighways'

export interface HubHighwaysJourneyProps {
  lang: string
  pageHeader?: ReactNode
  children?: ReactNode
  className?: string
}

function HubAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            #7DD3FC 0%,
            #38BDF8 8%,
            #0EA5E9 16%,
            #0284C7 28%,
            #1D4ED8 40%,
            #312E81 52%,
            #1E1B4B 64%,
            #0F172A 78%,
            #020617 100%
          )`,
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 10%, rgba(255,255,255,0.35) 0%, transparent 28%),
            radial-gradient(circle at 80% 18%, rgba(255,255,255,0.2) 0%, transparent 22%),
            radial-gradient(circle at 50% 70%, rgba(94,234,212,0.12) 0%, transparent 35%)`,
        }}
      />
    </div>
  )
}

function LaneShip({
  lane,
  angle,
  scale = 1,
}: {
  lane: HubLane
  angle: number
  scale?: number
}) {
  return (
    <g transform={`rotate(${angle + 90}) scale(${scale})`} aria-hidden>
      <ellipse cx={0} cy={11} rx={8} ry={3.5} fill={lane.glow} opacity={0.45} />
      <path
        d="M 0 -16 L 9 11 L 0 6 L -9 11 Z"
        fill={lane.shipFill}
        stroke={lane.shipStroke}
        strokeWidth={1.4}
      />
      <circle cx={0} cy={-4} r={3.2} fill={lane.glow} stroke={lane.shipStroke} strokeWidth={1} />
      <path d="M -9 8 L -13 17 L -4 11 Z" fill={lane.shipAccent} />
      <path d="M 9 8 L 13 17 L 4 11 Z" fill={lane.shipAccent} />
      <path d="M -3 11 L 0 22 L 3 11" fill="#FDE68A" opacity={0.9} />
    </g>
  )
}

/** برچسب خوانا کنار سفینه — چرخش نمی‌کند تا نام مدرسه همیشه خوانا بماند */
function ShipNameBadge({
  node,
  lane,
  x,
  y,
  side,
  stackPx = 0,
}: {
  node: HubSchoolNode
  lane: HubLane
  x: number
  y: number
  side: 'left' | 'right'
  /** جابه‌جایی عمودی برای جلوگیری از هم‌پوشانی در پایگاه پرتاب */
  stackPx?: number
}) {
  const style: CSSProperties = {
    position: 'absolute',
    left: `${(x / HUB_VIEW_W) * 100}%`,
    top: `${(y / HUB_VIEW_H) * 100}%`,
    transform:
      side === 'left'
        ? `translate(calc(-100% - 12px), calc(-50% + ${stackPx}px))`
        : `translate(12px, calc(-50% + ${stackPx}px))`,
    zIndex: 25,
  }

  return (
    <Link
      href={node.href}
      style={style}
      className="pointer-events-auto max-w-[7.5rem] rounded-lg border border-white/80 bg-white/95 px-2 py-1 shadow-md backdrop-blur transition hover:scale-[1.03] hover:bg-white md:max-w-[9rem]"
      aria-label={node.label}
      dir="rtl"
    >
      <span className="flex items-center gap-1">
        <span aria-hidden className="text-[11px]">
          {node.emoji}
        </span>
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: lane.color }}
          aria-hidden
        />
        <span className="truncate text-[10px] font-extrabold leading-tight text-slate-800 md:text-[11px]">
          {node.shortLabel}
        </span>
      </span>
    </Link>
  )
}

/** نوار چسبان: همه مدارس از همان ابتدا قابل انتخاب */
function StickySchoolsDock({ nodes }: { nodes: HubSchoolNode[] }) {
  const laneById = useMemo(() => {
    const map = new Map(HUB_LANES.map((l) => [l.id, l]))
    return map
  }, [])

  return (
    <nav
      className="sticky top-[4.5rem] z-50 mx-auto max-w-5xl px-3 pt-2 md:top-20 md:px-4"
      aria-label="انتخاب سریع مدرسه"
      dir="rtl"
    >
      <div className="rounded-2xl border border-sky-200/80 bg-white/92 p-2 shadow-lg backdrop-blur-md md:p-2.5">
        <p className="mb-1.5 px-1 text-[10px] font-bold text-slate-500 md:text-[11px]">
          مدارس مایلند — مستقیم وارد شو
        </p>
        <ul className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nodes.map((node) => {
            const lane = laneById.get(node.laneId)
            return (
              <li key={node.id} className="shrink-0">
                <Link
                  href={node.href}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-[11px] font-extrabold transition md:px-3 md:text-xs',
                    node.role === 'backbone'
                      ? 'border-teal-300 bg-teal-50 text-teal-900 hover:bg-teal-100'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50',
                  ].join(' ')}
                >
                  <span aria-hidden>{node.emoji}</span>
                  <span>{node.shortLabel}</span>
                  {lane ? (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: lane.color }}
                      aria-hidden
                    />
                  ) : null}
                  {node.comingSoon ? (
                    <span className="text-[9px] font-bold text-slate-400">به‌زودی</span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

function HighwayLane({
  lane,
  pathRef,
}: {
  lane: HubLane
  pathRef: (el: SVGPathElement | null) => void
}) {
  return (
    <g>
      <path
        d={lane.pathD}
        fill="none"
        stroke={lane.glow}
        strokeWidth={lane.highwayWidth}
        strokeLinecap="round"
        opacity={0.22}
      />
      <path
        d={lane.pathD}
        fill="none"
        stroke={lane.color}
        strokeWidth={Math.max(6, lane.highwayWidth - 4)}
        strokeLinecap="round"
        opacity={0.14}
      />
      <path
        d={lane.pathD}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeDasharray="6 10"
        opacity={0.55}
      />
      <path
        ref={pathRef}
        d={lane.pathD}
        fill="none"
        stroke={lane.color}
        strokeWidth={lane.strokeWidth}
        strokeLinecap="round"
        opacity={0.95}
      />
    </g>
  )
}

function SchoolPortalCard({
  node,
  href,
  x,
  y,
  side,
  active,
  reducedMotion,
}: {
  node: HubSchoolNode
  href: string
  x: number
  y: number
  side: 'left' | 'right'
  active: boolean
  reducedMotion: boolean
}) {
  const card = (
    <motion.div
      className={[
        'w-[9.25rem] rounded-2xl border p-2.5 shadow-lg backdrop-blur-md md:w-44 md:p-3',
        active
          ? 'border-white/80 bg-white/95 ring-2 ring-sky-300/70'
          : 'border-white/50 bg-white/82',
      ].join(' ')}
      animate={reducedMotion ? undefined : { y: active ? -2 : 0, scale: active ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      dir="rtl"
    >
      <div className="flex items-start gap-2">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg"
          style={{
            background: `linear-gradient(145deg, ${node.planetFrom}, ${node.planetTo})`,
          }}
          aria-hidden
        >
          {node.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-bold text-slate-500 md:text-[10px]">
            {ROLE_LABEL_FA[node.role]}
            {node.comingSoon ? ' · به‌زودی' : ''}
          </p>
          <h3 className="text-[11px] font-extrabold leading-snug text-slate-800 md:text-sm">
            {node.label}
          </h3>
        </div>
        {node.comingSoon ? (
          <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        ) : (
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-teal-600" aria-hidden />
        )}
      </div>
      <p className="mt-1.5 text-[9px] leading-4 text-slate-600 md:text-[10px] md:leading-5">
        {node.blurb}
      </p>
      <p className="mt-1.5 text-[9px] font-bold text-sky-700 md:text-[10px]">ورود به مسیر مدرسه ←</p>
    </motion.div>
  )

  const wrapStyle: CSSProperties = {
    position: 'absolute',
    left: `${(x / HUB_VIEW_W) * 100}%`,
    top: `${(y / HUB_VIEW_H) * 100}%`,
    zIndex: active ? 30 : 12,
    transform: side === 'left' ? 'translate(-108%, -50%)' : 'translate(8%, -50%)',
  }

  return (
    <div style={wrapStyle}>
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        aria-label={`${node.label}${node.comingSoon ? ' (به‌زودی)' : ''}`}
      >
        {card}
      </Link>
    </div>
  )
}

function PortalWatcher({
  node,
  href,
  x,
  y,
  side,
  progress,
  reducedMotion,
  inView,
}: {
  node: HubSchoolNode
  href: string
  x: number
  y: number
  side: 'left' | 'right'
  progress: MotionValue<number>
  reducedMotion: boolean
  inView: boolean
}) {
  const [active, setActive] = useState(() => progress.get() >= node.t - 0.04)

  useMotionValueEvent(progress, 'change', (v) => {
    if (!inView && !reducedMotion) return
    setActive(v >= node.t - 0.04)
  })

  return (
    <SchoolPortalCard
      node={node}
      href={href}
      x={x}
      y={y}
      side={side}
      active={active}
      reducedMotion={reducedMotion}
    />
  )
}

/**
 * نقشهٔ اتوبانی هاب: چند باند موازی + چند فضاپیما هم‌زمان
 */
export function HubHighwaysJourney({
  lang,
  pageHeader,
  children,
  className = '',
}: HubHighwaysJourneyProps) {
  const nodes = useMemo(() => buildHubSchoolNodes(lang), [lang])
  const reducedMotion = useReducedMotion() ?? false
  const sectionRef = useRef<HTMLElement>(null)
  const pathEls = useRef<Partial<Record<HubLaneId, SVGPathElement | null>>>({})
  const pathLens = useRef<Partial<Record<HubLaneId, number>>>({})
  const [inView, setInView] = useState(true)
  const [nodePts, setNodePts] = useState<Partial<Record<string, PathPoint>>>({})
  const [ships, setShips] = useState<Partial<Record<HubLaneId, PathPoint>>>({})
  const [progressPct, setProgressPct] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 85,
    damping: reducedMotion ? 100 : 26,
    restDelta: 0.001,
  })
  const progress = reducedMotion ? scrollYProgress : smooth

  const sampleAll = useCallback((v: number) => {
    const nextShips: Partial<Record<HubLaneId, PathPoint>> = {}
    for (const lane of HUB_LANES) {
      const el = pathEls.current[lane.id]
      const total = pathLens.current[lane.id] ?? 0
      if (!el || total <= 0) continue
      const lag =
        lane.id === 'math'
          ? 0
          : lane.id === 'design' || lane.id === 'programming'
            ? 0.025
            : 0.055
      const span = 1 - lag
      const t = span <= 0 ? v : Math.min(1, Math.max(0, (v - lag) / span))
      nextShips[lane.id] = sampleFlightPath(el, t, total)
    }
    setShips(nextShips)
    setProgressPct(Math.round(v * 100))
  }, [])

  const recompute = useCallback(() => {
    for (const lane of HUB_LANES) {
      const el = pathEls.current[lane.id]
      if (!el) continue
      pathLens.current[lane.id] = el.getTotalLength()
    }
    const pts: Partial<Record<string, PathPoint>> = {}
    for (const node of nodes) {
      const el = pathEls.current[node.laneId]
      const total = pathLens.current[node.laneId] ?? 0
      if (!el || total <= 0) continue
      pts[node.id] = sampleFlightPath(el, node.t, total)
    }
    setNodePts(pts)
    sampleAll(progress.get())
  }, [nodes, progress, sampleAll])

  useEffect(() => {
    // بعد از mount مسیرها در DOM هستند
    const id = requestAnimationFrame(() => recompute())
    window.addEventListener('resize', recompute)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', recompute)
    }
  }, [recompute])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false
        setInView(visible)
        if (visible) sampleAll(progress.get())
      },
      { root: null, rootMargin: '100px 0px', threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [progress, sampleAll])

  useMotionValueEvent(progress, 'change', (v) => {
    if (!inView) return
    sampleAll(v)
  })

  const sideFor = (node: HubSchoolNode): 'left' | 'right' => {
    if (node.id === 'design' || node.id === 'math') return 'left'
    return 'right'
  }

  const badgeStack: Record<HubLaneId, number> = {
    math: -36,
    design: 8,
    programming: -36,
    ai: 2,
    robotics: 40,
  }

  return (
    <section
      ref={sectionRef}
      className={`relative isolate w-full overflow-hidden ${className}`}
      dir="rtl"
      aria-labelledby="hub-highways-heading"
      data-hub-highways="true"
    >
      <HubAtmosphere />

      <div className="relative z-10">
        <StickySchoolsDock nodes={nodes} />

        {pageHeader ? <div className="mx-auto max-w-5xl px-4 pt-4 md:pt-6">{pageHeader}</div> : null}

        <div className="mx-auto mb-3 max-w-3xl px-4 text-center md:mb-5">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-sky-900 shadow-sm backdrop-blur">
            <Rocket className="h-3.5 w-3.5" aria-hidden />
            اتوبان کهکشانی · چند مسیر موازی
          </p>
          <h2
            id="hub-highways-heading"
            className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl"
          >
            پنج مدرسه، چند باند پرواز
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-slate-700 md:text-base">
            از نوار بالا مدرسه را انتخاب کن، یا با اسکرول باندها و سفینه‌های نام‌دار را دنبال کن.
          </p>
          <p
            className="mt-3 inline-flex items-center gap-1 rounded-full bg-sky-800 px-3 py-1 text-[11px] font-bold text-white shadow-sm"
            aria-live="polite"
          >
            {progressPct}٪ مسیر نقشه
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-2 sm:max-w-4xl md:max-w-5xl md:px-6">
          <div
            className="relative w-full"
            style={{
              aspectRatio: `${HUB_VIEW_W} / ${HUB_VIEW_H}`,
              minHeight: 'min(2800px, 340vw)',
            }}
          >
            <svg
              viewBox={`0 0 ${HUB_VIEW_W} ${HUB_VIEW_H}`}
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="نقشهٔ مسیرهای موازی پنج مدرسه مایلند"
              preserveAspectRatio="xMidYMid meet"
            >
              {[...HUB_LANES]
                .sort((a, b) => b.highwayWidth - a.highwayWidth)
                .map((lane) => (
                  <HighwayLane
                    key={lane.id}
                    lane={lane}
                    pathRef={(el) => {
                      pathEls.current[lane.id] = el
                    }}
                  />
                ))}

              {HUB_LANES.map((lane) => {
                const ship = ships[lane.id]
                if (!ship) return null
                const scale =
                  lane.id === 'math' ? 1.2 : lane.id === 'programming' || lane.id === 'design' ? 1 : 0.88
                return (
                  <g key={`ship-${lane.id}`} transform={`translate(${ship.x}, ${ship.y})`}>
                    <LaneShip lane={lane} angle={ship.angle} scale={scale} />
                  </g>
                )
              })}
            </svg>

            {/* نام مدارس روی/کنار سفینه‌ها — همیشه خوانا */}
            <div className="pointer-events-none absolute inset-0" aria-hidden={false}>
              {nodes.map((node) => {
                const ship = ships[node.laneId]
                const lane = HUB_LANES.find((l) => l.id === node.laneId)
                if (!ship || !lane) return null
                return (
                  <ShipNameBadge
                    key={`badge-${node.id}`}
                    node={node}
                    lane={lane}
                    x={ship.x}
                    y={ship.y}
                    side={sideFor(node)}
                    stackPx={badgeStack[node.laneId]}
                  />
                )
              })}
            </div>

            <div className="absolute inset-0" aria-label="دروازهٔ مدارس">
              {nodes.map((node) => {
                const pt = nodePts[node.id]
                if (!pt) return null
                return (
                  <PortalWatcher
                    key={node.id}
                    node={node}
                    href={node.href}
                    x={pt.x}
                    y={pt.y}
                    side={sideFor(node)}
                    progress={progress}
                    reducedMotion={reducedMotion}
                    inView={inView}
                  />
                )
              })}
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
