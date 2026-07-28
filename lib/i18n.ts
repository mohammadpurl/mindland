export const locales = ["en", "fa"] as const;
export type Locale = (typeof locales)[number];
export const defaultLang: Locale = "fa";

/** زبان‌های محتوا (شامل ar برای مقالات قدیمی) */
export type Lang = Locale | "ar";

const rtlLocales: ReadonlyArray<Locale> = ["fa"];

export function isRTL(locale: Locale): boolean {
  return (rtlLocales as ReadonlyArray<string>).includes(locale);
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** نرمال‌سازی lang از URL — اگر نامعتبر بود → defaultLang */
export function getLangOrDefault(raw: string): Locale {
  return isLocale(raw) ? raw : defaultLang;
}

export type Translation = {
  articles: {
    tag: string;
    title: string;
    sub: string;
    read: string;
    back: string;
  };
  science: {
    tag: string;
    title: string;
    sub: string;
    demands: {
      title: string;
      items: Array<{ l: string; v: number }>;
    };
    systems: {
      title: string;
      items: Array<{ code: string; t: string; time: string; d: string }>;
    };
    hiit: {
      title: string;
      workLabel: string;
      restLabel: string;
      items: Array<{ t: string; w: string; r: string; d: string }>;
    };
    movement: {
      title: string;
      items: string[];
    };
  };
};

const translations: Record<Locale, Translation> = {
  fa: {
    articles: {
      tag: "مقالات",
      title: "مقالات آموزشی",
      sub: "نکته‌ها و راهنماهای کوتاه برای یادگیری بهتر",
      read: "ادامه مطلب",
      back: "بازگشت به مقالات",
    },
    science: {
      tag: "علم یادگیری",
      title: "پشت صحنه یادگیری",
      sub: "اصول علمی که تجربهٔ یادگیری را قوی‌تر می‌کند",
      demands: {
        title: "نیازهای کلیدی",
        items: [
          { l: "تمرکز", v: 85 },
          { l: "تمرین", v: 78 },
          { l: "بازخورد", v: 90 },
          { l: "انگیزه", v: 82 },
          { l: "استراحت", v: 70 },
        ],
      },
      systems: {
        title: "سامانه‌های انرژی",
        items: [
          {
            code: "ATP",
            t: "انفجاری",
            time: "۰–۱۰ ثانیه",
            d: "برای پاسخ‌های سریع و تصمیم‌های کوتاه.",
          },
          {
            code: "ANA",
            t: "شدید",
            time: "۱۰–۹۰ ثانیه",
            d: "برای چالش‌های فشرده و حل مسئلهٔ متمرکز.",
          },
          {
            code: "AER",
            t: "پایدار",
            time: "بیش از ۹۰ ثانیه",
            d: "برای تداوم یادگیری در طول جلسه.",
          },
        ],
      },
      hiit: {
        title: "ریتم تمرین",
        workLabel: "کار",
        restLabel: "استراحت",
        items: [
          { t: "اسپرینت کوتاه", w: "۳۰ث", r: "۳۰ث", d: "چالش سریع + بازخورد فوری" },
          { t: "پروژه کوتاه", w: "۵د", r: "۱د", d: "ساخت و اصلاح در چرخه‌های کوتاه" },
          { t: "مرور فعال", w: "۲د", r: "۱د", d: "تثبیت مفاهیم با تکرار هدفمند" },
        ],
      },
      movement: {
        title: "الگوهای حرکت یادگیری",
        items: ["مشاهده", "تمرین", "اشتباه مفید", "اصلاح", "تسلط", "انتقال"],
      },
    },
  },
  en: {
    articles: {
      tag: "Articles",
      title: "Learning articles",
      sub: "Short guides and tips to learn better",
      read: "Read more",
      back: "Back to articles",
    },
    science: {
      tag: "Learning science",
      title: "Behind the learning",
      sub: "Scientific principles that make practice stick",
      demands: {
        title: "Key demands",
        items: [
          { l: "Focus", v: 85 },
          { l: "Practice", v: 78 },
          { l: "Feedback", v: 90 },
          { l: "Motivation", v: 82 },
          { l: "Rest", v: 70 },
        ],
      },
      systems: {
        title: "Energy systems",
        items: [
          {
            code: "ATP",
            t: "Explosive",
            time: "0–10s",
            d: "For quick responses and short decisions.",
          },
          {
            code: "ANA",
            t: "Intense",
            time: "10–90s",
            d: "For focused problem-solving bursts.",
          },
          {
            code: "AER",
            t: "Sustain",
            time: "90s+",
            d: "For lasting attention across a session.",
          },
        ],
      },
      hiit: {
        title: "Practice rhythm",
        workLabel: "Work",
        restLabel: "Rest",
        items: [
          { t: "Sprint", w: "30s", r: "30s", d: "Fast challenge + instant feedback" },
          { t: "Mini project", w: "5m", r: "1m", d: "Build and revise in short loops" },
          { t: "Active recall", w: "2m", r: "1m", d: "Lock concepts with deliberate review" },
        ],
      },
      movement: {
        title: "Learning movement patterns",
        items: ["Observe", "Practice", "Useful mistake", "Fix", "Master", "Transfer"],
      },
    },
  },
};

export function getTranslations(lang: Locale | string): Translation {
  const locale = getLangOrDefault(String(lang));
  return translations[locale];
}
