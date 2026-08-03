/** داده و مسیر مشترک ایستگاه‌های کهکشان یادگیری */

export type PlanetCategory = 'math' | 'programming' | 'combined'

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
  planetFrom: string
  planetTo: string
  accent: string
  emoji: string
}

export const CATEGORY_COLORS: Record<PlanetCategory, string> = {
  math: '#0D9488',
  programming: '#EA580C',
  combined: '#0284C7',
}

export const CATEGORY_LABELS: Record<PlanetCategory, string> = {
  math: 'ریاضی',
  programming: 'برنامه‌نویسی',
  combined: 'ترکیبی',
}

export const FLIGHT_PATH_D =
  'M 200 60 ' +
  'C 300 140, 330 240, 260 340 ' +
  'C 170 470, 70 540, 110 700 ' +
  'C 150 860, 310 920, 300 1080 ' +
  'C 290 1240, 120 1310, 130 1470 ' +
  'C 145 1650, 300 1720, 280 1880 ' +
  'C 255 2060, 100 2140, 140 2300 ' +
  'C 185 2480, 300 2560, 200 2860'

export const VIEW_W = 400
export const VIEW_H = 3000

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
