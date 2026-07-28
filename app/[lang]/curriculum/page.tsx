import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurriculum } from '@/lib/math-visual-engine/curriculum'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const curriculum = getCurriculum()
  return {
    title: `${curriculum.title} | مایلند`,
    description: curriculum.description,
    alternates: { canonical: `/${lang}/curriculum` },
  }
}

export default async function CurriculumPage({ params }: Props) {
  const { lang } = await params
  const curriculum = getCurriculum()

  return (
    <main className="min-h-screen bg-slate-50 py-10 md:py-14">
      <div className="max-w-3xl mx-auto px-4" dir="rtl">
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">{curriculum.title}</h1>
          {curriculum.description ? (
            <p className="text-slate-500 mt-2 leading-7">{curriculum.description}</p>
          ) : null}
        </header>

        <div className="space-y-4">
          {curriculum.subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/${lang}/curriculum/${subject.id}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <span className="text-4xl">📐</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-800">{subject.title}</h2>
                {subject.description ? (
                  <p className="text-sm text-slate-500 mt-1">{subject.description}</p>
                ) : null}
                <p className="text-xs text-indigo-600 font-medium mt-2">
                  {subject.topics.length} موضوع · پایه {subject.grade ?? '—'}
                </p>
              </div>
              <span className="text-slate-400 text-lg">←</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
