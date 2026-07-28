import { Lang } from "./i18n";

export type LocalizedArticle = {
  title: string;
  excerpt: string;
  content: string[];
};

export type Article = {
  slug: string;
  sourceFile: string;
  category: "education";
  readingMinutes: number;
  translations: Record<Lang, LocalizedArticle>;
};

export const articles: Article[] = [
  {
    slug: "why-conditioning-matters-in-tennis",
    sourceFile: "/articles/چرا آمادگی جسمانی در تنیس اهمیت دارد.docx",
    category: "education",
    readingMinutes: 8,
    translations: {
      fa: {
        title: "چرا آمادگی جسمانی در تنیس اهمیت دارد",
        excerpt: "تنیس فقط تکنیک نیست؛ کیفیت بازی در سرعت، چابکی، استقامت و ریکاوری تعیین می‌شود.",
        content: [
          "تنیس ترکیبی از رالی‌های کوتاه و انفجاری و مسابقه‌های طولانی است. به همین دلیل بازیکن باید همزمان سرعت، قدرت و استقامت کافی داشته باشد.",
          "در عملکرد واقعی، هر بازیکن نیاز دارد سریع شتاب بگیرد، ناگهانی توقف کند، تغییر جهت دهد و پس از هر پوینت در زمان کم ریکاوری شود.",
          "سه سیستم انرژی اصلی در تنیس شامل ATP-PC برای حرکات انفجاری، بی‌هوازی برای رالی‌های شدید و هوازی برای ریکاوری بین امتیازها است.",
          "تمرین موثر تنیس باید اختصاصی باشد: اسپریت‌های کوتاه، نردبان چابکی، کار با مخروط، تمرینات قدرتی پایین‌تنه و تمرین‌های core.",
          "پیام اصلی: بدون آمادگی جسمانی اختصاصی، تکنیک خوب در ست‌های آخر افت می‌کند. برنامه تمرینی باید تدریجی، قابل ریکاوری و سازگار با نیاز واقعی مسابقه باشد.",
        ],
      },
      en: {
        title: "Why Tennis Conditioning Matters",
        excerpt: "Great strokes are not enough; match outcomes are shaped by speed, agility, endurance, and recovery.",
        content: [
          "Tennis combines short explosive rallies with long match durations, so players need both high-intensity output and lasting stamina.",
          "On-court success depends on acceleration, deceleration, rapid direction changes, balance under pressure, and fast between-point recovery.",
          "The ATP-PC, anaerobic, and aerobic energy systems all contribute to tennis performance at different moments in a match.",
          "Effective conditioning must be tennis-specific: short sprints, agility ladders, cone patterns, lower-body strength, and core stability.",
          "Bottom line: technique peaks only when conditioning supports it. Smart progression and recovery are essential to sustain quality late in matches.",
        ],
      },
      ar: {
        title: "لماذا الإعداد البدني مهم في التنس",
        excerpt: "المهارة وحدها لا تكفي؛ جودة الأداء تعتمد على السرعة والرشاقة والتحمل وسرعة الاستشفاء.",
        content: [
          "تجمع التنس بين تبادلات قصيرة عالية الشدة ومباريات طويلة، لذلك يحتاج اللاعب إلى قوة انفجارية وقدرة تحمل مستمرة.",
          "الأداء الفعال يتطلب انطلاقاً سريعاً، توقفاً وتحولاً في الاتجاه، توازناً جيداً، واستشفاءً سريعاً بين النقاط.",
          "تعتمد التنس على ثلاثة أنظمة طاقة: الفوسفاجيني للحركات الانفجارية، واللاهوائي للتبادلات القوية، والهوائي للاستشفاء.",
          "التحضير البدني يجب أن يكون متخصصاً: سباقات قصيرة، تمارين رشاقة، عمل بالمخاريط، تقوية الساقين، وتمارين الجذع.",
          "الخلاصة: لا يمكن الحفاظ على جودة الضربات في نهاية المباراة بدون إعداد بدني موجه للتنس.",
        ],
      },
    },
  },
  {
    slug: "international-tennis-federation-overview",
    sourceFile: "/articles/International Tennis Federation.docx",
    category: "education",
    readingMinutes: 6,
    translations: {
      fa: {
        title: "آشنایی با فدراسیون جهانی تنیس (ITF)",
        excerpt: "ITF نهاد اصلی قانون‌گذاری و توسعه جهانی تنیس است و مسابقات تیمی بزرگ دنیا را مدیریت می‌کند.",
        content: [
          "فدراسیون جهانی تنیس (ITF) مرجع بین‌المللی این ورزش است و قوانین رسمی تنیس را برای همه سطوح تعیین می‌کند.",
          "این نهاد از طریق همکاری با فدراسیون‌های ملی، توسعه تنیس پایه، تنیس جوانان و تنیس ویلچر را پیش می‌برد.",
          "ITF برگزارکننده و ناظر رویدادهایی مانند Davis Cup و Billie Jean King Cup است و در ساختار رقابت‌های جهانی نقش کلیدی دارد.",
          "از دیگر وظایف ITF می‌توان به استاندارد تجهیزات، ضد دوپینگ و حفظ سلامت رقابت‌ها اشاره کرد.",
        ],
      },
      en: {
        title: "International Tennis Federation (ITF) Overview",
        excerpt: "The ITF governs global tennis rules, development pathways, and key international team competitions.",
        content: [
          "The International Tennis Federation is the world governing body for tennis and maintains the official Rules of Tennis.",
          "It coordinates with national associations to grow the sport across juniors, wheelchair tennis, and emerging regions.",
          "The ITF oversees major team competitions such as the Davis Cup and Billie Jean King Cup and supports Olympic tennis structure.",
          "It also contributes to integrity, anti-doping enforcement, and player-development pathways beneath top professional tours.",
        ],
      },
      ar: {
        title: "نظرة عامة على الاتحاد الدولي للتنس (ITF)",
        excerpt: "الاتحاد الدولي للتنس هو الجهة العالمية المسؤولة عن القوانين والتطوير والمسابقات الدولية الكبرى.",
        content: [
          "يُعد ITF الهيئة الدولية الحاكمة للتنس، ويحدد القواعد الرسمية المعتمدة في جميع مستويات اللعبة.",
          "يعمل مع الاتحادات الوطنية لتطوير التنس للناشئين وتنس الكراسي المتحركة وتوسيع قاعدة المشاركة عالمياً.",
          "يشرف على بطولات فرق مهمة مثل كأس ديفيز وكأس بيلي جين كينغ، وله دور أساسي في المنظومة الدولية.",
          "كما يتابع نزاهة اللعبة، ومكافحة المنشطات، وتنظيم مسارات التطور للاعبين.",
        ],
      },
    },
  },
  {
    slug: "tennis-footwork-drills-guide",
    sourceFile: "/articles/tennis footwork drills.docx",
    category: "education",
    readingMinutes: 10,
    translations: {
      fa: {
        title: "بهترین تمرین‌های Footwork در تنیس",
        excerpt: "از ladder تا split-step و cone drills؛ این راهنما بهبود جابه‌جایی و پوشش زمین را هدف می‌گیرد.",
        content: [
          "فوت‌ورک پایه بردن تکنیک به سطح مسابقه است. بازیکنی که خوب حرکت می‌کند، زودتر در موقعیت ضربه قرار می‌گیرد.",
          "تمرین‌های کاربردی شامل نردبان چابکی، split-step، حرکت بین مخروط‌ها، shadow movement و hexagon drill هستند.",
          "تمرکز اصلی باید روی کیفیت اجرا باشد: زانو خم، مرکز ثقل پایین، حرکت روی پنجه و برگشت سریع به حالت آماده.",
          "برای پیشرفت پایدار، تمرین‌های فوت‌ورک را 2 تا 3 بار در هفته با زمان کوتاه ولی منظم انجام دهید.",
          "ترکیب این تمرین‌ها با ریکاوری مناسب و برنامه بدنسازی هدفمند، سرعت تصمیم و پوشش زمین را متحول می‌کند.",
        ],
      },
      en: {
        title: "Tennis Footwork Drills: Practical Guide",
        excerpt: "From ladders to split-step and cone patterns, this guide targets movement efficiency and court coverage.",
        content: [
          "Footwork is the hidden engine of performance. Better movement creates earlier setup and cleaner shot execution.",
          "High-value drills include agility ladders, split-step timing, cone weaving, shadow movement, and hexagon patterns.",
          "Execution quality matters: low center of gravity, active feet, strong recovery steps, and controlled direction changes.",
          "Train footwork 2-3 times weekly in focused blocks to build repeatable movement habits without excessive fatigue.",
          "When paired with smart recovery and strength work, these drills improve consistency under match pressure.",
        ],
      },
      ar: {
        title: "دليل تمارين حركة القدمين في التنس",
        excerpt: "من السلم الحركي إلى split-step وتمارين المخاريط، هذا الدليل يطور التمركز وتغطية الملعب.",
        content: [
          "حركة القدمين هي الأساس الخفي للأداء؛ التمركز الجيد يمنحك وقتاً أفضل وإعداداً أدق للضربة.",
          "أهم التمارين تشمل: سلم الرشاقة، توقيت split-step، التنقل بين المخاريط، الحركة الظلية، وتمرين السداسي.",
          "الجودة أهم من السرعة: وضعية منخفضة، حركة على مقدمة القدم، واستعادة سريعة لوضعية الاستعداد.",
          "يُنصح بتنفيذ تمارين القدمين 2 إلى 3 مرات أسبوعياً بجلسات قصيرة ومنتظمة.",
          "مع الاستشفاء الجيد وتقوية العضلات المناسبة، تتحسن السرعة والثبات خلال النقاط الطويلة.",
        ],
      },
    },
  },
  {
    slug: "championship-point-conditioning",
    sourceFile:
      "/articles/The difference between a promising rally and a championship point often comes down to conditioning.docx",
    category: "education",
    readingMinutes: 9,
    translations: {
      fa: {
        title: "مسیر رالی خوب تا امتیاز قهرمانی: آمادگی جسمانی",
        excerpt: "تفاوت بازیکن پایدار و بازیکن افت‌کرده در ست‌های پایانی، در کیفیت conditioning مشخص می‌شود.",
        content: [
          "تنیس به توانایی تولید تلاش‌های شدید با ریکاوری کوتاه نیاز دارد؛ بنابراین تمرین عمومی کافی نیست.",
          "drillهای اختصاصی مثل spider drill، suicide sprint و intervalهای مبتنی بر نسبت کار/استراحت مسابقه، عملکرد را مسابقه‌ای می‌کنند.",
          "تمرینات agility و قدرت انفجاری باید کنار تمرینات هوازی کنترل‌شده قرار بگیرند تا هم سرعت و هم دوام ساخته شود.",
          "برنامه‌ریزی هفتگی هوشمند ضروری است: روزهای شدید، روزهای تکنیکی، و روزهای ریکاوری باید متعادل باشند.",
          "نتیجه: زمانی که خستگی بالا می‌رود، این conditioning است که اجازه می‌دهد تکنیک همچنان دقیق و مؤثر بماند.",
        ],
      },
      en: {
        title: "From Good Rally to Championship Point: Conditioning",
        excerpt: "Late-match quality depends on conditioning that supports repeated high-intensity efforts under pressure.",
        content: [
          "Tennis rewards athletes who can repeat intense bursts with short recovery rather than sustain one steady pace.",
          "Sport-specific drills like spider runs, suicide sprints, and tennis-timed intervals create match-relevant fitness.",
          "Agility, explosive power, and aerobic support should be programmed together for complete physical readiness.",
          "Weekly structure matters: high days, technical days, and recovery days must be balanced to avoid burnout.",
          "In decisive moments, conditioning protects stroke quality and decision-making when fatigue is highest.",
        ],
      },
      ar: {
        title: "من تبادل واعد إلى نقطة بطولة: الإعداد البدني",
        excerpt: "جودة الأداء في اللحظات الحاسمة تعتمد على قدرة بدنية تتحمل الجهد المتكرر تحت الضغط.",
        content: [
          "تتطلب التنس تكرار جهود عالية الشدة مع فترات استشفاء قصيرة، وليس مجرد لياقة عامة تقليدية.",
          "تمارين مخصصة مثل spider drill وsuicide sprint وفترات عمل/راحة مشابهة للمباراة تحسن الجاهزية الفعلية.",
          "يجب دمج الرشاقة والقوة الانفجارية مع قاعدة هوائية مناسبة لتحقيق أداء متوازن طوال المباراة.",
          "الجدولة الأسبوعية الذكية ضرورية: أيام شدة، أيام تقنية، وأيام استشفاء لتجنب الإجهاد الزائد.",
          "في النقاط الحاسمة، الإعداد البدني الجيد يحافظ على دقة الضربات وجودة القرار رغم التعب.",
        ],
      },
    },
  },
];

export function getArticlesByLang(lang: Lang) {
  return articles.map((article) => ({
    ...article,
    localized: article.translations[lang],
  }));
}

export function getArticleBySlug(lang: Lang, slug: string) {
  const article = articles.find((item) => item.slug === slug);
  if (!article) return null;
  return {
    ...article,
    localized: article.translations[lang],
  };
}
