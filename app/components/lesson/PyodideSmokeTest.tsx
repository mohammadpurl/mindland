'use client'

import { usePyodide } from '@/hooks/usePyodide'

const SAMPLE_CODE = `print("سلام مایلند!")
print(1 + 2)
print("ربات کوچیک آماده‌ست")
`

/**
 * تست دستی مرحله ۱ — بدون CodeMirror؛ فقط بیدار کردن ربات + print
 */
export function PyodideSmokeTest() {
  const {
    status,
    loadError,
    stdoutLines,
    lastRawError,
    ensureReady,
    runCode,
    clearOutput,
    isBusy,
  } = usePyodide()

  const statusLabel: Record<typeof status, string> = {
    idle: 'خوابیده',
    loading: 'ربات داره بیدار میشه...',
    ready: 'آماده‌ست',
    running: 'داره فکر می‌کنه...',
    error: 'بیدار نشد',
  }

  return (
    <div
      className="mx-auto max-w-xl space-y-4 rounded-2xl border border-orange-200 bg-white p-5 shadow-sm"
      dir="rtl"
    >
      <header>
        <h1 className="text-xl font-extrabold text-slate-900">تست Pyodide · مرحله ۱</h1>
        <p className="mt-1 text-sm leading-7 text-slate-600">
          بدون ادیتور — فقط لود singleton و یک <code className="rounded bg-slate-100 px-1">print</code>{' '}
          ساده.
        </p>
      </header>

      <p
        className={[
          'rounded-xl px-3 py-2 text-sm font-bold',
          status === 'ready'
            ? 'bg-teal-50 text-teal-800'
            : status === 'error'
              ? 'bg-rose-50 text-rose-800'
              : status === 'loading' || status === 'running'
                ? 'bg-amber-50 text-amber-900'
                : 'bg-slate-100 text-slate-700',
        ].join(' ')}
        aria-live="polite"
      >
        وضعیت: {statusLabel[status]}
      </p>

      <pre className="overflow-x-auto rounded-xl bg-slate-900 p-3 text-left text-xs leading-6 text-sky-100" dir="ltr">
        {SAMPLE_CODE}
      </pre>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={isBusy || status === 'ready'}
          onClick={() => {
            void ensureReady()
          }}
          className="rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          بیدار کردن ربات
        </button>
        <button
          type="button"
          disabled={isBusy}
          onClick={() => {
            void runCode(SAMPLE_CODE)
          }}
          className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          اجرا کن ▶
        </button>
        <button
          type="button"
          onClick={clearOutput}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
        >
          پاک کردن خروجی
        </button>
      </div>

      {loadError ? (
        <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800" role="alert">
          خطای لود: {loadError}
        </p>
      ) : null}

      <section aria-label="خروجی">
        <h2 className="mb-2 text-sm font-extrabold text-slate-800">خروجی</h2>
        <div className="min-h-[6rem] rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-sm text-slate-800">
          {stdoutLines.length === 0 ? (
            <span className="text-slate-400">هنوز چیزی چاپ نشده...</span>
          ) : (
            <ul className="space-y-1 text-left" dir="ltr">
              {stdoutLines.map((line, i) => (
                <li key={`${i}-${line}`}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {lastRawError ? (
        <details className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-sm">
          <summary className="cursor-pointer font-bold text-amber-900">خطای خام (موقت)</summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-left text-xs text-amber-950" dir="ltr">
            {lastRawError}
          </pre>
        </details>
      ) : null}
    </div>
  )
}
