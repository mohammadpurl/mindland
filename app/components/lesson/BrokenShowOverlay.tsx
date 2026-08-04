'use client'

/**
 * افکت مشترک «نمایش خراب / مینی قفل کرد» — پیام سیستمی خنثی، نه نصیحت معلم.
 */
export function BrokenShowOverlay({
  message,
  retryLabel = '🔁 دوباره امتحان کن',
  onRetry,
}: {
  message: string
  retryLabel?: string
  onRetry: () => void
}) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-900/55 p-4 text-center backdrop-blur-[1px]">
      <p className="text-sm font-extrabold text-white" role="alert">
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl bg-white px-4 py-2 text-xs font-extrabold text-slate-900"
      >
        {retryLabel}
      </button>
    </div>
  )
}
