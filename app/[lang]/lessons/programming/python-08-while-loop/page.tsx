import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { Python08WhileLoopLessonView } from '@/app/components/lesson/Python08WhileLoopLessonView'
import { getPython08WhileLoopLesson } from '@/lib/curriculum/lessons/python-08-while-loop'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const lesson = getPython08WhileLoopLesson()
  return {
    title: `${lesson.code} — ${lesson.title} | مایلند`,
    description: lesson.metaphor.description,
    alternates: { canonical: `/${lang}/lessons/programming/${lesson.id}` },
  }
}

export default async function Python08WhileLoopPage({ params }: Props) {
  const { lang } = await params

  return (
    <main className="min-h-screen bg-[#0B1220] pb-24 md:pb-0">
      <Navbar lang={lang} />
      <Python08WhileLoopLessonView lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  )
}
