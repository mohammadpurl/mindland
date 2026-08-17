import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { Python11FunctionsLessonView } from '@/app/components/lesson/Python11FunctionsLessonView'
import { getPython11FunctionsLesson } from '@/lib/curriculum/lessons/python-11-functions'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const lesson = getPython11FunctionsLesson()
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
      <Python11FunctionsLessonView lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  )
}
