/** داده و مسیر مشترک ایستگاه‌های کهکشان یادگیری */

export type PlanetCategory = 'math' | 'programming' | 'combined' | 'design' | 'robotics' | 'ai'

export interface PlanetPrerequisite {
  label: string
  href: string
}

export interface PlanetStation {
  id: string
  label: string
  /** توضیح کوتاه و جذاب: در این ایستگاه چه یاد می‌گیری؟ */
  learn: string
  highlights: string[]
  category: PlanetCategory
  /** موقعیت ۰–۱ روی مسیر پرواز */
  t: number
  href: string
  locked?: boolean
  /** ارجاع به درس/مدرسه دیگر (بدون تکرار محتوا) */
  prerequisites?: PlanetPrerequisite[]
  /** هسته / پیش‌نیاز / اختصاصی / نقطه عطف */
  kind?: 'core' | 'prerequisite' | 'specialty' | 'milestone'
  planetFrom: string
  planetTo: string
  accent: string
  emoji: string
  /** برچسب سطح — مقدماتی/پایه/میانی/پیشرفته (برای کارت کهکشانی) */
  level?: string
  /** تعداد درس‌های این ایستگاه */
  lessonsCount?: number
  /** امتیاز XP نمادین این ایستگاه */
  xp?: number
  /** رنگ هالهٔ نورانی دور سیاره (rgba) */
  glow?: string
  /** رنگ حلقهٔ زحل‌مانند دور سیاره (rgba) */
  ring?: string
}

export const CATEGORY_COLORS: Record<PlanetCategory, string> = {
  math: '#0D9488',
  programming: '#EA580C',
  combined: '#0284C7',
  design: '#DB2777',
  robotics: '#7C3AED',
  ai: '#0891B2',
}

export const CATEGORY_LABELS: Record<PlanetCategory, string> = {
  math: 'ریاضی',
  programming: 'برنامه‌نویسی',
  combined: 'ترکیبی',
  design: 'طراحی',
  robotics: 'رباتیک',
  ai: 'هوش مصنوعی',
}

/** طول مسیر پرواز/فاصله عمودی بین دو ایستگاه — بر اساس همین عدد طول مسیر متناسب با تعداد ایستگاه‌ها می‌شود */
const STATION_STEP = 300
const PATH_TOP_PAD = 70
const PATH_BOTTOM_PAD = 90

export const VIEW_W = 400

/**
 * مسیر پرواز مارپیچ را متناسب با تعداد ایستگاه‌ها می‌سازد — نه یک مسیر
 * ثابت با طول یکسان برای هر مدرسه، صرف‌نظر از اینکه ۳ ایستگاه دارد یا ۱۰ تا.
 * همان حس مارپیچ/فرود بین سیاره‌ها حفظ می‌شود، فقط طول اسکرول با محتوا هم‌راستا است.
 */
export function buildFlightPath(stationCount: number): { d: string; viewH: number } {
  const segments = Math.max(1, stationCount - 1)
  const viewH = PATH_TOP_PAD + STATION_STEP * segments + PATH_BOTTOM_PAD
  const cx = VIEW_W / 2
  const amp = 92
  let d = `M ${cx} ${PATH_TOP_PAD}`
  let prevX = cx
  for (let i = 0; i < segments; i++) {
    const y0 = PATH_TOP_PAD + STATION_STEP * i
    const y1 = PATH_TOP_PAD + STATION_STEP * (i + 1)
    const dir = i % 2 === 0 ? 1 : -1
    const nextDir = i % 2 === 0 ? -1 : 1
    const x1 = cx + dir * amp
    const cy0 = y0 + STATION_STEP * 0.42
    const cy1 = y1 - STATION_STEP * 0.42
    /** کنترل‌پوینت اول کمی به‌سمت جهت بعدی خم می‌شود تا مسیر نرم/موج‌دار بماند، نه زاویه‌دار */
    const cx0 = prevX + nextDir * amp * 0.15
    d += ` C ${cx0} ${cy0}, ${x1} ${cy1}, ${x1} ${y1}`
    prevX = x1
  }
  return { d, viewH }
}

export function buildDefaultPlanetStations(lang: string): PlanetStation[] {
  const base = `/${lang}/curriculum`
  return [
    {
      id: 'start',
      label: 'پایگاه پرتاب',
      learn: 'از اینجا سفر یادگیری‌ات شروع می‌شود — آماده‌ای؟',
      highlights: ['آشنایی با مسیر', 'انتخاب ایستگاه بعدی'],
      category: 'combined',
      t: 0.03,
      href: base,
      planetFrom: '#7DD3FC',
      planetTo: '#0284C7',
      accent: '#BAE6FD',
      emoji: '🚀',
    },
    {
      id: 'fractions',
      label: 'سیارهٔ کسرها',
      learn: 'یاد می‌گیری کسر یعنی چه، چطور مقایسه و جمع کنی، و مخرج مشترک بگیری.',
      highlights: ['کسر و صورت', 'مقایسه', 'ک.م.م و جمع'],
      category: 'math',
      t: 0.13,
      href: `${base}/math/fractions`,
      planetFrom: '#5EEAD4',
      planetTo: '#0F766E',
      accent: '#CCFBF1',
      emoji: '🍕',
    },
    {
      id: 'decimals',
      label: 'سیارهٔ اعشار و درصد',
      learn: 'اعداد اعشاری و درصد را مثل پول و تخفیف واقعی می‌فهمی.',
      highlights: ['اعشار', 'درصد', 'تبدیل به کسر'],
      category: 'math',
      t: 0.23,
      href: `${base}/math`,
      planetFrom: '#6EE7B7',
      planetTo: '#047857',
      accent: '#D1FAE5',
      emoji: '💯',
    },
    {
      id: 'python-intro',
      label: 'سیارهٔ پایتون',
      learn: 'اولین قدم‌های کدنویسی با پایتون: متغیر، شرط و حلقه.',
      highlights: ['متغیرها', 'شرط if', 'حلقه‌ها'],
      category: 'programming',
      t: 0.33,
      href: `${base}/programming`,
      planetFrom: '#FDBA74',
      planetTo: '#C2410C',
      accent: '#FFEDD5',
      emoji: '🐍',
    },
    {
      id: 'algebra',
      label: 'سیارهٔ جبر',
      learn: 'با حرف‌ها و معادله‌ها دوست می‌شوی و مسئله را قدم‌به‌قدم حل می‌کنی.',
      highlights: ['عبارت جبری', 'معادله ساده', 'جایگزینی'],
      category: 'math',
      t: 0.43,
      href: `${base}/math`,
      planetFrom: '#86EFAC',
      planetTo: '#15803D',
      accent: '#DCFCE7',
      emoji: '𝑥',
    },
    {
      id: 'data-structures',
      label: 'سیارهٔ ساختار داده',
      learn: 'یاد می‌گیری داده را با لیست و تابع منظم کنی — مثل قفسهٔ هوشمند.',
      highlights: ['لیست‌ها', 'توابع', 'سازمان‌دهی کد'],
      category: 'programming',
      t: 0.53,
      href: `${base}/programming`,
      planetFrom: '#FDBA74',
      planetTo: '#9A3412',
      accent: '#FFEDD5',
      emoji: '📦',
    },
    {
      id: 'stats',
      label: 'سیارهٔ آمار',
      learn: 'میانگین، نمودار و احتمال را با مثال‌های روزمره می‌فهمی.',
      highlights: ['میانگین', 'نمودار', 'احتمال ساده'],
      category: 'math',
      t: 0.63,
      href: `${base}/math`,
      planetFrom: '#5EEAD4',
      planetTo: '#115E59',
      accent: '#CCFBF1',
      emoji: '📊',
    },
    {
      id: 'numpy-pandas',
      label: 'سیارهٔ داده',
      learn: 'با NumPy و Pandas جدول‌ها و اعداد بزرگ را مثل یک دانشمند داده جابه‌جا می‌کنی.',
      highlights: ['NumPy', 'Pandas', 'جدول داده'],
      category: 'programming',
      t: 0.73,
      href: `${base}/programming`,
      planetFrom: '#FDBA74',
      planetTo: '#7C2D12',
      accent: '#FFEDD5',
      emoji: '🧮',
    },
    {
      id: 'ml-basics',
      label: 'سیارهٔ یادگیری ماشین',
      learn: 'می‌فهمی کامپیوتر چطور از داده یاد می‌گیرد — قدم اول هوش مصنوعی.',
      highlights: ['مفهوم مدل', 'داده آموزشی', 'پیش‌بینی'],
      category: 'combined',
      t: 0.85,
      href: base,
      locked: true,
      planetFrom: '#A5F3FC',
      planetTo: '#0369A1',
      accent: '#E0F2FE',
      emoji: '🤖',
    },
    {
      id: 'ai-project',
      label: 'پایگاه پروژهٔ هوش مصنوعی',
      learn: 'یک پروژهٔ واقعی می‌سازی و چیزهایی که یاد گرفتی را به کار می‌گیری.',
      highlights: ['پروژه واقعی', 'ترکیب مهارت‌ها', 'ارائه نتیجه'],
      category: 'combined',
      t: 0.95,
      href: base,
      locked: true,
      planetFrom: '#FDE68A',
      planetTo: '#D97706',
      accent: '#FEF9C3',
      emoji: '🛰️',
    },
  ]
}

export interface PathPoint {
  x: number
  y: number
  angle: number
}

export function sampleFlightPath(path: SVGPathElement, t: number, totalLen: number): PathPoint {
  const len = Math.min(totalLen, Math.max(0, t * totalLen))
  const p = path.getPointAtLength(len)
  const look = Math.min(totalLen, len + 2)
  const p2 = path.getPointAtLength(look)
  const angle = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI
  return { x: p.x, y: p.y, angle }
}
