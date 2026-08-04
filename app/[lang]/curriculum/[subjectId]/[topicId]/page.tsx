import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { getSubject, getTopic, getTopicLessons } from '@/lib/math-visual-engine/curriculum'
import { LessonListCard } from '@/app/components/ui/lessons/curriculum/LessonListCard'
import { PythonKidsSyllabusView } from '@/app/components/ui/curriculum/PythonKidsSyllabusView'
import { getPythonKidsSyllabus } from '@/lib/curriculum/python-kids-syllabus'

type Props = { params: Promise<{ lang: string; subjectId: string; topicId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectId, topicId, lang } = await params

  if (subjectId === 'programming' && topicId === 'python') {
    const syllabus = getPythonKidsSyllabus()
    return {
      title: `${syllabus.title} | فهرست دوره | مایلند`,
      description: syllabus.description,
      alternates: { canonical: `/${lang}/curriculum/programming/python` },
    }
  }

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

  if (subjectId === 'programming' && topicId === 'python') {
    return (
      <main className="min-h-screen pb-24 md:pb-0">
        <Navbar lang={lang} />
        <PythonKidsSyllabusView lang={lang} />
        <SiteFooter lang={lang} />
      </main>
    )
  }

  const subject = getSubject(subjectId)
  const topic = getTopic(subjectId, topicId)
  if (!subject || !topic) notFound()

  const lessons = getTopicLessons(subjectId, topicId)

  return (
    <main className="min-h-screen bg-slate-50 pb-24 md:pb-0">
      <Navbar lang={lang} />

      <div className="mx-auto max-w-2xl px-4 py-10 md:py-14" dir="rtl">
        <nav className="mb-6 text-sm text-slate-500" aria-label="مسیر">
          <Link href={`/${lang}/curriculum`} className="hover:text-indigo-600">
            دروس
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/curriculum/${subjectId}`} className="hover:text-indigo-600">
            {subject.title}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-slate-800">{topic.title}</span>
        </nav>

        <header className="mb-8">
          <span className="text-4xl" aria-hidden>
            {topic.icon ?? '📚'}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-800 md:text-3xl">{topic.title}</h1>
          {topic.description ? (
            <p className="mt-2 leading-7 text-slate-500">{topic.description}</p>
          ) : null}
          <p className="mt-3 text-xs text-slate-400">هر درس: مقدمه → تدریس → تمرین تعاملی</p>
        </header>

        {lessons.length === 0 ? (
          <p className="py-12 text-center text-slate-500">درسی برای این موضوع ثبت نشده است.</p>
        ) : (
          <ol className="space-y-4">
            {lessons.map((lesson, i) => (
              <li key={lesson.id} className="relative">
                <span className="absolute -right-1 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow">
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
