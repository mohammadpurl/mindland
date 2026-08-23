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
  defaultTheme = 'dark',
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
      <button
        type="button"
        onClick={() => setTheme(isLight ? 'dark' : 'light')}
        aria-label={isLight ? 'تغییر به تم تیره' : 'تغییر به تم روشن'}
        className={[
          'fixed left-4 top-24 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition md:top-28',
          isLight
            ? 'border-sky-200/80 bg-white/90 text-sky-700 hover:bg-white'
            : 'border-white/15 bg-slate-950/80 text-sky-200 hover:bg-slate-900',
        ].join(' ')}
      >
        {isLight ? <Moon className="h-4 w-4" aria-hidden /> : <Sun className="h-4 w-4" aria-hidden />}
      </button>

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
