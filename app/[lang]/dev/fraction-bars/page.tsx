import type { Metadata } from 'next'
import { Navbar } from '@/components/nav/navbar'
import { SiteFooter } from '@/components/sections/site-footer'
import { FractionBarsWorkspace } from '@/app/components/ui/manipulatives/FractionBarsWorkspace'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: 'کاشی‌های کسر · فضای کار آزاد | مایلند',
    robots: { index: false, follow: false },
    alternates: { canonical: `/${lang}/dev/fraction-bars` },
  }
}

export default async function FractionBarsDevPage({ params }: Props) {
  const { lang } = await params

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-sky-50 pb-24 md:pb-0" dir="rtl">
      <Navbar lang={lang} />
      <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="mb-2 text-xl font-extrabold text-slate-800">کاشی‌های کسر</h1>
        <p className="mb-6 text-sm text-slate-600">
          نمونهٔ اول از موتور عمومی «فضای کار» — کاشی از قفسهٔ بالا بکش، هرجای بوم که خواستی بگذار،
          کنار کاشی‌های دیگر بچین و ببین کدام‌ها هم‌اندازه‌اند. برای برداشتن یک کاشی از بوم، آن را
          دوباره به سمت قفسه بکش.
        </p>
        <FractionBarsWorkspace />
      </div>
      <SiteFooter lang={lang} />
    </main>
  )
}
