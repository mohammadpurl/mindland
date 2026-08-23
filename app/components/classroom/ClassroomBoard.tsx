'use client'

import type { ScenarioBoardContent } from '@/lib/curriculum/scenarios/types'

interface Props extends ScenarioBoardContent {
  speaking?: boolean
}

export function ClassroomBoardPanel({ title, lines, code, checklist, speaking }: Props) {
  const hasContent = Boolean(title || lines?.length || code || checklist?.length)
  if (!hasContent) {
    return (
      <div className="classroom-board classroom-board--empty" dir="rtl">
        <p className="classroom-board__placeholder">تخته آماده است…</p>
      </div>
    )
  }

  return (
    <div className="classroom-board" dir="rtl" aria-live="polite">
      {title ? <h2 className="classroom-board__title">{title}</h2> : null}
      {lines?.length ? (
        <ul className="classroom-board__lines">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}
      {code ? (
        <pre className="classroom-board__code">
          <code>{code}</code>
        </pre>
      ) : null}
      {checklist?.length ? (
        <ul className="classroom-board__checklist">
          {checklist.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
      ) : null}
      {speaking ? <span className="classroom-board__speaking-dot" aria-hidden /> : null}
    </div>
  )
}
