'use client'

import { useEffect, useMemo, useState } from 'react'
import type { MathVisualComponentProps, DivisionParams } from '@/lib/math-visual-engine/types'

/* ------------------------------------------------------------------ */
/*  کمک‌ابزارها                                                        */
/* ------------------------------------------------------------------ */

function parseParams(params: MathVisualComponentProps['params']): DivisionParams {
  return (params ?? {}) as DivisionParams
}

function toFa(n: number | string): string {
  return String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)
}

/** مولد عدد شبه‌تصادفی با seed ثابت — تا ترتیب گزینه‌ها بین رندرها عوض نشود */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

type RoleKey = 'dividend' | 'divisor' | 'quotient' | 'remainder'

const ROLE_META: Record<RoleKey, { name: string; def: string; ask: string }> = {
  dividend: {
    name: 'مقسوم',
    def: 'عددی که قرار است تقسیم شود.',
    ask: 'کدام عدد نشان می‌دهد چه چیزی را داشتیم و می‌خواستیم تقسیم کنیم؟',
  },
  divisor: {
    name: 'مقسوم‌علیه',
    def: 'عددی که مقسوم را بر اساس آن تقسیم می‌کنیم.',
    ask: 'کدام عدد مشخص می‌کند تقسیم را بر اساس چند انجام می‌دهیم؟',
  },
  quotient: {
    name: 'خارج‌قسمت',
    def: 'تعداد کاملِ هر گروه.',
    ask: 'از هر گروه چند تای کامل به دست آوردیم؟',
  },
  remainder: {
    name: 'باقی‌مانده',
    def: 'مقداری که پس از کامل‌شدن گروه‌ها باقی می‌ماند.',
    ask: 'چه چیزی دیگر در گروه‌های کامل جا نشد؟',
  },
}

const BOARD =
  'mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-[#FFFEF7] p-5 shadow-inner'

/* ------------------------------------------------------------------ */
/*  صحنه ۱ — تقسیم اشیا بین گروه‌ها                                    */
/* ------------------------------------------------------------------ */

function GroupingBoard({
  mode,
  params,
  onSuccess,
  onWrong,
}: {
  mode: MathVisualComponentProps['mode']
  params: DivisionParams
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const total = params.total ?? 27
  const groups = params.groups ?? 4
  const quotient = Math.floor(total / groups)
  const remainder = total % groups
  const isInteractive = mode === 'interactive'

  // counts[i] = تعداد اشیای گروه i ؛ مابقی در «انبار»
  const [counts, setCounts] = useState<number[]>(() =>
    isInteractive ? Array(groups).fill(0) : Array(groups).fill(quotient)
  )
  const [done, setDone] = useState(!isInteractive)

  const placed = counts.reduce((s, c) => s + c, 0)
  const pool = total - placed
  const fair =
    counts.every((c) => c === counts[0]) && pool < groups && placed > 0

  const addTo = (i: number) => {
    if (done || pool <= 0) return
    setCounts((prev) => prev.map((c, idx) => (idx === i ? c + 1 : c)))
  }
  const removeFrom = (i: number) => {
    if (done) return
    setCounts((prev) => prev.map((c, idx) => (idx === i && c > 0 ? c - 1 : c)))
  }

  const check = () => {
    if (fair) {
      setDone(true)
      onSuccess?.()
    } else {
      onWrong?.()
    }
  }

  return (
    <div className={BOARD} dir="rtl">
      <p className="mb-3 text-center text-sm font-extrabold text-slate-500">
        {params.title ?? `${toFa(total)} تا را عادلانه بین ${toFa(groups)} گروه تقسیم کن`}
      </p>

      {/* انبار */}
      <div className="mb-4 rounded-xl bg-slate-100 p-3">
        <p className="mb-2 text-center text-xs font-bold text-slate-500">
          انبار — {toFa(pool)} تا مانده
        </p>
        <div className="flex flex-wrap justify-center gap-1.5">
          {Array.from({ length: pool }).map((_, i) => (
            <span key={i} className="h-4 w-4 rounded-full bg-amber-400" />
          ))}
          {pool === 0 && <span className="text-xs text-slate-400">خالی شد</span>}
        </div>
      </div>

      {/* گروه‌ها */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {counts.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => addTo(i)}
            onContextMenu={(e) => {
              e.preventDefault()
              removeFrom(i)
            }}
            disabled={done}
            className="flex min-h-24 flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-white p-2 transition-colors hover:border-indigo-400 disabled:opacity-80"
          >
            <span className="text-[11px] font-bold text-slate-400">گروه {toFa(i + 1)}</span>
            <span className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: c }).map((_, k) => (
                <span
                  key={k}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFrom(i)
                  }}
                  className="h-4 w-4 rounded-full bg-indigo-500"
                />
              ))}
            </span>
            <span className="mt-auto text-sm font-black text-slate-700">{toFa(c)}</span>
          </button>
        ))}
      </div>

      {/* عبارت جمع */}
      <p className="mt-4 text-center text-lg font-black text-slate-800" dir="ltr">
        {counts.map(toFa).join(' + ')}
        {pool > 0 ? ` + ${toFa(pool)}` : ''} = {toFa(total)}
      </p>

      {isInteractive && !done && (
        <div className="mt-3 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={check}
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-extrabold text-white shadow"
          >
            بررسی کن ✅
          </button>
          <p className="text-[11px] text-slate-400">
            روی هر گروه بزن تا یکی اضافه شود؛ روی یک دایره بزن تا برگردد.
          </p>
        </div>
      )}

      {done && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-center">
          <p className="text-base font-black text-emerald-800" dir="ltr">
            {toFa(total)} ÷ {toFa(groups)} = {toFa(quotient)} ، باقی‌مانده {toFa(remainder)}
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            {toFa(groups)} گروهِ کامل با {toFa(quotient)} تا، و {toFa(remainder)} تا باقی ماند.
          </p>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  صحنه ۲/۳/۸ — چهار نقش تقسیم                                        */
/* ------------------------------------------------------------------ */

function RolesBoard({
  mode,
  params,
  onSuccess,
  onWrong,
}: {
  mode: MathVisualComponentProps['mode']
  params: DivisionParams
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const dividend = params.dividend ?? 27
  const divisor = params.divisor ?? 4
  const quotient = params.quotient ?? Math.floor(dividend / divisor)
  const remainder = params.remainder ?? dividend % divisor
  const isInteractive = mode === 'interactive'

  const values: Record<RoleKey, number> = { dividend, divisor, quotient, remainder }
  const asks: RoleKey[] = params.asks?.length
    ? params.asks
    : ['dividend', 'divisor', 'quotient', 'remainder']

  const [askIndex, setAskIndex] = useState(0)
  const [revealed, setRevealed] = useState<Set<RoleKey>>(
    () => new Set(isInteractive ? [] : (['dividend', 'divisor', 'quotient', 'remainder'] as RoleKey[]))
  )
  const [wrongSlot, setWrongSlot] = useState<RoleKey | null>(null)

  const currentAsk = asks[askIndex]
  const finished = askIndex >= asks.length

  const pick = (slot: RoleKey) => {
    if (!isInteractive || finished) return
    if (slot === currentAsk) {
      setWrongSlot(null)
      setRevealed((prev) => new Set(prev).add(slot))
      const next = askIndex + 1
      setAskIndex(next)
      if (next >= asks.length) onSuccess?.()
    } else {
      setWrongSlot(slot)
      onWrong?.()
    }
  }

  const Slot = ({ role }: { role: RoleKey }) => {
    const show = revealed.has(role)
    const isTarget = isInteractive && !finished && currentAsk === role
    const isWrong = wrongSlot === role
    return (
      <span className="inline-flex flex-col items-center gap-1 align-middle">
        <button
          type="button"
          onClick={() => pick(role)}
          disabled={!isInteractive || show || finished}
          className={[
            'flex h-12 w-14 items-center justify-center rounded-xl text-2xl font-black transition-all',
            show
              ? 'bg-emerald-400 text-emerald-950 ring-4 ring-emerald-200'
              : isWrong
                ? 'bg-rose-300 text-rose-950 ring-4 ring-rose-200'
                : isInteractive
                  ? 'bg-slate-100 text-slate-700 hover:bg-indigo-100'
                  : 'bg-slate-100 text-slate-700',
          ].join(' ')}
        >
          {toFa(values[role])}
        </button>
        {show && (
          <span className="text-[11px] font-extrabold text-emerald-700">{ROLE_META[role].name}</span>
        )}
        {isTarget && !show && (
          <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
        )}
      </span>
    )
  }

  return (
    <div className={BOARD} dir="rtl">
      <p className="mb-4 text-center text-sm font-extrabold text-slate-500">
        {params.title ?? 'هر عدد چه نقشی دارد؟'}
      </p>

      <div className="flex flex-wrap items-start justify-center gap-2" dir="ltr">
        <Slot role="dividend" />
        <span className="pt-3 text-2xl font-black text-slate-400">÷</span>
        <Slot role="divisor" />
        <span className="pt-3 text-2xl font-black text-slate-400">=</span>
        <Slot role="quotient" />
        <span className="pt-3.5 text-sm font-black text-slate-400">باقیمانده</span>
        <Slot role="remainder" />
      </div>

      {isInteractive && !finished && (
        <p className="mt-5 text-center text-base font-bold text-slate-700">
          {params.prompt ?? ROLE_META[currentAsk!].ask}
        </p>
      )}

      {/* تعریف نقش‌های کشف‌شده */}
      <div className="mt-4 flex flex-col gap-1.5">
        {(['dividend', 'divisor', 'quotient', 'remainder'] as RoleKey[])
          .filter((r) => revealed.has(r))
          .map((r) => (
            <p key={r} className="text-xs text-slate-500">
              <span className="font-extrabold text-slate-700">{ROLE_META[r].name}</span> ({toFa(values[r])})
              — {ROLE_META[r].def}
            </p>
          ))}
      </div>

      {isInteractive && finished && (
        <p className="mt-4 text-center text-sm font-extrabold text-emerald-700">
          هر چهار نقش را درست شناختی! 🎉
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  صحنه ۴/۸ — رابطهٔ تقسیم                                            */
/* ------------------------------------------------------------------ */

function RelationBoard({
  mode,
  params,
  onSuccess,
  onWrong,
}: {
  mode: MathVisualComponentProps['mode']
  params: DivisionParams
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const dividend = params.dividend ?? 27
  const divisor = params.divisor ?? 4
  const quotient = params.quotient ?? Math.floor(dividend / divisor)
  const remainder = params.remainder ?? dividend % divisor
  const missing = params.missing ?? 'remainder'
  const isInteractive = mode === 'interactive'

  const values: Record<RoleKey, number> = { dividend, divisor, quotient, remainder }
  const answer = values[missing]

  const options = useMemo(() => {
    if (!isInteractive) return []
    const raw = [answer, answer + 1, Math.max(0, answer - 1), answer + divisor, answer + 2]
    const uniq = Array.from(new Set(raw.filter((n) => n >= 0))).slice(0, 4)
    if (!uniq.includes(answer)) uniq[0] = answer
    return shuffle(uniq, dividend * 100 + divisor)
  }, [isInteractive, answer, divisor, dividend])

  const [picked, setPicked] = useState<number | null>(null)
  const solved = picked === answer

  const pick = (n: number) => {
    if (solved) return
    setPicked(n)
    if (n === answer) onSuccess?.()
    else onWrong?.()
  }

  const box = (role: RoleKey) => {
    const hidden = isInteractive && !solved && role === missing
    return (
      <span
        className={[
          'inline-flex h-11 min-w-11 items-center justify-center rounded-lg px-2 text-xl font-black',
          hidden ? 'bg-amber-200 text-amber-700' : 'bg-slate-100 text-slate-800',
        ].join(' ')}
      >
        {hidden ? '؟' : toFa(values[role])}
      </span>
    )
  }

  return (
    <div className={BOARD} dir="rtl">
      <p className="mb-3 text-center text-sm font-extrabold text-slate-500">
        {params.title ?? 'راز بزرگ تقسیم'}
      </p>

      <p className="mb-4 text-center text-sm text-slate-500">
        مقسوم = (مقسوم‌علیه × خارج‌قسمت) + باقی‌مانده
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2" dir="ltr">
        {box('divisor')}
        <span className="text-xl font-black text-slate-400">×</span>
        {box('quotient')}
        <span className="text-xl font-black text-slate-400">+</span>
        {box('remainder')}
        <span className="text-xl font-black text-slate-400">=</span>
        {box('dividend')}
      </div>

      {isInteractive && !solved && (
        <>
          <p className="mt-5 text-center text-base font-bold text-slate-700">
            {params.prompt ?? `${ROLE_META[missing].name} چند است؟`}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2" dir="ltr">
            {options.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => pick(n)}
                className={[
                  'h-12 w-14 rounded-xl text-xl font-black shadow-sm transition-colors',
                  picked === n && n !== answer
                    ? 'bg-rose-300 text-rose-950'
                    : 'bg-white text-slate-700 hover:bg-indigo-100',
                ].join(' ')}
              >
                {toFa(n)}
              </button>
            ))}
          </div>
        </>
      )}

      {(solved || !isInteractive) && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-2 text-center text-base font-black text-emerald-800" dir="ltr">
          {toFa(divisor)} × {toFa(quotient)} + {toFa(remainder)} = {toFa(dividend)}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  صحنه ۵/۹ — بررسی درستی باقی‌مانده                                  */
/* ------------------------------------------------------------------ */

function RemainderCheckBoard({
  mode,
  params,
  onSuccess,
  onWrong,
}: {
  mode: MathVisualComponentProps['mode']
  params: DivisionParams
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const dividend = params.dividend ?? 29
  const divisor = params.divisor ?? 6
  const q = params.claimQuotient ?? 4
  const r = params.claimRemainder ?? 7
  const isInteractive = mode === 'interactive'

  const arithmeticOk = divisor * q + r === dividend
  const remainderOk = r >= 0 && r < divisor
  const valid = arithmeticOk && remainderOk

  const [picked, setPicked] = useState<boolean | null>(null)
  const answered = picked !== null && (picked === valid)

  const explanation = valid
    ? `${toFa(divisor)} × ${toFa(q)} + ${toFa(r)} = ${toFa(dividend)} و باقی‌مانده از مقسوم‌علیه کوچک‌تر است. جواب درست است.`
    : !remainderOk
      ? `باقی‌مانده ${toFa(r)} از مقسوم‌علیه ${toFa(divisor)} کوچک‌تر نیست؛ پس هنوز می‌توان یک گروه کامل دیگر ساخت. باقی‌مانده همیشه باید از مقسوم‌علیه کوچک‌تر باشد.`
      : `بررسی کن: ${toFa(divisor)} × ${toFa(q)} + ${toFa(r)} = ${toFa(divisor * q + r)} که برابر ${toFa(dividend)} نیست.`

  const pick = (v: boolean) => {
    if (answered) return
    setPicked(v)
    if (v === valid) onSuccess?.()
    else onWrong?.()
  }

  return (
    <div className={BOARD} dir="rtl">
      <p className="mb-3 text-center text-sm font-extrabold text-slate-500">
        {params.title ?? 'این جواب ممکن است؟'}
      </p>

      <p className="text-center text-2xl font-black text-slate-800" dir="ltr">
        {toFa(dividend)} ÷ {toFa(divisor)} = {toFa(q)} ، باقیمانده {toFa(r)}
      </p>

      {isInteractive && !answered && (
        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => pick(true)}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-extrabold text-white shadow"
          >
            درست است ✅
          </button>
          <button
            type="button"
            onClick={() => pick(false)}
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-extrabold text-white shadow"
          >
            نادرست است ❌
          </button>
        </div>
      )}

      {(answered || !isInteractive) && (
        <div
          className={[
            'mt-4 rounded-xl p-3 text-center text-xs leading-6',
            valid ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800',
          ].join(' ')}
        >
          <span className="mb-1 block text-sm font-black">
            {valid ? 'جواب درست است ✅' : 'جواب نادرست است ❌'}
          </span>
          {explanation}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  صحنه ۶/۱۰ — دسته‌بندی تقسیم کامل / دارای باقی‌مانده                */
/* ------------------------------------------------------------------ */

function SortBoard({
  mode,
  params,
  onSuccess,
  onWrong,
}: {
  mode: MathVisualComponentProps['mode']
  params: DivisionParams
  onSuccess?: () => void
  onWrong?: () => void
}) {
  const items = params.items ?? [
    { dividend: 24, divisor: 6 },
    { dividend: 25, divisor: 6 },
    { dividend: 35, divisor: 5 },
    { dividend: 38, divisor: 5 },
  ]
  const isInteractive = mode === 'interactive'

  const rows = items.map((it) => {
    const quotient = it.quotient ?? Math.floor(it.dividend / it.divisor)
    const remainder = it.remainder ?? it.dividend % it.divisor
    return { ...it, quotient, remainder, complete: remainder === 0 }
  })

  const [assign, setAssign] = useState<(boolean | null)[]>(() =>
    rows.map((r) => (isInteractive ? null : r.complete))
  )
  const [checked, setChecked] = useState(!isInteractive)
  const allAssigned = assign.every((a) => a !== null)
  const allCorrect = rows.every((r, i) => assign[i] === r.complete)

  const setRow = (i: number, val: boolean) => {
    if (checked && allCorrect) return
    setChecked(false)
    setAssign((prev) => prev.map((a, idx) => (idx === i ? val : a)))
  }

  const check = () => {
    setChecked(true)
    if (allCorrect) onSuccess?.()
    else onWrong?.()
  }

  return (
    <div className={BOARD} dir="rtl">
      <p className="mb-3 text-center text-sm font-extrabold text-slate-500">
        {params.title ?? 'هر تقسیم را در دستهٔ درست بگذار'}
      </p>
      {params.prompt && (
        <p className="mb-3 text-center text-sm font-bold text-slate-700">{params.prompt}</p>
      )}

      <div className="flex flex-col gap-2">
        {rows.map((r, i) => {
          const rowWrong = checked && assign[i] !== r.complete
          return (
            <div
              key={i}
              className={[
                'flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 p-2',
                rowWrong ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white',
              ].join(' ')}
            >
              <span className="text-base font-black text-slate-800" dir="ltr">
                {toFa(r.dividend)} ÷ {toFa(r.divisor)} = {toFa(r.quotient)}
                <span className="mr-2 text-xs font-bold text-slate-500">
                  باقی‌مانده {toFa(r.remainder)}
                </span>
              </span>
              <span className="flex gap-1.5">
                {[
                  { v: true, label: 'تقسیم کامل' },
                  { v: false, label: 'باقی‌مانده دارد' },
                ].map((opt) => {
                  const active = assign[i] === opt.v
                  const showRight = checked && r.complete === opt.v
                  return (
                    <button
                      key={String(opt.v)}
                      type="button"
                      onClick={() => setRow(i, opt.v)}
                      disabled={!isInteractive}
                      className={[
                        'rounded-full px-3 py-1 text-xs font-extrabold transition-colors',
                        showRight
                          ? 'bg-emerald-400 text-emerald-950'
                          : active
                            ? 'bg-sky-400 text-sky-950'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </span>
            </div>
          )
        })}
      </div>

      {isInteractive && !(checked && allCorrect) && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={check}
            disabled={!allAssigned}
            className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-extrabold text-white shadow disabled:opacity-40"
          >
            بررسی کن ✅
          </button>
        </div>
      )}
      {checked && allCorrect && isInteractive && (
        <p className="mt-3 text-center text-sm font-extrabold text-emerald-700">
          آفرین! باقی‌مانده صفر یعنی تقسیم کامل. 🎉
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  نقطهٔ ورود                                                         */
/* ------------------------------------------------------------------ */

function DivisionModelBoard({ mode, params: rawParams, onSuccess, onWrong }: MathVisualComponentProps) {
  const params = parseParams(rawParams)
  const variant = params.variant ?? 'roles'

  const [resetKey, setResetKey] = useState(0)
  useEffect(() => {
    setResetKey((k) => k + 1)
  }, [
    params.variant,
    params.total,
    params.groups,
    params.dividend,
    params.divisor,
    params.quotient,
    params.remainder,
    params.missing,
    params.claimQuotient,
    params.claimRemainder,
  ])

  const shared = { mode, params, onSuccess, onWrong }

  switch (variant) {
    case 'grouping':
      return <GroupingBoard key={resetKey} {...shared} />
    case 'roles':
      return <RolesBoard key={resetKey} {...shared} />
    case 'relation':
      return <RelationBoard key={resetKey} {...shared} />
    case 'remainder-check':
      return <RemainderCheckBoard key={resetKey} {...shared} />
    case 'sort':
      return <SortBoard key={resetKey} {...shared} />
    default:
      return (
        <div className={BOARD} dir="rtl">
          <p className="py-8 text-center text-sm text-slate-400">
            نوع نامعتبر برای مدل تقسیم: {String(variant)}
          </p>
        </div>
      )
  }
}

/** DivisionModel — مدل مفهومی تقسیم: گروه‌بندی، چهار نقش، رابطهٔ تقسیم، قانون باقی‌مانده و تقسیم کامل */
export function DivisionModel(props: MathVisualComponentProps) {
  return <DivisionModelBoard {...props} />
}
