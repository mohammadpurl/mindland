import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { Python05InputLessonView } from '@/app/components/lesson/Python05InputLessonView'
import { getPython05InputLesson } from '@/lib/curriculum/lessons/python-05-input'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const lesson = getPython05InputLesson()
  return {
    title: `${lesson.code} — ${lesson.title} | مایلند`,
    description: lesson.metaphor.description,
    alternates: { canonical: `/${lang}/lessons/programming/${lesson.id}` },
  }
}

export default async function Python05InputPage({ params }: Props) {
  const { lang } = await params

  return (
    <main className="min-h-screen bg-[#0B1220] pb-24 md:pb-0">
      <Navbar lang={lang} />
      <Python05InputLessonView lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  )
}
