import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { getSubject, getTopic, getTopicLessons } from '@/lib/math-visual-engine/curriculum'
import { LessonListCard } from '@/app/components/ui/lessons/curriculum/LessonListCard'

type Props = { params: Promise<{ lang: string; subjectId: string; topicId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectId, topicId, lang } = await params
  const topic = getTopic(subjectId, topicId)
  if (!topic) return { title: 'یافت نشد' }
  return {
    title: `${topic.title} — درس‌ها | مایلند`,
    description: topic.description,
    alternates: { canonical: `/${lang}/curriculum/${subjectId}/${topicId}` },
  }
}

export default async function TopicLessonsPage({ params }: Props) {
  const { lang, subjectId, topicId } = await params
  const subject = getSubject(subjectId)
  const topic = getTopic(subjectId, topicId)
  if (!subject || !topic) notFound()

  const lessons = getTopicLessons(subjectId, topicId)

  return (
    <main className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      <Navbar lang={lang} />

      <div className="max-w-2xl mx-auto px-4 py-10 md:py-14" dir="rtl">
        <nav className="text-sm text-slate-500 mb-6" aria-label="مسیر">
          <Link href={`/${lang}/curriculum`} className="hover:text-indigo-600">
            دروس
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/curriculum/${subjectId}`} className="hover:text-indigo-600">
            {subject.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-medium">{topic.title}</span>
        </nav>

        <header className="mb-8">
          <span className="text-4xl" aria-hidden>
            {topic.icon ?? '📚'}
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-2">{topic.title}</h1>
          {topic.description ? (
            <p className="text-slate-500 mt-2 leading-7">{topic.description}</p>
          ) : null}
          <p className="text-xs text-slate-400 mt-3">هر درس: مقدمه → تدریس → تمرین تعاملی</p>
        </header>

        {lessons.length === 0 ? (
          <p className="text-center text-slate-500 py-12">درسی برای این موضوع ثبت نشده است.</p>
        ) : (
          <ol className="space-y-4">
            {lessons.map((lesson, i) => (
              <li key={lesson.id} className="relative">
                <span className="absolute -right-1 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold shadow">
                  {i + 1}
                </span>
                <div className="pr-8">
                  <LessonListCard
                    lang={lang}
                    subjectId={subjectId}
                    topicId={topicId}
                    lesson={lesson}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <SiteFooter lang={lang} />
    </main>
  )
}
