import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubject } from '@/lib/math-visual-engine/curriculum'

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

  return (
    <main className="min-h-screen bg-slate-50 py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4" dir="rtl">
        <nav className="text-sm text-slate-500 mb-6">
          <Link href={`/${lang}/curriculum`} className="hover:text-indigo-600">
            برنامه درسی
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800 font-medium">{subject.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">{subject.title}</h1>
          {subject.description ? (
            <p className="text-slate-500 mt-2">{subject.description}</p>
          ) : null}
        </header>

        <div className="space-y-4">
          {topics.map((topic) => {
            const lessonCount = topic.lessons.length
            const isEmpty = lessonCount === 0

            return (
              <Link
                key={topic.id}
                href={isEmpty ? '#' : `/${lang}/curriculum/${subjectId}/${topic.id}`}
                className={`flex items-center gap-4 rounded-2xl border p-5 transition-all ${
                  isEmpty
                    ? 'border-slate-100 bg-slate-100/50 opacity-60 cursor-not-allowed'
                    : 'border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md'
                }`}
                aria-disabled={isEmpty}
              >
                <span className="text-3xl">{topic.icon ?? '📚'}</span>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-800">{topic.title}</h2>
                  {topic.description ? (
                    <p className="text-sm text-slate-500 mt-0.5">{topic.description}</p>
                  ) : null}
                  <p className="text-xs text-indigo-600 font-medium mt-2">
                    {isEmpty ? 'به‌زودی' : `${lessonCount} درس پله‌پله`}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
