'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { getSubject } from '@/lib/math-visual-engine/curriculum'

interface Station {
  emoji: string
  name: string
  sub: string
  lessonsCount: number
  lessons?: string
  open: boolean
}

interface School {
  short: string
  slug: string
  name: string
  emoji: string
  color: string
  shadow: string
  tint: string
  desc: string
  cta: string
  stations: Station[]
}

interface SchoolMeta {
  short: string
  slug: string
  name: string
  emoji: string
  color: string
  shadow: string
  tint: string
  desc: string
  cta: string
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹'
const FA = (n: number | string) => String(n).replace(/\d/g, (d) => FA_DIGITS[Number(d)]!)

/**
 * ایستگاه‌های هر مدرسه از همان درسنامهٔ واقعی (math-grade-6.json) ساخته می‌شوند —
 * تا فهرست دوره‌ها همیشه با آنچه واقعاً ساخته شده یکی باشد، نه یک لیست دستی جدا.
 */
function stationsFromSubject(subjectId: string): Station[] {
  const subject = getSubject(subjectId)
  if (!subject) return []
  return [...subject.topics]
    .sort((a, b) => a.order - b.order)
    .map((topic) => {
      const lessonsCount = topic.lessons.length
      return {
        emoji: topic.icon ?? '📚',
        name: topic.title,
        sub: topic.description ?? '',
        lessonsCount,
        lessons: lessonsCount > 0 ? `${FA(lessonsCount)} درس` : undefined,
        open: lessonsCount > 0,
      }
    })
}

const SCHOOL_META: SchoolMeta[] = [
  {
    short: 'ریاضی',
    slug: 'math',
    name: 'مدرسه ریاضیات',
    emoji: '📐',
    color: '#ffd166',
    shadow: '#c99a2e',
    tint: '#fff0c8',
    desc: 'ستون فقرات مایلند! از کسرها شروع می‌کنی و پله‌پله تا هندسه و مختصات جلو می‌ری. بقیهٔ مدرسه‌ها هم به همین سیاره‌ها برمی‌گردند.',
    cta: 'بزن بریم به کسرها 🚀',
  },
  {
    short: 'برنامه‌نویسی',
    slug: 'programming',
    name: 'مدرسه برنامه‌نویسی',
    emoji: '💻',
    color: '#4cc9f0',
    shadow: '#2b93b5',
    tint: '#d6f3fd',
    desc: 'از منطق بلوکی تا دورهٔ کامل پایتون کودکان. ریاضی را دوباره درس نمی‌دهیم؛ هرجا لازم شد به سیارهٔ ریاضی‌اش لینک می‌دهیم.',
    cta: 'بزن بریم به منطق 🚀',
  },
  {
    short: 'هوش مصنوعی',
    slug: 'ai',
    name: 'مدرسه هوش مصنوعی',
    emoji: '🤖',
    color: '#b388ff',
    shadow: '#7c56cc',
    tint: '#ebe1ff',
    desc: 'هنوز در حال ساخت است! وقتی سیاره‌های آمار و پایتون را فتح کنی، این بازو هم از پایگاه جدا می‌شود.',
    cta: 'دیدن نقشهٔ راه 🗺️',
  },
  {
    short: 'طراحی',
    slug: 'design',
    name: 'مدرسه طراحی',
    emoji: '🎨',
    color: '#ff8fab',
    shadow: '#c9637d',
    tint: '#ffe1e9',
    desc: 'زبان بصری: رنگ، فرم و تایپوگرافی تا ساختن یک رابط واقعی. بازویی مستقل که فقط سر پروژه با برنامه‌نویسی قرار می‌گذارد.',
    cta: 'دیدن نقشهٔ راه 🗺️',
  },
  {
    short: 'رباتیک',
    slug: 'robotics',
    name: 'مدرسه رباتیک',
    emoji: '🤖',
    color: '#7ef29d',
    shadow: '#4bb56c',
    tint: '#dcfce9',
    desc: 'سخت‌افزار روی نرم‌افزار! هندسه و مثلثات را از ریاضی و حلقه و شرط را از برنامه‌نویسی قرض می‌گیریم و اینجا فقط می‌سازیم.',
    cta: 'دیدن نقشهٔ راه 🗺️',
  },
]

const SCHOOLS: School[] = SCHOOL_META.map((m) => ({ ...m, stations: stationsFromSubject(m.slug) }))

interface BuiltStation extends Station {
  rowBg: string
  chipBg: string
  filter: string
  titleColor: string
  badgeLabel: string
  badgeBg: string
  badgeText: string
}

interface BuiltSchool extends Omit<School, 'stations'> {
  stations: BuiltStation[]
  pctValue: number
  pctLabel: string
  openCount: number
  readyLabel: string
  dim: number
  chipBg: string
  chipBorder: string
  chipText: string
  pillBg: string
  pillBorder: string
  pillText: string
}

function buildSchool(s: School, active: boolean): BuiltSchool {
  const total = s.stations.length
  const openCount = s.stations.filter((st) => st.open).length
  const pctValue = Math.round((openCount / total) * 100)
  const pctLabel = `${FA(pctValue)}٪`

  const stations: BuiltStation[] = s.stations.map((st) => ({
    ...st,
    rowBg: st.open ? '#f1e9ff' : '#f6f1e6',
    chipBg: st.open ? s.tint : '#e9e2d6',
    filter: st.open ? 'none' : 'grayscale(1) opacity(.55)',
    titleColor: st.open ? '#241452' : '#8a7cb4',
    badgeLabel: st.open ? (st.lessons ?? '') : 'به‌زودی',
    badgeBg: st.open ? s.tint : '#eae3d6',
    badgeText: st.open ? '#5b4a92' : '#8a7cb4',
  }))

  return {
    ...s,
    stations,
    pctValue,
    pctLabel,
    openCount,
    readyLabel: `${FA(openCount)} سیاره باز از ${FA(total)}`,
    dim: active ? 1 : 0.45,
    chipBg: active ? s.color : 'rgba(255,255,255,.08)',
    chipBorder: active ? s.color : 'rgba(255,255,255,.22)',
    chipText: active ? '#241452' : '#efeaff',
    pillBg: active ? '#fff8ec' : 'rgba(20,11,61,.85)',
    pillBorder: active ? s.color : 'rgba(255,255,255,.2)',
    pillText: active ? '#241452' : '#efeaff',
  }
}

interface GalaxyStationDot {
  emoji: string
  size: number
  font: number
  x: number
  y: number
  ring: string
  bg: string
  glow: string
  filter: string
}

interface GalaxyArm extends BuiltSchool {
  mapStations: GalaxyStationDot[]
  armLen: number
  angle: number
  tip: string
  tipX: number
  tipY: number
  tipAnim: string
  labelX: number
  labelY: number
  labelTx: string
}

const CENTER = 340
const BASE_R = 100
const STEP_R = 34
const MAX_MAP_STATIONS = 5
const ARM_ANGLES = [-90, -18, 54, 126, 198]
const RING_RADII = [100, 134, 168, 202, 236]

function buildGalaxy(schools: BuiltSchool[]): GalaxyArm[] {
  return schools.map((s, i) => {
    const angleDeg = ARM_ANGLES[i]!
    const angleRad = (angleDeg * Math.PI) / 180
    const cos = Math.cos(angleRad)
    const sin = Math.sin(angleRad)
    const list = s.stations.slice(0, MAX_MAP_STATIONS)

    const mapStations: GalaxyStationDot[] = list.map((st, j) => {
      const r = BASE_R + j * STEP_R
      return {
        emoji: st.emoji,
        size: st.open ? 30 : 24,
        font: st.open ? 15 : 12,
        x: Math.round(CENTER + r * cos),
        y: Math.round(CENTER + r * sin),
        ring: st.open ? '#ffffff' : 'rgba(255,255,255,.28)',
        bg: st.open ? s.tint : 'rgba(255,255,255,.12)',
        glow: st.open ? `0 0 20px ${s.color}` : 'none',
        filter: st.open ? 'none' : 'grayscale(1) opacity(.7)',
      }
    })

    const lastOpen = list.filter((st) => st.open).length
    const endR = BASE_R + (list.length - 1) * STEP_R
    const done = lastOpen === list.length
    const tipR = lastOpen === 0 ? BASE_R : BASE_R + (lastOpen - 0.5) * STEP_R
    const off = 25
    const labelR = endR + 30
    const ly = CENTER + labelR * sin

    let lx: number
    let tx: string
    if (cos > 0.3) {
      lx = 676
      tx = '-100%,-50%'
    } else if (cos < -0.3) {
      lx = 4
      tx = '0,-50%'
    } else {
      lx = CENTER
      tx = sin < 0 ? '-50%,-100%' : '-50%,0'
    }

    return {
      ...s,
      mapStations,
      armLen: Math.round(endR),
      angle: angleDeg,
      tip: lastOpen === 0 ? '🔒' : done ? '🏆' : '🚀',
      tipX: Math.round(CENTER + tipR * cos - off * sin),
      tipY: Math.round(CENTER + tipR * sin + off * cos),
      tipAnim: lastOpen > 0 ? 'galaxy-bob 2.6s ease-in-out infinite' : 'none',
      labelX: Math.round(lx),
      labelY: Math.round(Math.min(648, Math.max(6, ly))),
      labelTx: `translate(${tx})`,
    }
  })
}

export function GalacticSchoolsMap({ lang }: { lang: string }) {
  const [selected, setSelected] = useState(SCHOOLS[0]!.short)
  const stageWrapRef = useRef<HTMLDivElement | null>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = stageWrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      const width = rect?.width ?? 680
      const height = rect?.height ?? 680
      // اسکیل هم بر اساس عرض و هم بر اساس ارتفاع در دسترس محاسبه می‌شود
      // تا کل نقشه همیشه بدون اسکرول در صفحه جا بگیرد.
      const next = Math.max(0.3, Math.min(1, Math.min(width / 680, height / 680)))
      setScale((prev) => (Math.abs(next - prev) > 0.005 ? next : prev))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const builtSchools = useMemo(() => SCHOOLS.map((s) => buildSchool(s, s.short === selected)), [selected])
  const activeSchool = builtSchools.find((s) => s.short === selected) ?? builtSchools[0]!
  const galaxyArms = useMemo(() => buildGalaxy(builtSchools), [builtSchools])
  const totalReady = FA(
    builtSchools.reduce((sum, s) => sum + s.stations.reduce((a, st) => a + st.lessonsCount, 0), 0)
  )

  return (
    <section
      dir="rtl"
      className="relative flex flex-col"
      style={{
        height: 'calc(100dvh - 64px)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        padding: '22px clamp(16px, 3vw, 40px) 16px',
        color: '#fff',
        background:
          'radial-gradient(900px 600px at 78% 4%, #4c2a9e 0%, rgba(76,42,158,0) 60%), ' +
          'radial-gradient(760px 520px at 10% 92%, #1b6fb8 0%, rgba(27,111,184,0) 58%), ' +
          'linear-gradient(#1a0f4d 0%, #100836 100%)',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(2px 2px at 60px 80px, #fff, transparent), ' +
            'radial-gradient(1.6px 1.6px at 220px 260px, rgba(255,255,255,.75), transparent), ' +
            'radial-gradient(1.4px 1.4px at 380px 120px, rgba(255,214,102,.8), transparent)',
          backgroundSize: '460px 340px, 300px 240px, 520px 400px',
          opacity: 0.55,
          animation: 'galaxy-twinkle 5s ease-in-out infinite',
        }}
      />

      <header
        className="relative mx-auto mb-3 flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-4"
        style={{ flexShrink: 0 }}
      >
        <div>
          <div
            className="mb-1.5 inline-flex items-center gap-2 rounded-full text-[12px] font-bold"
            style={{ padding: '5px 13px', background: 'rgba(255,255,255,.14)' }}
          >
            🚀 نقشهٔ کهکشانی مایلند
          </div>
          <h1 className="m-0 font-black" style={{ fontSize: 'clamp(22px, 2.6vw, 34px)', lineHeight: 1.25 }}>
            کدوم سیاره رو فتح کنیم؟
          </h1>
        </div>
        <div
          className="flex items-center gap-2 rounded-[18px]"
          style={{ padding: '9px 15px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)' }}
        >
          <span style={{ fontSize: 22 }}>🏆</span>
          <div>
            <div className="text-[16px] font-black">{totalReady} درس آماده</div>
            <div className="text-[11px]" style={{ color: '#cfc7ff' }}>
              ۵ بازو · سفر ادامه دارد
            </div>
          </div>
        </div>
      </header>

      <div
        className="relative mx-auto grid w-full max-w-[1500px] grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]"
        style={{ flex: '1 1 auto', minHeight: 0 }}
      >
        <section
          className="flex min-w-0 flex-col rounded-[34px]"
          style={{
            padding: '16px clamp(14px,2vw,26px) 14px',
            background: 'linear-gradient(rgba(255,255,255,.12), rgba(255,255,255,.05))',
            border: '1px solid rgba(255,255,255,.16)',
            minHeight: 0,
          }}
        >
          <div className="mb-1.5 flex flex-wrap items-center gap-2" style={{ flexShrink: 0 }}>
            {builtSchools.map((s) => (
              <button
                key={s.short}
                type="button"
                onClick={() => setSelected(s.short)}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full text-[13px] font-bold"
                style={{ padding: '8px 14px', border: `2px solid ${s.chipBorder}`, background: s.chipBg, color: s.chipText }}
              >
                <span>{s.emoji}</span> <span>{s.short}</span>
              </button>
            ))}
          </div>

          <div
            ref={stageWrapRef}
            className="relative mx-auto mt-1.5 flex w-full items-center justify-center overflow-hidden"
            style={{ flex: '1 1 auto', minHeight: 0 }}
          >
            <div
              dir="ltr"
              className="relative"
              style={{ width: 680, height: 680, flexShrink: 0, transformOrigin: 'center center', transform: `scale(${scale})` }}
            >
              {RING_RADII.map((r) => (
                <div
                  key={r}
                  className="absolute rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    border: '2px dashed rgba(255,255,255,.1)',
                    width: r * 2,
                    height: r * 2,
                  }}
                />
              ))}

              <div
                className="absolute rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 142,
                  height: 142,
                  background: 'radial-gradient(circle at 42% 36%, #fff6d8 0%, #ffd166 44%, #f0932b 80%, rgba(240,147,43,0) 81%)',
                  boxShadow: '0 0 70px rgba(255,209,102,.4)',
                }}
              />
              <div
                dir="rtl"
                className="absolute text-center text-[13px] font-black"
                style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 130, color: '#5b3a00' }}
              >
                پایگاه پرتاب
              </div>

              {galaxyArms.map((arm) => (
                <div
                  key={`line-${arm.short}`}
                  className="absolute rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    height: 6,
                    width: arm.armLen,
                    transformOrigin: '0 50%',
                    transform: `translateY(-50%) rotate(${arm.angle}deg)`,
                    opacity: arm.dim,
                    background: `repeating-linear-gradient(to right, ${arm.color} 0px, ${arm.color} 14px, rgba(255,255,255,.08) 14px, rgba(255,255,255,.08) 26px)`,
                  }}
                />
              ))}

              {galaxyArms.map((arm) => (
                <div
                  key={arm.short}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(arm.short)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelected(arm.short)
                  }}
                  aria-label={arm.name}
                  className="cursor-pointer"
                  style={{ opacity: arm.dim, transition: 'opacity .2s' }}
                >
                  {arm.mapStations.map((st, j) => (
                    <div
                      key={j}
                      className="absolute flex items-center justify-center rounded-full"
                      style={{
                        boxSizing: 'border-box',
                        width: st.size,
                        height: st.size,
                        fontSize: st.font,
                        left: st.x,
                        top: st.y,
                        transform: 'translate(-50%,-50%)',
                        border: `3px solid ${st.ring}`,
                        background: st.bg,
                        boxShadow: st.glow,
                        filter: st.filter,
                      }}
                    >
                      {st.emoji}
                    </div>
                  ))}

                  <div
                    className="absolute"
                    style={{ fontSize: 22, left: arm.tipX, top: arm.tipY, transform: 'translate(-50%,-50%)', animation: arm.tipAnim }}
                  >
                    {arm.tip}
                  </div>

                  <div
                    dir="rtl"
                    className="absolute flex items-center gap-2 whitespace-nowrap rounded-full"
                    style={{
                      padding: '8px 14px',
                      background: arm.pillBg,
                      border: `2px solid ${arm.pillBorder}`,
                      boxShadow: '0 6px 20px rgba(10,4,40,.4)',
                      left: arm.labelX,
                      top: arm.labelY,
                      transform: arm.labelTx,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{arm.emoji}</span>
                    <span className="text-[13.5px] font-extrabold" style={{ color: arm.pillText }}>
                      {arm.short}
                    </span>
                    <span className="text-[11.5px] font-bold" style={{ color: arm.color }}>
                      {arm.pctLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="mt-3.5 flex flex-wrap items-center justify-center gap-[18px] text-[12.5px]"
            style={{ color: '#cfc7ff', flexShrink: 0 }}
          >
            <span className="flex items-center gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full" style={{ background: '#fff', border: '2px solid #ffd166', boxSizing: 'border-box' }} />
              سیارهٔ باز
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="h-3.5 w-3.5 rounded-full"
                style={{ background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.3)', boxSizing: 'border-box' }}
              />
              قفل — به‌زودی
            </span>
            <span className="flex items-center gap-1.5">🚀 اینجایی</span>
            <span className="flex items-center gap-1.5">🏆 پایان مسیر</span>
          </div>
        </section>

        <aside
          className="flex min-h-0 flex-col rounded-[34px]"
          style={{ padding: 20, background: '#fff8ec', color: '#241452', boxShadow: '0 24px 60px rgba(8,3,32,.45)' }}
        >
          <div className="mb-3 flex items-center gap-3" style={{ flexShrink: 0 }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] text-[28px]" style={{ background: activeSchool.tint }}>
              {activeSchool.emoji}
            </div>
            <div>
              <div className="text-xl font-black">{activeSchool.name}</div>
              <div className="mt-1 text-[12.5px] font-bold" style={{ color: '#7a6ca8' }}>
                {activeSchool.readyLabel}
              </div>
            </div>
          </div>

          <p className="m-0 mb-3 text-[13.5px] leading-[1.9]" style={{ color: '#4b3b7a', flexShrink: 0 }}>
            {activeSchool.desc}
          </p>

          <div className="mb-3.5 flex items-center gap-2.5" style={{ flexShrink: 0 }}>
            <div className="h-3.5 flex-1 overflow-hidden rounded-full" style={{ background: '#ece3ff' }}>
              <div className="h-full rounded-full" style={{ width: `${activeSchool.pctValue}%`, background: activeSchool.color }} />
            </div>
            <span className="whitespace-nowrap text-[12.5px] font-extrabold" style={{ color: '#5b4a92' }}>
              {activeSchool.pctLabel} سفر
            </span>
          </div>

          <div className="mb-3 flex flex-col gap-2 overflow-y-auto" style={{ flex: '1 1 auto', minHeight: 0 }}>
            {activeSchool.stations.map((st, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-[18px]" style={{ padding: '10px 12px', background: st.rowBg }}>
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[13px] text-lg"
                  style={{ background: st.chipBg, filter: st.filter }}
                >
                  {st.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13.5px] font-extrabold" style={{ color: st.titleColor }}>
                    {st.name}
                  </span>
                  <span className="mt-0.5 block text-[11.5px]" style={{ color: '#7a6ca8' }}>
                    {st.sub}
                  </span>
                </span>
                <span
                  className="whitespace-nowrap rounded-full text-[11px] font-extrabold"
                  style={{ padding: '5px 10px', color: st.badgeText, background: st.badgeBg }}
                >
                  {st.badgeLabel}
                </span>
              </div>
            ))}
          </div>

          <Link
            href={`/${lang}/curriculum/${activeSchool.slug}`}
            className="flex items-center justify-center gap-2 rounded-[20px] text-[15px] font-black"
            style={{
              padding: 15,
              color: '#241452',
              background: activeSchool.color,
              boxShadow: `0 8px 0 ${activeSchool.shadow}`,
              flexShrink: 0,
            }}
          >
            {activeSchool.cta}
          </Link>
        </aside>
      </div>
    </section>
  )
}
