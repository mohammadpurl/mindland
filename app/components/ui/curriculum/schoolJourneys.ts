import type { PlanetStation, PlanetCategory, PlanetPrerequisite } from './planetStations'

export type StationKind = NonNullable<PlanetStation['kind']>
export type StationPrereq = PlanetPrerequisite

/** ایستگاه مسیر مدرسه — همان PlanetStation با فیلدهای پیش‌نیاز */
export type SchoolPlanetStation = PlanetStation

export interface SchoolJourneyMeta {
  subjectId: string
  schoolTitle: string
  journeyTitle: string
  journeySubtitle: string
  /** نقش در اکوسیستم پنج‌مدرسه */
  role: 'backbone' | 'builder' | 'applied'
}

export interface SchoolJourney extends SchoolJourneyMeta {
  buildStations: (lang: string) => SchoolPlanetStation[]
}

function mathHref(lang: string, topicId?: string) {
  const base = `/${lang}/curriculum/math`
  return topicId ? `${base}/${topicId}` : base
}

function schoolHref(lang: string, schoolId: string, topicId?: string) {
  const base = `/${lang}/curriculum/${schoolId}`
  return topicId ? `${base}/${topicId}` : base
}

function planet(
  partial: Omit<SchoolPlanetStation, 'planetFrom' | 'planetTo' | 'accent'> & {
    planetFrom?: string
    planetTo?: string
    accent?: string
  }
): SchoolPlanetStation {
  const defaults: Record<PlanetCategory, { from: string; to: string; accent: string }> = {
    math: { from: '#5EEAD4', to: '#0F766E', accent: '#CCFBF1' },
    programming: { from: '#FDBA74', to: '#C2410C', accent: '#FFEDD5' },
    combined: { from: '#7DD3FC', to: '#0369A1', accent: '#E0F2FE' },
    design: { from: '#F9A8D4', to: '#BE185D', accent: '#FCE7F3' },
    robotics: { from: '#C4B5FD', to: '#6D28D9', accent: '#EDE9FE' },
    ai: { from: '#67E8F9', to: '#0E7490', accent: '#CFFAFE' },
  }
  const d = defaults[partial.category]
  return {
    planetFrom: partial.planetFrom ?? d.from,
    planetTo: partial.planetTo ?? d.to,
    accent: partial.accent ?? d.accent,
    ...partial,
  }
}

function evenly(count: number, start = 0.04, end = 0.96): number[] {
  if (count <= 1) return [start]
  return Array.from({ length: count }, (_, i) => start + (i / (count - 1)) * (end - start))
}

/** ۱) مدرسه ریاضیات — ستون فقرات */
export function buildMathSchoolStations(lang: string): SchoolPlanetStation[] {
  const specs: Array<Omit<SchoolPlanetStation, 't' | 'planetFrom' | 'planetTo' | 'accent'> & { t?: number }> = [
    {
      id: 'math-launch',
      label: 'پایگاه ریاضی',
      learn: 'ریاضیات ستون فقرات همه مدارس مایلند است. از اینجا سفر را شروع کن.',
      highlights: ['ستون فقرات', 'مسیر منسجم'],
      category: 'math',
      href: mathHref(lang),
      kind: 'milestone',
      emoji: '🚀',
    },
    {
      id: 'fractions',
      label: 'کسرها',
      learn: 'جمع، تفریق، ضرب، مقایسه و مخرج مشترک — همین حالا قابل یادگیری است.',
      highlights: ['در حال ساخت', 'MVP فعلی', 'کتاب ششم'],
      category: 'math',
      href: mathHref(lang, 'fractions'),
      kind: 'core',
      emoji: '🍕',
    },
    {
      id: 'decimals',
      label: 'اعشار و درصد',
      learn: 'اعداد اعشاری و درصد را مثل پول و تخفیف واقعی می‌فهمی.',
      highlights: ['سطح مقدماتی', 'به‌زودی'],
      category: 'math',
      href: mathHref(lang, 'decimals'),
      locked: true,
      kind: 'core',
      emoji: '💯',
    },
    {
      id: 'ratios',
      label: 'نسبت و تناسب',
      learn: 'نسبت و تناسب را برای مسئله‌های واقعی به کار می‌گیری.',
      highlights: ['سطح مقدماتی', 'به‌زودی'],
      category: 'math',
      href: mathHref(lang, 'ratios'),
      locked: true,
      kind: 'core',
      emoji: '⚖️',
    },
    {
      id: 'integers',
      label: 'اعداد صحیح',
      learn: 'اعداد منفی و خط اعداد را مسلط می‌شوی.',
      highlights: ['سطح مقدماتی', 'به‌زودی'],
      category: 'math',
      href: mathHref(lang, 'integers'),
      locked: true,
      kind: 'core',
      emoji: '➖',
    },
    {
      id: 'geometry',
      label: 'هندسه پایه',
      learn: 'محیط، مساحت، زاویه و اشکال — پیش‌نیاز طراحی و رباتیک.',
      highlights: ['شروع شده', 'پیش‌نیاز طراحی/رباتیک'],
      category: 'math',
      href: mathHref(lang, 'geometry'),
      kind: 'core',
      emoji: '📐',
    },
    {
      id: 'algebra',
      label: 'جبر پایه',
      learn: 'معادله و عبارت جبری — پیش‌نیاز برنامه‌نویسی پیشرفته و AI.',
      highlights: ['سطح متوسط', 'به‌زودی'],
      category: 'math',
      href: mathHref(lang, 'algebra'),
      locked: true,
      kind: 'core',
      emoji: '𝑥',
    },
    {
      id: 'stats-prob',
      label: 'آمار و احتمال',
      learn: 'میانگین، نمودار و احتمال ساده تا پیشرفته — مسیر مستقیم به AI.',
      highlights: ['سطح متوسط→پیشرفته', 'پیش‌نیاز AI'],
      category: 'math',
      href: mathHref(lang, 'stats'),
      locked: true,
      kind: 'core',
      emoji: '📊',
    },
    {
      id: 'trigonometry',
      label: 'مثلثات پایه',
      learn: 'سینوس و کسینوس شهودی — پیش‌نیاز رباتیک و گرافیک.',
      highlights: ['سطح پیشرفته', 'پیش‌نیاز رباتیک'],
      category: 'math',
      href: mathHref(lang, 'trigonometry'),
      locked: true,
      kind: 'core',
      emoji: '△',
    },
    {
      id: 'linear-algebra',
      label: 'جبر خطی مقدماتی',
      learn: 'بردار و ماتریس — پیش‌نیاز مستقیم هوش مصنوعی.',
      highlights: ['سطح پیشرفته', 'پیش‌نیاز AI'],
      category: 'math',
      href: mathHref(lang, 'linear-algebra'),
      locked: true,
      kind: 'core',
      emoji: '▦',
    },
  ]

  const ts = evenly(specs.length)
  return specs.map((s, i) => planet({ ...s, t: ts[i]! }))
}

/** ۲) مدرسه برنامه‌نویسی */
export function buildProgrammingSchoolStations(lang: string): SchoolPlanetStation[] {
  const specs = [
    planet({
      id: 'prog-launch',
      label: 'پایگاه کدنویسی',
      learn: 'اینجا منطق و ساخت پروژه یاد می‌گیری. ریاضی پایه کمک می‌کند، ولی تکرار نمی‌شود.',
      highlights: ['بدون تکرار ریاضی', 'ارجاع به مدرسه ریاضی'],
      category: 'programming',
      href: schoolHref(lang, 'programming'),
      kind: 'milestone',
      t: 0.05,
      emoji: '🚀',
    }),
    planet({
      id: 'block-coding',
      label: 'برنامه‌نویسی بلوکی',
      learn: 'منطق بدون تایپ: توالی، شرط و حلقه روی صحنه — اختیاری قبل از پایتون.',
      highlights: ['PY-00', 'اختیاری', 'بدون تایپ'],
      category: 'programming',
      href: `/${lang}/lessons/programming/python-00-blocks`,
      kind: 'specialty',
      t: 0.18,
      emoji: '🧩',
    }),
    planet({
      id: 'python-path',
      label: 'مسیر پایتون',
      learn: 'از print تا while — تصمیم، تکرار، و بازی حدس عدد.',
      highlights: ['PY-01…08', 'آماده'],
      category: 'programming',
      href: `/${lang}/curriculum/programming/python`,
      kind: 'specialty',
      t: 0.35,
      emoji: '🐍',
    }),
    planet({
      id: 'data-oop',
      label: 'داده و شیءگرایی',
      learn: 'لیست و دیکشنری + کلاس و شیء برای پروژه‌های واقعی‌تر.',
      highlights: ['متوسط', 'به‌زودی'],
      category: 'programming',
      href: schoolHref(lang, 'programming', 'data-structures'),
      locked: true,
      kind: 'specialty',
      t: 0.52,
      emoji: '📦',
    }),
    planet({
      id: 'prog-projects',
      label: 'پروژه و ابزارها',
      learn: 'بازی/ابزار کوچک، Git و در صورت علاقه مقدمه وب.',
      highlights: ['متوسط→پیشرفته', 'به‌زودی'],
      category: 'programming',
      href: schoolHref(lang, 'programming', 'mini-projects'),
      locked: true,
      kind: 'specialty',
      t: 0.72,
      emoji: '🎮',
    }),
    planet({
      id: 'prog-capstone',
      label: 'آمادگی برای AI/رباتیک',
      learn: 'بعد از این مسیر می‌توانی وارد مدرسه هوش مصنوعی یا رباتیک شوی.',
      highlights: ['خروجی مسیر', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'programming'),
      locked: true,
      kind: 'milestone',
      t: 0.9,
      emoji: '🛰️',
    }),
  ]
  return specs
}

/** ۳) مدرسه هوش مصنوعی — پیش‌نیازها لینک به ریاضی/برنامه */
export function buildAiSchoolStations(lang: string): SchoolPlanetStation[] {
  return [
    planet({
      id: 'ai-launch',
      label: 'پایگاه هوش مصنوعی',
      learn: 'اینجا مدل می‌سازی؛ ریاضی و پایتون را دوباره درس نمی‌دهیم — فقط ارجاع می‌دهیم.',
      highlights: ['بدون تکرار محتوا', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'ai'),
      kind: 'milestone',
      t: 0.05,
      emoji: '🚀',
    }),
    planet({
      id: 'ai-prereq-math',
      label: 'پیش‌نیاز ریاضی',
      learn: 'کسر → درصد → جبر → آمار پیشرفته → جبر خطی را در مدرسه ریاضیات بگذران.',
      highlights: ['ارجاع به ریاضی', 'الزامی'],
      category: 'math',
      href: mathHref(lang),
      kind: 'prerequisite',
      t: 0.2,
      emoji: '📐',
      prerequisites: [
        { label: 'کسرها', href: mathHref(lang, 'fractions') },
        { label: 'جبر پایه', href: mathHref(lang, 'algebra') },
        { label: 'آمار پیشرفته', href: mathHref(lang, 'stats-advanced') },
        { label: 'جبر خطی', href: mathHref(lang, 'linear-algebra') },
      ],
    }),
    planet({
      id: 'ai-prereq-prog',
      label: 'پیش‌نیاز برنامه‌نویسی',
      learn: 'پایتون، ساختمان داده و شیءگرایی مقدماتی را از مدرسه برنامه‌نویسی بگیر.',
      highlights: ['ارجاع به برنامه‌نویسی', 'الزامی'],
      category: 'programming',
      href: schoolHref(lang, 'programming'),
      kind: 'prerequisite',
      t: 0.35,
      emoji: '🐍',
      prerequisites: [
        { label: 'مقدمه پایتون', href: schoolHref(lang, 'programming', 'python') },
        { label: 'ساختمان داده', href: schoolHref(lang, 'programming', 'data-structures') },
        { label: 'شیءگرایی', href: schoolHref(lang, 'programming', 'oop-intro') },
      ],
    }),
    planet({
      id: 'ai-data',
      label: 'داده و مصورسازی',
      learn: 'داده، NumPy، Pandas و Matplotlib — دروس اختصاصی AI.',
      highlights: ['اختصاصی AI', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'ai', 'data-concept'),
      locked: true,
      kind: 'specialty',
      t: 0.52,
      emoji: '📊',
    }),
    planet({
      id: 'ai-ml',
      label: 'یادگیری ماشین',
      learn: 'رگرسیون، طبقه‌بندی، train/test و دقت مدل.',
      highlights: ['اختصاصی AI', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'ai', 'ml-intro'),
      locked: true,
      kind: 'specialty',
      t: 0.7,
      emoji: '🤖',
    }),
    planet({
      id: 'ai-capstone',
      label: 'پروژه و اخلاق AI',
      learn: 'شبکه عصبی شهودی، بینایی/NLP ساده، اخلاق و پروژه نهایی.',
      highlights: ['اختصاصی AI', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'ai', 'ai-capstone'),
      locked: true,
      kind: 'specialty',
      t: 0.9,
      emoji: '🛰️',
    }),
  ]
}

/** ۴) مدرسه رباتیک */
export function buildRoboticsSchoolStations(lang: string): SchoolPlanetStation[] {
  return [
    planet({
      id: 'robo-launch',
      label: 'پایگاه رباتیک',
      learn: 'ربات می‌سازی؛ هندسه و مثلثات را از مدرسه ریاضی قرض می‌گیری.',
      highlights: ['بدون تکرار ریاضی', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'robotics'),
      kind: 'milestone',
      t: 0.05,
      emoji: '🚀',
    }),
    planet({
      id: 'robo-prereq-math',
      label: 'پیش‌نیاز ریاضی',
      learn: 'هندسه پایه، جبر پایه و مثلثات پایه را در مدرسه ریاضیات بگذران.',
      highlights: ['ارجاع به ریاضی'],
      category: 'math',
      href: mathHref(lang, 'geometry'),
      kind: 'prerequisite',
      t: 0.22,
      emoji: '📐',
      prerequisites: [
        { label: 'هندسه پایه', href: mathHref(lang, 'geometry') },
        { label: 'جبر پایه', href: mathHref(lang, 'algebra') },
        { label: 'مثلثات پایه', href: mathHref(lang, 'trigonometry') },
      ],
    }),
    planet({
      id: 'robo-prereq-prog',
      label: 'پیش‌نیاز برنامه',
      learn: 'برنامه‌نویسی بلوکی و مقدمه پایتون (یا C ساده) از مدرسه برنامه‌نویسی.',
      highlights: ['ارجاع به برنامه‌نویسی'],
      category: 'programming',
      href: schoolHref(lang, 'programming'),
      kind: 'prerequisite',
      t: 0.38,
      emoji: '🧩',
      prerequisites: [
        { label: 'برنامه‌نویسی بلوکی', href: `/${lang}/lessons/programming/python-00-blocks` },
        { label: 'مقدمه پایتون', href: schoolHref(lang, 'programming', 'python') },
      ],
    }),
    planet({
      id: 'robo-hardware',
      label: 'مدار و سخت‌افزار',
      learn: 'مدار پایه، میکروکنترلر، حسگر و محرک.',
      highlights: ['اختصاصی رباتیک', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'robotics', 'circuits'),
      locked: true,
      kind: 'specialty',
      t: 0.55,
      emoji: '⚡',
    }),
    planet({
      id: 'robo-projects',
      label: 'پروژه‌های ربات',
      learn: 'دنبال‌کننده خط، اجتناب از مانع و مسیریابی ساده.',
      highlights: ['اختصاصی رباتیک', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'robotics', 'line-follower'),
      locked: true,
      kind: 'specialty',
      t: 0.72,
      emoji: '🤖',
    }),
    planet({
      id: 'robo-ai',
      label: 'ربات + AI',
      learn: 'تلفیق بینایی ماشین — نیازمند گذراندن پایه‌های مدرسه هوش مصنوعی.',
      highlights: ['پیشرفته', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'robotics', 'ai-robotics'),
      locked: true,
      kind: 'specialty',
      t: 0.9,
      emoji: '👁️',
      prerequisites: [{ label: 'مدرسه هوش مصنوعی', href: schoolHref(lang, 'ai') }],
    }),
  ]
}

/** ۵) مدرسه طراحی — مستقل‌تر؛ هندسه به‌عنوان ارجاع */
export function buildDesignSchoolStations(lang: string): SchoolPlanetStation[] {
  return [
    planet({
      id: 'design-launch',
      label: 'پایگاه طراحی',
      learn: 'طراحی بصری و UX/UI — کمترین وابستگی فنی؛ هندسه پایه کمک می‌کند.',
      highlights: ['مسیر موازی ممکن', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'design'),
      kind: 'milestone',
      t: 0.05,
      emoji: '🚀',
    }),
    planet({
      id: 'design-prereq-math',
      label: 'پیش‌نیاز هندسه',
      learn: 'نسبت، تقارن و مقیاس را از هندسه پایه در مدرسه ریاضیات مرور کن.',
      highlights: ['ارجاع به ریاضی', 'سبک'],
      category: 'math',
      href: mathHref(lang, 'geometry'),
      kind: 'prerequisite',
      t: 0.2,
      emoji: '📐',
      prerequisites: [{ label: 'هندسه پایه', href: mathHref(lang, 'geometry') }],
    }),
    planet({
      id: 'visual-foundations',
      label: 'مبانی بصری',
      learn: 'نقطه، خط، شکل، رنگ، تایپوگرافی و ترکیب‌بندی.',
      highlights: ['اختصاصی طراحی', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'design', 'visual-basics'),
      locked: true,
      kind: 'specialty',
      t: 0.38,
      emoji: '🎨',
      planetFrom: '#F9A8D4',
      planetTo: '#BE185D',
      accent: '#FCE7F3',
    }),
    planet({
      id: 'tools-ux',
      label: 'ابزار و UX',
      learn: 'Figma، کاراکتر/آیکون، شناخت کاربر و UI ساده.',
      highlights: ['اختصاصی طراحی', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'design', 'figma'),
      locked: true,
      kind: 'specialty',
      t: 0.58,
      emoji: '🖌️',
      planetFrom: '#C4B5FD',
      planetTo: '#6D28D9',
      accent: '#EDE9FE',
    }),
    planet({
      id: 'prototype-a11y',
      label: 'پروتوتایپ و دسترس‌پذیری',
      learn: 'پروتوتایپ بدون کد و طراحی برای کودکان با a11y پایه.',
      highlights: ['اختصاصی طراحی', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'design', 'prototype'),
      locked: true,
      kind: 'specialty',
      t: 0.75,
      emoji: '♿',
    }),
    planet({
      id: 'design-capstone',
      label: 'پروژه نهایی طراحی',
      learn: 'از ایده تا پروتوتایپ کامل یک اپ یا بازی فرضی.',
      highlights: ['اختصاصی طراحی', 'به‌زودی'],
      category: 'combined',
      href: schoolHref(lang, 'design', 'design-capstone'),
      locked: true,
      kind: 'specialty',
      t: 0.92,
      emoji: '🎯',
    }),
  ]
}

const SCHOOL_JOURNEYS: Record<string, SchoolJourney> = {
  math: {
    subjectId: 'math',
    schoolTitle: 'مدرسه ریاضیات',
    journeyTitle: 'ستون فقرات مایلند',
    journeySubtitle:
      'اولویت فعلی MVP: کسرها و هندسه. بقیه ایستگاه‌ها نقشه راه هستند و به‌تدریج باز می‌شوند.',
    role: 'backbone',
    buildStations: buildMathSchoolStations,
  },
  programming: {
    subjectId: 'programming',
    schoolTitle: 'مدرسه برنامه‌نویسی',
    journeyTitle: 'کهکشان کدنویسی',
    journeySubtitle: 'منطق و پایتون تا پروژه — ریاضی را تکرار نمی‌کنیم؛ در صورت نیاز ارجاع می‌دهیم.',
    role: 'builder',
    buildStations: buildProgrammingSchoolStations,
  },
  ai: {
    subjectId: 'ai',
    schoolTitle: 'مدرسه هوش مصنوعی',
    journeyTitle: 'کهکشان هوش مصنوعی',
    journeySubtitle:
      'فعلاً در roadmap به‌صورت به‌زودی. پیش‌نیازها از ریاضی و برنامه‌نویسی لینک می‌شوند.',
    role: 'applied',
    buildStations: buildAiSchoolStations,
  },
  robotics: {
    subjectId: 'robotics',
    schoolTitle: 'مدرسه رباتیک',
    journeyTitle: 'کهکشان رباتیک',
    journeySubtitle: 'فعلاً به‌زودی. هندسه/مثلثات و برنامه‌نویسی پایه را از مدارس دیگر می‌گیری.',
    role: 'applied',
    buildStations: buildRoboticsSchoolStations,
  },
  design: {
    subjectId: 'design',
    schoolTitle: 'مدرسه طراحی',
    journeyTitle: 'کهکشان طراحی',
    journeySubtitle:
      'طراحی بصری و UX — مسیر موازی ممکن. فقط هندسه پایه را از مدرسه ریاضی ارجاع می‌دهیم.',
    role: 'applied',
    buildStations: buildDesignSchoolStations,
  },
}

export function getSchoolJourney(subjectId: string): SchoolJourney | null {
  return SCHOOL_JOURNEYS[subjectId] ?? null
}

export function listSchoolJourneys(): SchoolJourney[] {
  return Object.values(SCHOOL_JOURNEYS)
}

export function buildStationsForSchool(subjectId: string, lang: string): SchoolPlanetStation[] {
  const school = getSchoolJourney(subjectId)
  if (school) return school.buildStations(lang)
  return buildMathSchoolStations(lang)
}
