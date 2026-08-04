'use client'

import type { ReactNode } from 'react'
import { JourneyThemeCompare } from './JourneyThemeCompare'
import { getSchoolJourney, buildStationsForSchool } from './schoolJourneys'
import { ScrollRoadmapLight } from './ScrollRoadmapLight'
import { ScrollRoadmap } from './ScrollRoadmap'
import { useMemo, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export interface SchoolJourneyViewProps {
  lang: string
  subjectId: string
  pageHeader?: ReactNode
  children?: ReactNode
  defaultTheme?: 'light' | 'dark'
}

/**
 * مسیر یادگیری مخصوص یک مدرسه (ریاضی ستون فقرات، بقیه با ارجاع پیش‌نیاز)
 */
export function SchoolJourneyView({
  lang,
  subjectId,
  pageHeader,
  children,
  defaultTheme = 'light',
}: SchoolJourneyViewProps) {
  const school = getSchoolJourney(subjectId)
  const stations = useMemo(() => buildStationsForSchool(subjectId, lang), [subjectId, lang])
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme)
  const isLight = theme === 'light'

  const title = school?.journeyTitle ?? 'مسیر یادگیری'
  const subtitle =
    school?.journeySubtitle ?? 'ایستگاه‌های این مدرسه را با اسکرول طی کن'

  return (
    <div className="relative w-full" data-school-journey={subjectId}>
      <div className="sticky top-[4.5rem] z-50 mx-auto flex max-w-lg justify-center px-4 pt-3 md:top-20">
        <div
          className={[
            'flex w-full items-center gap-1 rounded-2xl border p-1 shadow-lg backdrop-blur-md',
            isLight ? 'border-sky-200/80 bg-white/90' : 'border-white/15 bg-slate-950/80',
          ].join(' ')}
          role="group"
          aria-label="تم مسیر مدرسه"
          dir="rtl"
        >
          <button
            type="button"
            onClick={() => setTheme('light')}
            aria-pressed={isLight}
            className={[
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-extrabold transition md:text-sm',
              isLight ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10',
            ].join(' ')}
          >
            <Sun className="h-4 w-4" aria-hidden />
            روشن
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            aria-pressed={!isLight}
            className={[
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-extrabold transition md:text-sm',
              !isLight ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-slate-100',
            ].join(' ')}
          >
            <Moon className="h-4 w-4" aria-hidden />
            تیره
          </button>
        </div>
      </div>

      {school ? (
        <p
          className={[
            'relative z-40 px-4 pt-3 text-center text-xs font-bold md:text-sm',
            isLight ? 'text-sky-900/80' : 'text-sky-200',
          ].join(' ')}
          dir="rtl"
        >
          {school.schoolTitle}
        </p>
      ) : null}

      {isLight ? (
        <ScrollRoadmapLight
          lang={lang}
          stations={stations}
          title={title}
          subtitle={subtitle}
          pageHeader={pageHeader}
          fullBleed
        >
          {children}
        </ScrollRoadmapLight>
      ) : (
        <div className="dark-journey">
          <ScrollRoadmap
            lang={lang}
            stations={stations}
            title={title}
            subtitle={subtitle}
            pageHeader={pageHeader}
            fullBleed
          >
            {children}
          </ScrollRoadmap>
        </div>
      )}
    </div>
  )
}

/** سازگاری: هاب کلی مدارس هنوز می‌تواند از JourneyThemeCompare استفاده کند */
export { JourneyThemeCompare }
