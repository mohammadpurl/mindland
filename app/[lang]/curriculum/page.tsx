import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { getCurriculum } from '@/lib/math-visual-engine/curriculum'
import {
  SubjectIcon,
  countSubjectLessons,
} from '@/app/components/ui/lessons/curriculum/SubjectIcon'
import { JourneyThemeCompare } from '@/app/components/ui/curriculum/JourneyThemeCompare'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const curriculum = getCurriculum()
  return {
    title: `کهکشان یادگیری | ${curriculum.title} | مایلند`,
    description:
      curriculum.description ||
      'سفر فضایی یادگیری مایلند — هر سیاره یک ایستگاه است و می‌گوید چه یاد می‌گیری',
    alternates: { canonical: `/${lang}/curriculum` },
  }
}

export default async function CurriculumPage({ params }: Props) {
  const { lang } = await params
  const curriculum = getCurriculum()
  const subjects = [...curriculum.subjects].sort((a, b) => a.order - b.order)

  const pageHeader = (
    <header className="mb-2 text-center md:mb-4 md:text-right" dir="rtl">
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-sky-800 dark:text-sky-300">
        <BookOpen className="h-4 w-4" aria-hidden />
        مسیر یادگیری · کهکشان مایلند
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl [.dark-journey_&]:text-white">
        {curriculum.title}
      </h1>
      {curriculum.description ? (
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-slate-700 md:mx-0 md:text-lg [.dark-journey_&]:text-slate-300">
          {curriculum.description} هر سیاره یک ایستگاه است؛ با اسکرول فضاپیما را جلو ببر و ببین
          آنجا چه یاد می‌گیری.
        </p>
      ) : null}
    </header>
  )

  return (
    <main className="min-h-screen pb-24 md:pb-0">
      <Navbar lang={lang} />

      <JourneyThemeCompare lang={lang} defaultTheme="light" pageHeader={pageHeader}>
        <section aria-labelledby="subjects-heading" dir="rtl">
          <h2
            id="subjects-heading"
            className="mb-4 text-xl font-extrabold text-white drop-shadow md:mb-5"
          >
            موضوعات درسی
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {subjects.map((subject) => {
              const lessonCount = countSubjectLessons(subject.topics)
              const topicCount = subject.topics.length
              const available = lessonCount > 0
              const href = `/${lang}/curriculum/${subject.id}`

              const body = (
                <>
                  <SubjectIcon icon={subject.icon} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-extrabold text-slate-900 transition-colors group-hover:text-sky-700">
                      {subject.title}
                    </h3>
                    {subject.description ? (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600">
                        {subject.description}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs font-semibold">
                      {available ? (
                        <span className="text-teal-700">
                          {topicCount} موضوع · {lessonCount} درس
                          {subject.grade ? ` · پایه ${subject.grade}` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400">به‌زودی</span>
                      )}
                    </p>
                  </div>
                  {available ? (
                    <ArrowLeft
                      className="h-5 w-5 shrink-0 text-slate-300 transition-colors group-hover:text-sky-600"
                      aria-hidden
                    />
                  ) : null}
                </>
              )

              return (
                <li key={subject.id}>
                  {available ? (
                    <Link
                      href={href}
                      className="group flex h-full items-start gap-4 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg backdrop-blur transition-all hover:border-sky-300 hover:bg-white md:p-6"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div
                      className="flex h-full items-start gap-4 rounded-2xl border border-white/40 bg-white/70 p-5 opacity-80 backdrop-blur md:p-6"
                      aria-disabled="true"
                    >
                      {body}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      </JourneyThemeCompare>

      <SiteFooter lang={lang} />
    </main>
  )
}
