/** فهرست دوره پایتون کودکان — دو رده A (۹–۱۱) و B (۱۲–۱۴) */

export type PythonBand = 'A' | 'B'

export interface PythonLessonItem {
  code: string
  /** شناسهٔ آینده در محصول */
  id: string
  title: string
  goal: string
  metaphor: string
  guided: string
  challengeA: string
  challengeB: string
  duration: string
  status: 'planned' | 'writing' | 'ready'
}

export interface PythonSection {
  id: string
  title: string
  order: number
  outcome?: string
  optional?: boolean
  lessons: PythonLessonItem[]
}

export interface PythonSyllabus {
  id: string
  title: string
  subtitle: string
  description: string
  bands: {
    A: { label: string; ages: string; vibe: string }
    B: { label: string; ages: string; vibe: string }
  }
  principles: { title: string; body: string }[]
  sessionTemplate: string[]
  sections: PythonSection[]
}

export const PYTHON_KIDS_SYLLABUS: PythonSyllabus = {
  id: 'python-kids',
  title: 'دوره پایتون کودکان',
  subtitle: 'یک ستون درس · دو عمق سنی',
  description:
    'از مفاهیم ملموس و بازی‌گونه شروع می‌کنیم و کم‌کم به شرط، حلقه، داده، تابع و پروژهٔ گرافیکی می‌رسیم. هر درس برای ردهٔ ۹–۱۱ و ۱۲–۱۴ نسخهٔ خودش را دارد.',
  bands: {
    A: {
      label: 'رده A',
      ages: '۹–۱۱ سال',
      vibe: 'داستان، جعبه، ربات کوچک · کد کوتاه‌تر · قالب آماده‌تر',
    },
    B: {
      label: 'رده B',
      ages: '۱۲–۱۴ سال',
      vibe: 'مهندس کوچک · همان مفهوم + یک لایه · آزادی بیشتر در پروژه',
    },
  },
  principles: [
    {
      title: 'از ملموس به انتزاعی',
      body: 'چاپ و بازی → شرط و حلقه → داده → تابع → پروژه گرافیکی',
    },
    {
      title: 'یک ستون، دو عمق',
      body: 'شماره درس یکی است؛ چالش آزاد و جزئیات در A و B فرق می‌کند',
    },
    {
      title: 'بدون تکرار ریاضی',
      body: 'عدد فقط ابزار است؛ در صورت نیاز به مدرسه‌ی ریاضیات ارجاع می‌دهیم',
    },
    {
      title: 'محیط وب‌محور',
      body: 'Trinket یا Replit؛ رسم با turtle؛ pygame فقط مسیر اختیاری رده B',
    },
  ],
  sessionTemplate: [
    'هدف درس',
    'داستان / استعاره',
    'دمو زنده',
    'تمرین',
    'چالش آزاد A یا B',
    'جمع‌بندی بازیگوش',
  ],
  sections: [
    {
      id: 'prep',
      title: 'پیش‌نیاز · ایستگاه بلوکی',
      order: 0,
      optional: true,
      outcome: 'منطق شرط و حلقه را قبل از تایپ، با بلوک لمس کرده باشی',
      lessons: [
        {
          code: 'PY-00',
          id: 'python-00-blocks',
          title: 'برنامه‌نویسی بلوکی: منطق بدون تایپ',
          goal: 'مأموریت جلو→بچرخ→آماده‌ام را بدون خرابی کامل کند',
          metaphor: 'مینی مجریه، تو کارگردانی',
          guided: 'تمرین مأموریت + تکرار تمیز روی صحنه',
          challengeA: 'رقص سلام (با تکرار)',
          challengeB: 'نگهبان لبه',
          duration: '۴۵′',
          status: 'ready',
        },
      ],
    },
    {
      id: 'basics',
      title: 'بخش اول · آشنایی و پایه‌ها',
      order: 1,
      outcome: 'یک مینی‌برنامه تعاملی کوتاه (خوش‌آمد + یک محاسبه)',
      lessons: [
        {
          code: 'PY-01',
          id: 'python-01-intro',
          title: 'پایتون چیست و اولین دستور',
          goal: 'با print دقیق، مینی را وادار کند جمله بگوید — بدون قفل',
          metaphor: 'مینی الان باید دقیق‌تر باهاش حرف بزنی',
          guided: 'مأموریت: یک جمله بدون قفل مینی',
          challengeA: 'معرفی مینی (۳ جمله)',
          challengeB: 'معرفی + یادداشت # مخفی',
          duration: '۴۵′',
          status: 'ready',
        },
        {
          code: 'PY-02',
          id: 'python-02-print-strings',
          title: 'دستور print و رشته‌ها',
          goal: 'کارت چندخطی بنویسد؛ نگهبان‌های جفت گیومه را بفهمد',
          metaphor: 'مینی کارت تبریک می‌خواند — نگهبان‌ها باید جفت باشند',
          guided: 'کارت تبریک ۳–۵ خطی بدون قفل',
          challengeA: 'کارت برای شخصیت خیالی',
          challengeB: 'کارت + راز print("۵") در برابر print(5)',
          duration: '۴۵′',
          status: 'ready',
        },
        {
          code: 'PY-03',
          id: 'python-03-variables',
          title: 'متغیرها',
          goal: 'مقدار را در جعبهٔ اسم‌دار نگه دارد و عوض کند',
          metaphor: 'به‌جای تکرار دستی، یه‌بار بگذار تو جعبه',
          guided: 'name / age + عوض کردن age و چاپ دوباره',
          challengeA: 'معرفی با دو جعبه',
          challengeB: 'سه جعبه + عوض کردن شهر',
          duration: '۴۵′',
          status: 'ready',
        },
        {
          code: 'PY-04',
          id: 'python-04-numbers',
          title: 'اعداد و عملیات ریاضی',
          goal: 'چهار عمل اصلی را در کد به‌کار ببرد',
          metaphor: 'مینی حساب بلده — ولی فقط عدد واقعی، نه متن',
          guided: 'محاسبهٔ پول توجیبی با اعداد واقعی',
          challengeA: 'ماشین‌حساب دو عددی ثابت',
          challengeB: 'پرانتز، باقی‌مانده (%)، ترتیب عملیات',
          duration: '۴۵–۵۰′',
          status: 'ready',
        },
        {
          code: 'PY-05',
          id: 'python-05-input',
          title: 'ورودی گرفتن از کاربر (input)',
          goal: 'از کاربر بگیرد و پاسخ شخصی بدهد',
          metaphor: 'مینی سؤال می‌پرسه و صبر می‌کنه',
          guided: 'خوش‌آمد شخصی با input',
          challengeA: '۲ سؤال و پاسخ شخصی‌سازی‌شده',
          challengeB: '۳ سؤال + تبدیل عددی با int',
          duration: '۴۵–۵۰′',
          status: 'ready',
        },
      ],
    },
    {
      id: 'control',
      title: 'بخش دوم · تصمیم‌گیری و تکرار',
      order: 2,
      outcome: 'یک بازی متنی کوچک (حدس عدد یا آزمون)',
      lessons: [
        {
          code: 'PY-06',
          id: 'python-06-conditions',
          title: 'شرط‌ها (if / else)',
          goal: 'یک تصمیم دوتایی درست بنویسد',
          metaphor: 'اگه این شد اونو بکن — وگرنه اون یکی',
          guided: 'آزمون تک‌سؤالی: آفرین / دوباره تلاش کن',
          challengeA: 'آزمون بله/خیر خنده‌دار',
          challengeB: 'if / elif / else سه شاخه',
          duration: '۴۵–۵۰′',
          status: 'ready',
        },
        {
          code: 'PY-07',
          id: 'python-07-for-loop',
          title: 'حلقه‌ها (for)',
          goal: 'کاری را N بار تکرار کند',
          metaphor: 'به‌جای N بار نوشتن، یه‌بار بگو چندبار',
          guided: 'الگوی مثلثی ستاره با for و range',
          challengeA: 'ردیف ۵ ستاره با for',
          challengeB: 'مثلث با شمارهٔ خط',
          duration: '۵۰′',
          status: 'ready',
        },
        {
          code: 'PY-08',
          id: 'python-08-while-loop',
          title: 'حلقه‌ها (while)',
          goal: 'تا برقرار بودن شرط تکرار کند',
          metaphor: 'نمی‌دونه چندبار — فقط می‌دونه کِی وایسه',
          guided: 'بازی حدس عدد تا حدس درست',
          challengeA: 'حدس ۱ تا ۵ با while',
          challengeB: 'حدس + شمارش تلاش‌ها',
          duration: '۵۰′',
          status: 'ready',
        },
      ],
    },
    {
      id: 'data',
      title: 'بخش سوم · سازمان‌دهی داده',
      order: 3,
      outcome: 'کارت بازیکن / پروفایل دوست با لیست یا دیکشنری',
      lessons: [
        {
          code: 'PY-09',
          id: 'python-09-lists',
          title: 'لیست‌ها (Lists)',
          goal: 'چند مقدار را در یک مجموعه نگه دارد',
          metaphor: 'جعبهٔ مدادرنگی / لیست دوستان',
          guided: 'ساخت لیست، append، چاپ با حلقه',
          challengeA: 'لیست ۳–۵ آیتم و چاپ',
          challengeB: 'جست‌وجو با in + تغییر یک عضو',
          duration: '۵۰′',
          status: 'ready',
        },
        {
          code: 'PY-10',
          id: 'python-10-dicts',
          title: 'دیکشنری‌ها (Dictionaries)',
          goal: 'جفت کلید–مقدار بسازد و بخواند',
          metaphor: 'دفترچه تلفن / کارت بازیکن',
          guided: 'دیکشنری ساده و خواندن با کلید',
          challengeA: 'کارت شخصیت با ۳ فیلد',
          challengeB: 'چند دیکشنری در لیست یا آپدیت فیلد',
          duration: '۵۰′',
          status: 'ready',
        },
      ],
    },
    {
      id: 'build',
      title: 'بخش چهارم · ساختن با بلوک‌ها',
      order: 4,
      outcome: 'یک ابزار یا بازی متنی قابل توضیح به همکلاسی',
      lessons: [
        {
          code: 'PY-11',
          id: 'python-11-functions',
          title: 'توابع (Functions)',
          goal: 'یک دستور قابل‌استفادهٔ مجدد بسازد',
          metaphor: 'دکمهٔ جادویی / دستور سفارشی',
          guided: 'تابع بدون آرگومان و با آرگومان ساده',
          challengeA: 'تابع سلام با اسم',
          challengeB: 'return + دو تابع کمکی',
          duration: '۵۰′',
          status: 'ready',
        },
        {
          code: 'PY-12',
          id: 'python-12-mini-project',
          title: 'پروژه ترکیبی کوچک',
          goal: 'مفاهیم ۱ تا ۱۱ را در یک برنامه جمع کند',
          metaphor: 'کارگاه ساخت ابزار',
          guided: 'اسکلت ماشین‌حساب یا سنگ‌کاغذقیچی',
          challengeA: 'نسخهٔ ساده‌شده با منوی کوتاه',
          challengeB: 'نسخهٔ کامل‌تر + حلقهٔ بازی مجدد',
          duration: '۵۰–۶۰′',
          status: 'ready',
        },
      ],
    },
    {
      id: 'creative',
      title: 'بخش پنجم · پروژه خلاقانه نهایی',
      order: 5,
      outcome: 'پروژه شخصی + توضیح کوتاه «چطور کار می‌کند»',
      lessons: [
        {
          code: 'PY-13',
          id: 'python-13-turtle',
          title: 'رسم با turtle',
          goal: 'دستور حرکت را به شکل تبدیل کند',
          metaphor: 'لاک‌پشت نقاش',
          guided: 'مربع، دایره، تکرار شکل',
          challengeA: 'خانه یا ستاره ساده',
          challengeB: 'الگوی پیچیده‌تر یا تابع رسم شکل',
          duration: '۵۰–۶۰′',
          status: 'ready',
        },
        {
          code: 'PY-14',
          id: 'python-14-capstone',
          title: 'پروژه پایانی',
          goal: 'ایده را طراحی و بسازد',
          metaphor: 'نمایشگاه پروژه‌ها',
          guided: 'انتخاب موضوع + چک‌لیست ساخت',
          challengeA: 'پروژه از روی قالب',
          challengeB: 'پروژه آزادتر + تابع و ساختار داده',
          duration: '۶۰′',
          status: 'ready',
        },
      ],
    },
  ],
}

export function getPythonKidsSyllabus(): PythonSyllabus {
  return PYTHON_KIDS_SYLLABUS
}

export function countPythonLessons(syllabus: PythonSyllabus = PYTHON_KIDS_SYLLABUS): number {
  return syllabus.sections.reduce((n, s) => n + s.lessons.length, 0)
}

/**
 * ترتیب الزامیِ درس‌ها برای باز شدن پله‌پله — بخش‌های «اختیاری» (مثل پیش‌نیاز
 * بلوکی) از این زنجیره کنار گذاشته می‌شوند و همیشه باز می‌مانند؛ فقط بخش‌های
 * اصلی باید به ترتیب گذرانده شوند.
 */
export function getPythonLessonSequence(
  syllabus: PythonSyllabus = PYTHON_KIDS_SYLLABUS
): string[] {
  return syllabus.sections
    .filter((s) => !s.optional)
    .sort((a, b) => a.order - b.order)
    .flatMap((s) => s.lessons.map((l) => l.id))
}
