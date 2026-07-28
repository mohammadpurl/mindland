'use client'

import dynamic from 'next/dynamic'

const FractionWhiteboardLesson = dynamic(
  () =>
    import('./FractionWhiteboardLesson').then((m) => m.FractionWhiteboardLesson),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[320px] items-center justify-center text-slate-500">
        در حال بارگذاری وایت‌برد…
      </div>
    ),
  }
)

export function FractionWhiteboardPageClient() {
  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-4" dir="rtl">
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
          کسر روی وایت‌برد — درس تعاملی
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          ۶ مرحله تدریس + تمرین پیتزای Konva با معلم مجازی
        </p>
      </div>
      <div className="lesson-classroom-shell">
        <FractionWhiteboardLesson />
      </div>
    </div>
  )
}
