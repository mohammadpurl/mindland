import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { GalacticSchoolsMap } from '@/app/components/ui/curriculum/GalacticSchoolsMap'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: 'کدوم سیاره رو فتح کنیم؟ | نقشهٔ کهکشانی مایلند',
    description:
      'هر مدرسهٔ مایلند یک بازوی کهکشان است و هر ایستگاه یک سیارهٔ کوچک. ریاضی، برنامه‌نویسی، هوش مصنوعی، رباتیک و طراحی را روی نقشه کاوش کن.',
    alternates: { canonical: `/${lang}/curriculum` },
  }
}

export default async function CurriculumPage({ params }: Props) {
  const { lang } = await params

  return (
    <main className="h-screen overflow-hidden">
      <Navbar lang={lang} />
      <GalacticSchoolsMap lang={lang} />
    </main>
  )
}
