import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { getSubject } from '@/lib/math-visual-engine/curriculum'
import { SubjectIcon } from '@/app/components/ui/lessons/curriculum/SubjectIcon'

type Props = { params: Promise<{ lang: string; subjectId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectId, lang } = await params
  const subject = getSubject(subjectId)
  if (!subject) return { title: 'یافت نشد' }
  return {
    title: `${subject.title} | مایلند`,
    description: subject.description,
    alternates: { canonical: `/${lang}/curriculum/${subjectId}` },
  }
}

export default async function SubjectPage({ params }: Props) {
  const { lang, subjectId } = await params
  const subject = getSubject(subjectId)
  if (!subject) notFound()

  const topics = [...subject.topics].sort((a, b) => a.order - b.order)
  const hasTopics = topics.length > 0

  return (
    <main className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      <Navbar lang={lang} />

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14" dir="rtl">
        <nav className="text-sm text-slate-500 mb-6" aria-label="مسیر">
          <Link href={`/${lang}/curriculum`} className="hover:text-indigo-600">
            دروس
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-medium">{subject.title}</span>
        </nav>

        <header className="mb-8 flex items-start gap-4">
          <SubjectIcon icon={subject.icon} />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">{subject.title}</h1>
            {subject.description ? (
              <p className="text-slate-500 mt-2 leading-7">{subject.description}</p>
            ) : null}
          </div>
        </header>

        {!hasTopics ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600 font-medium">این بخش به‌زودی آماده می‌شود.</p>
            <Link
              href={`/${lang}/curriculum`}
              className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              بازگشت به دروس
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {topics.map((topic) => {
              const lessonCount = topic.lessons.length
              const isEmpty = lessonCount === 0
              const href = `/${lang}/curriculum/${subjectId}/${topic.id}`

              if (isEmpty) {
                return (
                  <li
                    key={topic.id}
                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-100/50 p-5 opacity-60"
                  >
                    <span className="text-3xl" aria-hidden>
                      {topic.icon ?? '📚'}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-800">{topic.title}</h2>
                      {topic.description ? (
                        <p className="text-sm text-slate-500 mt-0.5">{topic.description}</p>
                      ) : null}
                      <p className="text-xs text-slate-400 font-medium mt-2">به‌زودی</p>
                    </div>
                  </li>
                )
              }

              return (
                <li key={topic.id}>
                  <Link
                    href={href}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <span className="text-3xl" aria-hidden>
                      {topic.icon ?? '📚'}
                    </span>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-slate-800">{topic.title}</h2>
                      {topic.description ? (
                        <p className="text-sm text-slate-500 mt-0.5">{topic.description}</p>
                      ) : null}
                      <p className="text-xs text-indigo-600 font-medium mt-2">
                        {lessonCount} درس پله‌پله
                      </p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-slate-300" aria-hidden />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <SiteFooter lang={lang} />
    </main>
  )
}
