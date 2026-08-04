'use client'

import { useCallback, useEffect, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { usePyodide } from '@/hooks/usePyodide'
import { explainPythonError } from '@/lib/pythonErrorMessages'
import { BrokenShowOverlay } from '@/app/components/lesson/BrokenShowOverlay'
import { MiniSpeakStage } from '@/app/components/lesson/MiniSpeakStage'

export type CodeRunnerMode = 'demo' | 'interactive'

export interface MissionGoal {
  id: string
  label: string
}

const DEMO_GOOD = 'print("سلام! من مینی‌ام.")'
const DEMO_BAD = 'print("سلام! من مینی‌ام.)'

const DEFAULT_CHECKLIST: MissionGoal[] = [
  { id: 'typed', label: 'کد رو تایپ کردم' },
  { id: 'ran', label: 'اجرا کردم' },
  { id: 'said', label: 'مینی درست گفتش (بدون خطا)' },
]

export function PythonCodeRunner({
  mode = 'interactive',
  band = 'A',
  mission,
  checklist = DEFAULT_CHECKLIST,
  initialCode = '',
  onNarrate,
}: {
  mode?: CodeRunnerMode
  band?: 'A' | 'B'
  mission?: string
  checklist?: MissionGoal[]
  /** خالی بگذار تا دانش‌آموز خودش بنویسد — اسکلت حداقلی نده */
  initialCode?: string
  onNarrate?: (text: string) => void
}) {
  const { runCode, isBusy, status, ensureReady, loadError } = usePyodide()
  const [code, setCode] = useState(initialCode)
  const [miniLine, setMiniLine] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [crashMessage, setCrashMessage] = useState<string | null>(null)
  const [rawError, setRawError] = useState<string | null>(null)
  const [caption, setCaption] = useState(mission ?? '')
  const [done, setDone] = useState<Record<string, boolean>>({})
  const [demoCode, setDemoCode] = useState(DEMO_GOOD)

  useEffect(() => {
    setCode(initialCode)
    setMiniLine(null)
    setLocked(false)
    setCrashMessage(null)
    setRawError(null)
    setDone({})
    if (mission) setCaption(mission)
  }, [mode, mission, initialCode])

  useEffect(() => {
    void ensureReady().catch(() => undefined)
  }, [ensureReady])

  const crash = useCallback((message: string, raw: string | null) => {
    setLocked(true)
    setShaking(true)
    window.setTimeout(() => setShaking(false), 450)
    setCrashMessage(message)
    setRawError(raw)
    setMiniLine(null)
    setCaption(message)
  }, [])

  const clearCrash = useCallback(() => {
    setLocked(false)
    setCrashMessage(null)
    setRawError(null)
    setCaption(mission ?? '')
  }, [mission])

  const execute = useCallback(
    async (source: string, opts?: { trackTyped?: boolean }) => {
      if (!source.trim()) {
        setCaption('اول یه خط کد بنویس.')
        return
      }

      clearCrash()
      setMiniLine(null)

      if (opts?.trackTyped !== false && mode === 'interactive') {
        setDone((prev) => ({ ...prev, typed: true }))
      }

      const result = await runCode(source)

      if (mode === 'interactive') {
        setDone((prev) => ({ ...prev, ran: true, typed: true }))
      }

      if (result.hasError && result.error) {
        const explained = explainPythonError(result.error, source)
        crash(explained.systemMessage, result.error)
        return
      }

      const said = result.output.trim() || '(خالی)'
      setMiniLine(said.split('\n')[0] ?? said)
      setCaption('مینی گفت.')
      if (mode === 'interactive') {
        setDone((prev) => ({ ...prev, typed: true, ran: true, said: true }))
      }
    },
    [clearCrash, crash, mode, runCode]
  )

  async function runDemo(kind: 'good' | 'bad') {
    const source = kind === 'good' ? DEMO_GOOD : DEMO_BAD
    setDemoCode(source)
    await execute(source, { trackTyped: false })
    if (kind === 'good') {
      onNarrate?.('این شد.')
      setCaption('این شد.')
    } else {
      onNarrate?.(
        'جمله‌ی ما تقریباً همون بود. فقط یه علامت کم داشت. برای مینی، تقریباً یعنی نه.'
      )
    }
  }

  const showChecklist = mode === 'interactive'
  const editorValue = mode === 'demo' ? demoCode : code
  const editorReadOnly = mode === 'demo' || isBusy

  return (
    <div className="rounded-2xl border border-teal-200 bg-white/95 p-4 shadow-sm md:p-5" dir="rtl">
      {mission ? (
        <p className="mb-3 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-center text-sm font-extrabold text-teal-900">
          {mission}
        </p>
      ) : null}

      {showChecklist ? (
        <ul className="mb-3 flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
          {checklist.map((g) => {
            const ok = !!done[g.id]
            return (
              <li
                key={g.id}
                className={[
                  'rounded-lg px-2.5 py-1',
                  ok ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600',
                ].join(' ')}
              >
                {ok ? '✅' : '⬜'} {g.label}
              </li>
            )
          })}
        </ul>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-extrabold text-slate-800">صحنهٔ مینی</h3>
        <p className="text-xs font-bold text-teal-800" aria-live="polite">
          {status === 'loading'
            ? 'مینی داره بیدار می‌شه...'
            : loadError
              ? 'محیط کد لود نشد'
              : caption}
        </p>
      </div>

      <div className="relative mb-4">
        <MiniSpeakStage line={miniLine} locked={locked} shaking={shaking} />
        {crashMessage ? (
          <BrokenShowOverlay
            message={crashMessage}
            retryLabel="🔁 دوباره امتحان کن"
            onRetry={clearCrash}
          />
        ) : null}
      </div>

      {mode === 'demo' ? (
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void runDemo('good')}
            className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۱) اجرای درست
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void runDemo('bad')}
            className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50"
          >
            ۲) یه علامت کم
          </button>
        </div>
      ) : null}

      <label className="mb-1 block text-xs font-extrabold text-slate-600" htmlFor="py-editor">
        کد (پایتون)
      </label>
      <textarea
        id="py-editor"
        dir="ltr"
        spellCheck={false}
        readOnly={editorReadOnly}
        value={editorValue}
        onChange={(e) => {
          if (mode === 'interactive') {
            setCode(e.target.value)
            if (e.target.value.trim()) {
              setDone((prev) => ({ ...prev, typed: true }))
            }
          }
        }}
        placeholder={'print("...")'}
        className="min-h-[120px] w-full rounded-xl border border-slate-200 bg-slate-900 p-3 font-mono text-sm leading-6 text-sky-100 outline-none ring-teal-500 focus:ring-2 disabled:opacity-70"
        aria-label="ویرایشگر کد پایتون"
      />

      {mode === 'interactive' ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void execute(code)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
          >
            <Play className="h-4 w-4" aria-hidden />
            اجرا کن
          </button>
          <button
            type="button"
            onClick={() => {
              clearCrash()
              setMiniLine(null)
              setCode('')
              setDone({})
              setCaption(mission ?? '')
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            از نو
          </button>
        </div>
      ) : null}

      {band === 'B' && rawError ? (
        <details className="mt-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm">
          <summary className="cursor-pointer font-bold text-amber-900">متن خام خطا (اختیاری)</summary>
          <pre
            className="mt-2 overflow-x-auto whitespace-pre-wrap text-left text-xs text-amber-950"
            dir="ltr"
          >
            {rawError}
          </pre>
        </details>
      ) : null}

      {loadError ? (
        <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">
          {loadError}
        </p>
      ) : null}
    </div>
  )
}
