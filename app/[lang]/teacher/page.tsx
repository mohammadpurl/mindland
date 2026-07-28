import TeacherPageClient from '@/app/components/teacher/TeacherPageClient'
import type { Metadata } from 'next'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    title: 'معلم مجازی | مایلند',
    description: 'آواتار سه‌بعدی معلم مجازی مایلند برای کلاس‌های تعاملی',
    alternates: { canonical: `/${lang}/teacher` },
  }
}

export default function TeacherPage() {
  return <TeacherPageClient />
}
