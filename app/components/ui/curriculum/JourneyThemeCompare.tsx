'use client'

import { useState, type ReactNode } from 'react'
import { Moon, Sun } from 'lucide-react'
import { ScrollRoadmap } from './ScrollRoadmap'
import { ScrollRoadmapLight } from './ScrollRoadmapLight'

export type JourneyTheme = 'light' | 'dark'

export interface JourneyThemeCompareProps {
  lang: string
  defaultTheme?: JourneyTheme
  className?: string
  /** هدر صفحه (عنوان دروس و …) */
  pageHeader?: ReactNode
  /** بخش موضوعات و محتوای زیر مسیر */
  children?: ReactNode
}

/**
 * سوئیچ مقایسه + پوستهٔ تمام‌عرض تم (آسمان/فضا روی کل صفحه)
 */
export function JourneyThemeCompare({
  lang,
  defaultTheme = 'light',
  className = '',
  pageHeader,
  children,
}: JourneyThemeCompareProps) {
  const [theme, setTheme] = useState<JourneyTheme>(defaultTheme)
  const isLight = theme === 'light'

  return (
    <div
      className={`relative w-full ${className}`}
      data-journey-compare={theme}
    >
      <div className="sticky top-[4.5rem] z-50 mx-auto flex max-w-lg justify-center px-4 pt-3 md:top-20">
        <div
          className={[
            'flex w-full items-center gap-1 rounded-2xl border p-1 shadow-lg backdrop-blur-md',
            isLight
              ? 'border-sky-200/80 bg-white/90'
              : 'border-white/15 bg-slate-950/80',
          ].join(' ')}
          role="group"
          aria-label="انتخاب تم مسیر یادگیری برای مقایسه"
          dir="rtl"
        >
          <button
            type="button"
            onClick={() => setTheme('light')}
            aria-pressed={isLight}
            className={[
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-extrabold transition md:text-sm',
              isLight
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-white/10',
            ].join(' ')}
          >
            <Sun className="h-4 w-4" aria-hidden />
            روشن کودکانه
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            aria-pressed={!isLight}
            className={[
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-extrabold transition md:text-sm',
              !isLight
                ? 'bg-slate-100 text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100',
            ].join(' ')}
          >
            <Moon className="h-4 w-4" aria-hidden />
            تیره فضایی
          </button>
        </div>
      </div>

      <p
        className={[
          'relative z-40 mb-2 px-4 pt-3 text-center text-[11px] font-semibold md:text-xs',
          isLight ? 'text-sky-900/70' : 'text-slate-400',
        ].join(' ')}
        dir="rtl"
      >
        تم روی کل صفحه اعمال می‌شود — برای مقایسه بین روشن و تیره جابه‌جا شو.
      </p>

      {isLight ? (
        <ScrollRoadmapLight lang={lang} pageHeader={pageHeader} fullBleed>
          {children}
        </ScrollRoadmapLight>
      ) : (
        <div className="dark-journey">
          <ScrollRoadmap lang={lang} pageHeader={pageHeader} fullBleed>
            {children}
          </ScrollRoadmap>
        </div>
      )}
    </div>
  )
}
