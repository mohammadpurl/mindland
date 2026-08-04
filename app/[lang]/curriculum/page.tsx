import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Rocket } from 'lucide-react'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { getCurriculum } from '@/lib/math-visual-engine/curriculum'
import {
  SubjectIcon,
  countSubjectLessons,
} from '@/app/components/ui/lessons/curriculum/SubjectIcon'
import { getSchoolJourney } from '@/app/components/ui/curriculum/schoolJourneys'
import { HubHighwaysJourney } from '@/app/components/ui/curriculum/HubHighwaysJourney'

type Props = { params: Promise<{ lang: string }> }

const ROLE_LABEL: Record<string, string> = {
  backbone: 'ستون فقرات',
  builder: 'سازنده',
  applied: 'کاربردی · به‌زودی',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const curriculum = getCurriculum()
  return {
    title: `پنج مدرسه مایلند | ${curriculum.title}`,
    description:
      'ریاضیات ستون فقرات است؛ برنامه‌نویسی، هوش مصنوعی، رباتیک و طراحی روی باندهای موازی — بدون تکرار محتوا.',
    alternates: { canonical: `/${lang}/curriculum` },
  }
}

export default async function CurriculumPage({ params }: Props) {
  const { lang } = await params
  const curriculum = getCurriculum()
  const subjects = [...curriculum.subjects].sort((a, b) => a.order - b.order)

  const pageHeader = (
    <header className="mb-2 text-center md:mb-4 md:text-right" dir="rtl">
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-sky-900">
        <BookOpen className="h-4 w-4" aria-hidden />
        مدارس مایلند
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
        {curriculum.title}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-slate-700 md:mx-0 md:text-lg">
        {curriculum.description}
      </p>
    </header>
  )

  const schoolsList = (
    <section aria-labelledby="schools-list-heading" dir="rtl">
      <h2 id="schools-list-heading" className="mb-4 text-xl font-extrabold text-white drop-shadow md:mb-5">
        فهرست مدارس
      </h2>
      <p className="mb-5 max-w-2xl text-sm leading-7 text-sky-100/90">
        اگر کارت‌های روی نقشه را از دست دادی، از اینجا مستقیم وارد مسیر هر مدرسه شو.
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {subjects.map((subject) => {
          const lessonCount = countSubjectLessons(subject.topics)
          const school = getSchoolJourney(subject.id)
          const href = `/${lang}/curriculum/${subject.id}`
          const title = school?.schoolTitle ?? subject.title
          const blurb = school?.journeySubtitle ?? subject.description
          const role = school?.role ? ROLE_LABEL[school.role] : null
          const isBackbone = school?.role === 'backbone'

          return (
            <li key={subject.id}>
              <Link
                href={href}
                className={[
                  'group flex h-full items-start gap-3 rounded-2xl border p-4 shadow-md backdrop-blur transition hover:bg-white md:p-5',
                  isBackbone
                    ? 'border-teal-200/80 bg-white/95'
                    : 'border-white/50 bg-white/88 hover:border-sky-200',
                ].join(' ')}
              >
                <SubjectIcon icon={subject.icon} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-teal-700">
                      {title}
                    </h3>
                    {role ? (
                      <span
                        className={[
                          'rounded-md px-2 py-0.5 text-[10px] font-bold',
                          isBackbone ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600',
                        ].join(' ')}
                      >
                        {role}
                      </span>
                    ) : null}
                  </div>
                  {blurb ? (
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{blurb}</p>
                  ) : null}
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-sky-700">
                    <Rocket className="h-3.5 w-3.5" aria-hidden />
                    {lessonCount > 0 ? `${lessonCount} درس آماده` : 'نقشه راه کهکشانی'}
                  </p>
                </div>
                <ArrowLeft
                  className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-teal-600"
                  aria-hidden
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <Navbar lang={lang} />
      <HubHighwaysJourney lang={lang} pageHeader={pageHeader}>
        {schoolsList}
      </HubHighwaysJourney>
      <SiteFooter lang={lang} />
    </main>
  )
}
