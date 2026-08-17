import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { Python14CapstoneLessonView } from '@/app/components/lesson/Python14CapstoneLessonView'
import { getPython14CapstoneLesson } from '@/lib/curriculum/lessons/python-14-capstone'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const lesson = getPython14CapstoneLesson()
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
      <Python14CapstoneLessonView lang={lang} />
      <SiteFooter lang={lang} />
    </main>
  )
}
