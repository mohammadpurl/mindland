import { Bot, Brain, Calculator, Code2, PenTool, type LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  math: Calculator,
  code: Code2,
  ai: Brain,
  robot: Bot,
  design: PenTool,
}

const TINT: Record<string, string> = {
  math: 'bg-amber-50 text-amber-600 border-amber-100',
  code: 'bg-sky-50 text-sky-600 border-sky-100',
  ai: 'bg-violet-50 text-violet-600 border-violet-100',
  robot: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  design: 'bg-orange-50 text-orange-600 border-orange-100',
}

export function SubjectIcon({ icon, className = '' }: { icon?: string; className?: string }) {
  const key = icon && ICONS[icon] ? icon : 'math'
  const Icon = ICONS[key]
  const tint = TINT[key] ?? TINT.math

  return (
    <span
      className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${tint} ${className}`}
      aria-hidden
    >
      <Icon className="h-7 w-7" strokeWidth={1.75} />
    </span>
  )
}

export function countSubjectLessons(topics: { lessons: unknown[] }[]): number {
  return topics.reduce((sum, t) => sum + t.lessons.length, 0)
}
