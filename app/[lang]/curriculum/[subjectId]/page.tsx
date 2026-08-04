import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { getSubject } from '@/lib/math-visual-engine/curriculum'
import { SubjectIcon } from '@/app/components/ui/lessons/curriculum/SubjectIcon'
import { SchoolJourneyView } from '@/app/components/ui/curriculum/SchoolJourneyView'
import { getSchoolJourney } from '@/app/components/ui/curriculum/schoolJourneys'

type Props = { params: Promise<{ lang: string; subjectId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectId, lang } = await params
  const subject = getSubject(subjectId)
  if (!subject) return { title: 'یافت نشد' }
  const school = getSchoolJourney(subjectId)
  return {
    title: `${school?.schoolTitle ?? subject.title} | مایلند`,
    description: school?.journeySubtitle ?? subject.description,
    alternates: { canonical: `/${lang}/curriculum/${subjectId}` },
  }
}

export default async function SubjectPage({ params }: Props) {
  const { lang, subjectId } = await params
  const subject = getSubject(subjectId)
  if (!subject) notFound()

  const school = getSchoolJourney(subjectId)
  const topics = [...subject.topics].sort((a, b) => a.order - b.order)
  const hasTopics = topics.length > 0
  const hasJourney = Boolean(school)

  const pageHeader = (
    <header className="mb-2 text-center md:mb-4 md:text-right" dir="rtl">
      <nav className="mb-4 text-sm" aria-label="مسیر">
        <Link
          href={`/${lang}/curriculum`}
          className="font-semibold text-sky-800/80 hover:text-sky-950 [.dark-journey_&]:text-sky-300"
        >
          مدارس مایلند
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="font-bold text-slate-800 [.dark-journey_&]:text-white">
          {school?.schoolTitle ?? subject.title}
        </span>
      </nav>

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        <SubjectIcon icon={subject.icon} />
        <div className="flex-1">
          <p className="mb-2 inline-flex items-center gap-2 text-sm font-bold text-sky-800 [.dark-journey_&]:text-sky-300">
            <BookOpen className="h-4 w-4" aria-hidden />
            مسیر یادگیری این مدرسه
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl [.dark-journey_&]:text-white">
            {school?.schoolTitle ?? subject.title}
          </h1>
          {(school?.journeySubtitle || subject.description) && (
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700 md:text-lg [.dark-journey_&]:text-slate-300">
              {school?.journeySubtitle ?? subject.description}
            </p>
          )}
        </div>
      </div>
    </header>
  )

  const topicsBlock = (
    <section aria-labelledby="topics-heading" dir="rtl">
      <h2
        id="topics-heading"
        className="mb-4 text-xl font-extrabold text-white drop-shadow md:mb-5"
      >
        ایستگاه‌ها و موضوعات
      </h2>

      {!hasTopics ? (
        <div className="rounded-2xl border border-white/30 bg-white/85 p-8 text-center shadow-lg backdrop-blur">
          <p className="font-medium text-slate-700">موضوعات این مدرسه به‌زودی اضافه می‌شوند.</p>
          <Link
            href={`/${lang}/curriculum`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-700 hover:text-sky-900"
          >
            بازگشت به مدارس
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {topics.map((topic) => {
            const lessonCount = topic.lessons.length
            const isEmpty = lessonCount === 0
            const href = `/${lang}/curriculum/${subjectId}/${topic.id}`

            if (isEmpty) {
              return (
                <li
                  key={topic.id}
                  className="flex items-center gap-4 rounded-2xl border border-white/50 bg-white/75 p-5 opacity-90 backdrop-blur"
                >
                  <span className="text-3xl" aria-hidden>
                    {topic.icon ?? '📚'}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{topic.title}</h3>
                    {topic.description ? (
                      <p className="mt-0.5 text-sm text-slate-600">{topic.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs font-medium text-slate-400">به‌زودی</p>
                  </div>
                </li>
              )
            }

            return (
              <li key={topic.id}>
                <Link
                  href={href}
                  className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-md backdrop-blur transition-all hover:border-sky-300 hover:bg-white"
                >
                  <span className="text-3xl" aria-hidden>
                    {topic.icon ?? '📚'}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{topic.title}</h3>
                    {topic.description ? (
                      <p className="mt-0.5 text-sm text-slate-600">{topic.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs font-medium text-sky-700">
                      {lessonCount} درس پله‌پله
                    </p>
                  </div>
                  <ArrowLeft className="h-5 w-5 text-slate-300" aria-hidden />
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <Navbar lang={lang} />

      {hasJourney ? (
        <SchoolJourneyView lang={lang} subjectId={subjectId} pageHeader={pageHeader}>
          {topicsBlock}
        </SchoolJourneyView>
      ) : (
        <div className="mx-auto max-w-3xl px-4 py-10 md:py-14" dir="rtl">
          {pageHeader}
          <div className="mt-8">{topicsBlock}</div>
        </div>
      )}

      <SiteFooter lang={lang} />
    </main>
  )
}
