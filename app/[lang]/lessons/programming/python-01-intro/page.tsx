import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { Python01IntroLessonView } from '@/app/components/lesson/Python01IntroLessonView'
import { getPython01IntroLesson } from '@/lib/curriculum/lessons/python-01-intro'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const lesson = getPython01IntroLesson()
  return {
    title: `${lesson.code} — ${lesson.title} | مایلند`,
    description: lesson.metaphor.description,
    alternates: { canonical: `/${lang}/lessons/programming/${lesson.id}` },
  }
}

export default async function Python01IntroPage({ params }: Props) {
  const { lang } = await params

  return (
    <main className="min-h-screen bg-[#0B1220] pb-24 md:pb-0">
      <Navbar lang={lang} />
      <Python01IntroLessonView lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  )
}
