import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { Python12MiniProjectLessonView } from '@/app/components/lesson/Python12MiniProjectLessonView'
import { getPython12MiniProjectLesson } from '@/lib/curriculum/lessons/python-12-mini-project'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const lesson = getPython12MiniProjectLesson()
  return {
    title: `${lesson.code} — ${lesson.title} | مایلند`,
    description: lesson.metaphor.description,
    alternates: { canonical: `/${lang}/lessons/programming/${lesson.id}` },
  }
}

export default async function Page({ params }: Props) {
  const { lang } = await params
  return (
    <main className="min-h-screen bg-[#0B1220] pb-24 md:pb-0">
      <Navbar lang={lang} />
      <Python12MiniProjectLessonView lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  )
}
