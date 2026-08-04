import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Layers,
  Sparkles,
  Target,
} from 'lucide-react'
import {
  countPythonLessons,
  getPythonKidsSyllabus,
  type PythonLessonItem,
  type PythonSection,
} from '@/lib/curriculum/python-kids-syllabus'

const STATUS_FA: Record<PythonLessonItem['status'], string> = {
  planned: 'به‌زودی',
  writing: 'در حال نوشتن',
  ready: 'آماده',
}

function LessonCard({ lesson, lang }: { lesson: PythonLessonItem; lang: string }) {
  const lessonHref =
    lesson.status === 'ready' &&
    (lesson.id === 'python-00-blocks' || lesson.id === 'python-01-intro')
      ? `/${lang}/lessons/programming/${lesson.id}`
      : null

  const card = (
    <>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-orange-600">{lesson.code}</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-800">{lesson.title}</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
            <Clock3 className="h-3 w-3" aria-hidden />
            {lesson.duration}
          </span>
          <span
            className={[
              'rounded-md px-2 py-1 text-[10px] font-bold',
              lesson.status === 'ready'
                ? 'bg-teal-50 text-teal-800'
                : 'bg-amber-50 text-amber-800',
            ].join(' ')}
          >
            {STATUS_FA[lesson.status]}
          </span>
        </div>
      </div>

      <dl className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        <div>
          <dt className="inline-flex items-center gap-1 text-xs font-bold text-slate-500">
            <Target className="h-3.5 w-3.5" aria-hidden />
            هدف
          </dt>
          <dd className="mt-0.5">{lesson.goal}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-slate-500">استعاره</dt>
          <dd className="mt-0.5">{lesson.metaphor}</dd>
        </div>
        <div>
          <dt className="text-xs font-bold text-slate-500">تمرین</dt>
          <dd className="mt-0.5">{lesson.guided}</dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl bg-sky-50/90 p-3">
          <p className="text-[10px] font-extrabold text-sky-800">چالش رده A · ۹–۱۱</p>
          <p className="mt-1 text-xs leading-5 text-sky-950/80">{lesson.challengeA}</p>
        </div>
        <div className="rounded-xl bg-orange-50/90 p-3">
          <p className="text-[10px] font-extrabold text-orange-800">چالش رده B · ۱۲–۱۴</p>
          <p className="mt-1 text-xs leading-5 text-orange-950/80">{lesson.challengeB}</p>
        </div>
      </div>

      {lessonHref ? (
        <p className="mt-3 text-xs font-extrabold text-teal-700">ورود به درس ←</p>
      ) : null}
    </>
  )

  return (
    <article
      id={lesson.code.toLowerCase()}
      className="rounded-2xl border border-orange-100/80 bg-white/90 p-4 shadow-sm md:p-5"
    >
      {lessonHref ? (
        <Link href={lessonHref} className="block transition hover:opacity-95">
          {card}
        </Link>
      ) : (
        card
      )}
    </article>
  )
}

function SectionBlock({ section, lang }: { section: PythonSection; lang: string }) {
  return (
    <section aria-labelledby={`section-${section.id}`} className="scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id={`section-${section.id}`}
            className="text-xl font-extrabold text-slate-800 md:text-2xl"
          >
            {section.title}
          </h2>
          {section.optional ? (
            <p className="mt-1 text-xs font-bold text-teal-700">اختیاری · ولی توصیه‌شده</p>
          ) : null}
        </div>
        <p className="text-xs font-semibold text-slate-500">{section.lessons.length} درس</p>
      </div>
      {section.outcome ? (
        <p className="mb-4 rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-3 py-2 text-sm text-slate-600">
          <span className="font-bold text-orange-800">خروجی بخش: </span>
          {section.outcome}
        </p>
      ) : null}
      <ol className="space-y-3">
        {section.lessons.map((lesson) => (
          <li key={lesson.id}>
            <LessonCard lesson={lesson} lang={lang} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export function PythonKidsSyllabusView({ lang }: { lang: string }) {
  const syllabus = getPythonKidsSyllabus()
  const lessonCount = countPythonLessons(syllabus)

  return (
    <div className="relative overflow-hidden" dir="rtl">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 100% 0%, rgba(251,146,60,0.18), transparent 55%),
            radial-gradient(ellipse 60% 40% at 0% 20%, rgba(56,189,248,0.16), transparent 50%),
            linear-gradient(180deg, #FFF7ED 0%, #F0F9FF 42%, #F8FAFC 100%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 py-10 md:max-w-4xl md:py-14">
        <nav className="mb-6 text-sm text-slate-500" aria-label="مسیر">
          <Link href={`/${lang}/curriculum`} className="font-semibold hover:text-orange-700">
            مدارس مایلند
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <Link
            href={`/${lang}/curriculum/programming`}
            className="font-semibold hover:text-orange-700"
          >
            مدرسه برنامه‌نویسی
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="font-bold text-slate-800">پایتون کودکان</span>
        </nav>

        <header className="mb-10">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-xs font-bold text-orange-800 shadow-sm">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            فهرست دوره ·
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {syllabus.title}
          </h1>
          <p className="mt-2 text-base font-bold text-orange-700 md:text-lg">{syllabus.subtitle}</p>
          <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {syllabus.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-slate-900 px-3 py-1.5 text-white">
              {lessonCount} درس در فهرست
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sky-900">
              {syllabus.bands.A.label}: {syllabus.bands.A.ages}
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1.5 text-orange-900">
              {syllabus.bands.B.label}: {syllabus.bands.B.ages}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-slate-700 ring-1 ring-slate-200">
              <Clock3 className="h-3.5 w-3.5" aria-hidden />
              جلسه ۴۵–۵۰ دقیقه
            </span>
          </div>
        </header>

        <section aria-labelledby="bands-heading" className="mb-10 grid gap-3 sm:grid-cols-2">
          <h2 id="bands-heading" className="sr-only">
            دو رده سنی
          </h2>
          <div className="rounded-2xl border border-sky-200 bg-sky-50/80 p-4">
            <p className="text-sm font-extrabold text-sky-900">
              {syllabus.bands.A.label} · {syllabus.bands.A.ages}
            </p>
            <p className="mt-2 text-sm leading-7 text-sky-950/80">{syllabus.bands.A.vibe}</p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-4">
            <p className="text-sm font-extrabold text-orange-900">
              {syllabus.bands.B.label} · {syllabus.bands.B.ages}
            </p>
            <p className="mt-2 text-sm leading-7 text-orange-950/80">{syllabus.bands.B.vibe}</p>
          </div>
        </section>

        {/* <section aria-labelledby="principles-heading" className="mb-10">
          <h2
            id="principles-heading"
            className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-800"
          >
            <Layers className="h-5 w-5 text-orange-600" aria-hidden />
            اصول طراحی دوره
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {syllabus.principles.map((p) => (
              <li
                key={p.title}
                className="rounded-xl border border-white bg-white/85 p-3 shadow-sm"
              >
                <p className="text-sm font-extrabold text-slate-800">{p.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-600">{p.body}</p>
              </li>
            ))}
          </ul>
        </section> */}

        <section aria-labelledby="template-heading" className="mb-10">
          <h2
            id="template-heading"
            className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-800"
          >
            <Sparkles className="h-5 w-5 text-sky-600" aria-hidden />
            قالب هر جلسه
          </h2>
          <ol className="flex flex-wrap gap-2">
            {syllabus.sessionTemplate.map((step, i) => (
              <li
                key={step}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-[10px] text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <nav
          aria-label="پرش به بخش‌ها"
          className="mb-10 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
        >
          <p className="mb-2 text-xs font-bold text-slate-500">پریدن به بخش</p>
          <ul className="flex flex-wrap gap-2">
            {syllabus.sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#section-${s.id}`}
                  className="inline-block rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-orange-100 hover:text-orange-900"
                >
                  {s.title.replace(/^بخش [^·]+ · /, '').replace(/^پیش‌نیاز · /, '')}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {syllabus.sections.map((section) => (
            <div key={section.id} id={`section-${section.id}`}>
              <SectionBlock section={section} lang={lang} />
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-orange-200 bg-white/90 p-5 shadow-sm">
          <div>
            <p className="font-extrabold text-slate-800">قدم بعدی</p>
            <p className="mt-1 text-sm text-slate-600">
              نوشتن سناریوی کامل PY-01 برای هر دو رده — بعد از تأیید این صفحه.
            </p>
          </div>
          <Link
            href={`/${lang}/curriculum/programming`}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-orange-700"
          >
            بازگشت به مدرسه برنامه‌نویسی
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  )
}
