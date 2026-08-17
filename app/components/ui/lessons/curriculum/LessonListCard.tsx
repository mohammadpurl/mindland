import Link from 'next/link'
import type { CurriculumLessonRef } from '@/lib/math-visual-engine/curriculum/types'

interface Props {
  lang: string
  subjectId: string
  topicId: string
  lesson: CurriculumLessonRef
}

export function LessonListCard({ lang, subjectId, topicId, lesson }: Props) {
  const pythonLessonIds = new Set([
    'python-00-blocks',
    'python-01-intro',
    'python-02-print-strings',
    'python-03-variables',
    'python-04-numbers',
    'python-05-input',
    'python-06-conditions',
    'python-07-for-loop',
    'python-08-while-loop',
    'python-09-lists',
    'python-10-dicts',
    'python-11-functions',
    'python-12-mini-project',
    'python-13-turtle',
    'python-14-capstone',
  ])
  const href =
    subjectId === 'programming' && pythonLessonIds.has(lesson.id)
      ? `/${lang}/lessons/programming/${lesson.id}`
      : `/${lang}/lessons/math-visual/${lesson.id}`

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mb-2">
            سطح {lesson.level ?? 1}
          </span>
          <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
            {lesson.title}
          </h3>
          {lesson.description ? (
            <p className="text-sm text-slate-500 mt-1 leading-6">{lesson.description}</p>
          ) : null}
        </div>
        <span className="text-2xl shrink-0 opacity-80 group-hover:scale-110 transition-transform">▶️</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-4 text-xs">
        {(lesson.teachSteps ?? 0) > 0 && (
          <span className="bg-sky-50 text-sky-700 px-2 py-1 rounded-full font-medium">
            📖 {lesson.teachSteps} تدریس
          </span>
        )}
        {(lesson.practiceSteps ?? 0) > 0 && (
          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium">
            ✋ {lesson.practiceSteps} تمرین
          </span>
        )}
      </div>
    </Link>
  )
}
