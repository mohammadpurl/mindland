/** مسیرهای موازی (اتوبان کهکشانی) برای هاب پنج مدرسه */

export type HubLaneId = 'math' | 'design' | 'programming' | 'ai' | 'robotics'

export interface HubLane {
  id: HubLaneId
  label: string
  shortLabel: string
  /** مسیر SVG در viewBox هاب */
  pathD: string
  color: string
  glow: string
  strokeWidth: number
  /** پهنای «باند اتوبان» زیر خط اصلی */
  highwayWidth: number
  shipFill: string
  shipStroke: string
  shipAccent: string
}

export interface HubSchoolNode {
  id: HubLaneId
  label: string
  /** نام کوتاه روی سفینه / نوار چسبان */
  shortLabel: string
  blurb: string
  laneId: HubLaneId
  /** موقعیت ۰–۱ روی مسیر همان باند */
  t: number
  href: string
  emoji: string
  role: 'backbone' | 'builder' | 'applied'
  comingSoon?: boolean
  planetFrom: string
  planetTo: string
  accent: string
}

/** viewBox مشترک نقشهٔ هاب */
export const HUB_VIEW_W = 400
export const HUB_VIEW_H = 2600

/**
 * پنج باند موازی:
 * - ریاضی: ستون وسط (اتوبان اصلی)
 * - طراحی: باند چپ موازی
 * - برنامه‌نویسی: باند راست
 * - AI و رباتیک: دو باند منشعب از برنامه‌نویسی
 */
export const HUB_LANES: HubLane[] = [
  {
    id: 'math',
    label: 'اتوبان ریاضیات',
    shortLabel: 'ریاضی',
    pathD:
      'M 200 40 ' +
      'C 200 180, 205 320, 200 480 ' +
      'C 195 700, 200 920, 200 1140 ' +
      'C 200 1400, 198 1680, 200 1960 ' +
      'C 202 2200, 200 2400, 200 2550',
    color: '#0D9488',
    glow: '#5EEAD4',
    strokeWidth: 4.5,
    highwayWidth: 22,
    shipFill: '#CCFBF1',
    shipStroke: '#0F766E',
    shipAccent: '#FBBF24',
  },
  {
    id: 'design',
    label: 'باند طراحی',
    shortLabel: 'طراحی',
    pathD:
      'M 200 40 ' +
      'C 200 140, 200 220, 200 300 ' +
      'C 150 380, 85 460, 72 620 ' +
      'C 55 900, 60 1200, 68 1520 ' +
      'C 75 1850, 80 2150, 78 2550',
    color: '#DB2777',
    glow: '#F9A8D4',
    strokeWidth: 3,
    highwayWidth: 14,
    shipFill: '#FCE7F3',
    shipStroke: '#BE185D',
    shipAccent: '#F472B6',
  },
  {
    id: 'programming',
    label: 'باند برنامه‌نویسی',
    shortLabel: 'کد',
    pathD:
      'M 200 40 ' +
      'C 200 140, 200 220, 200 300 ' +
      'C 250 380, 315 460, 328 620 ' +
      'C 340 820, 335 980, 330 1120',
    color: '#EA580C',
    glow: '#FDBA74',
    strokeWidth: 3.2,
    highwayWidth: 15,
    shipFill: '#FFEDD5',
    shipStroke: '#C2410C',
    shipAccent: '#FB923C',
  },
  {
    id: 'ai',
    label: 'باند هوش مصنوعی',
    shortLabel: 'AI',
    pathD:
      'M 200 40 ' +
      'C 200 140, 200 220, 200 300 ' +
      'C 250 380, 315 460, 328 620 ' +
      'C 340 820, 335 980, 330 1120 ' +
      'C 355 1300, 370 1600, 365 1950 ' +
      'C 360 2200, 355 2400, 350 2550',
    color: '#0891B2',
    glow: '#67E8F9',
    strokeWidth: 2.8,
    highwayWidth: 12,
    shipFill: '#CFFAFE',
    shipStroke: '#0E7490',
    shipAccent: '#22D3EE',
  },
  {
    id: 'robotics',
    label: 'باند رباتیک',
    shortLabel: 'ربات',
    pathD:
      'M 200 40 ' +
      'C 200 140, 200 220, 200 300 ' +
      'C 250 380, 315 460, 328 620 ' +
      'C 340 820, 335 980, 330 1120 ' +
      'C 300 1320, 270 1580, 255 1900 ' +
      'C 245 2150, 240 2350, 245 2550',
    color: '#7C3AED',
    glow: '#C4B5FD',
    strokeWidth: 2.8,
    highwayWidth: 12,
    shipFill: '#EDE9FE',
    shipStroke: '#6D28D9',
    shipAccent: '#A78BFA',
  },
]

export function buildHubSchoolNodes(lang: string): HubSchoolNode[] {
  const base = `/${lang}/curriculum`
  return [
    {
      id: 'math',
      label: 'مدرسه ریاضیات',
      shortLabel: 'ریاضیات',
      blurb: 'ستون فقرات — کسرها و هندسه در حال ساخت',
      laneId: 'math',
      t: 0.14,
      href: `${base}/math`,
      emoji: '📐',
      role: 'backbone',
      planetFrom: '#5EEAD4',
      planetTo: '#0F766E',
      accent: '#CCFBF1',
    },
    {
      id: 'design',
      label: 'مدرسه طراحی',
      shortLabel: 'طراحی',
      blurb: 'باند موازی — بصری و UX',
      laneId: 'design',
      t: 0.2,
      href: `${base}/design`,
      emoji: '🎨',
      role: 'applied',
      comingSoon: true,
      planetFrom: '#F9A8D4',
      planetTo: '#BE185D',
      accent: '#FCE7F3',
    },
    {
      id: 'programming',
      label: 'مدرسه برنامه‌نویسی',
      shortLabel: 'برنامه‌نویسی',
      blurb: 'منطق و پایتون — بدون تکرار ریاضی',
      laneId: 'programming',
      t: 0.45,
      href: `${base}/programming`,
      emoji: '🐍',
      role: 'builder',
      comingSoon: true,
      planetFrom: '#FDBA74',
      planetTo: '#C2410C',
      accent: '#FFEDD5',
    },
    {
      id: 'ai',
      label: 'مدرسه هوش مصنوعی',
      shortLabel: 'هوش مصنوعی',
      blurb: 'بعد از ریاضی پیشرفته و پایتون',
      laneId: 'ai',
      t: 0.38,
      href: `${base}/ai`,
      emoji: '🤖',
      role: 'applied',
      comingSoon: true,
      planetFrom: '#67E8F9',
      planetTo: '#0E7490',
      accent: '#CFFAFE',
    },
    {
      id: 'robotics',
      label: 'مدرسه رباتیک',
      shortLabel: 'رباتیک',
      blurb: 'بعد از هندسه/مثلثات و کد پایه',
      laneId: 'robotics',
      t: 0.38,
      href: `${base}/robotics`,
      emoji: '⚙️',
      role: 'applied',
      comingSoon: true,
      planetFrom: '#C4B5FD',
      planetTo: '#6D28D9',
      accent: '#EDE9FE',
    },
  ]
}

export const ROLE_LABEL_FA: Record<HubSchoolNode['role'], string> = {
  backbone: 'ستون فقرات',
  builder: 'سازنده',
  applied: 'کاربردی',
}
