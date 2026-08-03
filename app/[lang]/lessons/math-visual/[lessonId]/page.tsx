import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getOrchestratorLesson, getNextLessonRef, getTopic } from '@/lib/math-visual-engine/loadLesson'
import { MathVisualLessonShell } from '@/app/components/ui/lessons/math-visual-engine/MathVisualLessonShell'

type Props = { params: Promise<{ lang: string; lessonId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId, lang } = await params
  const lesson = getOrchestratorLesson(lessonId)
  if (!lesson) return { title: 'درس یافت نشد' }
  return {
    title: `${lesson.title} | مایلند`,
    description: lesson.description,
    alternates: { canonical: `/${lang}/lessons/math-visual/${lessonId}` },
  }
}

export default async function MathVisualLessonPage({ params }: Props) {
  const { lessonId, lang } = await params
  const lesson = getOrchestratorLesson(lessonId)
  if (!lesson) notFound()

  const subjectId = lesson.subjectId ?? 'math'
  const topicId = lesson.topicId ?? 'fractions'
  const topic = getTopic(subjectId, topicId)
  const backToTopicHref = `/${lang}/curriculum/${subjectId}/${topicId}`

  const nextRef =
    lesson.subjectId && lesson.topicId
      ? getNextLessonRef(lesson.subjectId, lesson.topicId, lesson.id)
      : null
  const nextLessonHref = nextRef ? `/${lang}/lessons/math-visual/${nextRef.id}` : null

  return (
    <main className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="w-full max-w-6xl mx-auto p-3 md:p-4" dir="rtl">
        <nav className="text-sm text-slate-500 mb-4">
          <Link href={`/${lang}/curriculum`} className="hover:text-indigo-600">
            دروس
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/curriculum/${subjectId}`} className="hover:text-indigo-600">
            ریاضی
          </Link>
          <span className="mx-2">/</span>
          <Link href={backToTopicHref} className="hover:text-indigo-600">
            {topic?.title ?? topicId}
          </Link>
        </nav>
        <header className="mb-4">
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">{lesson.title}</h1>
          {lesson.description ? (
            <p className="text-sm text-slate-500 mt-1">{lesson.description}</p>
          ) : null}
        </header>
        <MathVisualLessonShell
          lesson={lesson}
          nextLessonHref={nextLessonHref}
          nextLessonTitle={nextRef?.title}
          backToTopicHref={backToTopicHref}
        />
      </div>
    </main>
  )
}
