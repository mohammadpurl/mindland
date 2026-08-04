import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { PyodideSmokeTest } from '@/app/components/lesson/PyodideSmokeTest'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: 'تست Pyodide · مرحله ۱ | مایلند',
    robots: { index: false, follow: false },
    alternates: { canonical: `/${lang}/dev/pyodide-smoke` },
  }
}

export default async function PyodideSmokePage({ params }: Props) {
  const { lang } = await params

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-sky-50 pb-24 md:pb-0">
      <Navbar lang={lang} />
      <div className="px-4 py-10 md:py-14">
        <PyodideSmokeTest />
      </div>
      <SiteFooter lang={lang} />
    </main>
  )
}
