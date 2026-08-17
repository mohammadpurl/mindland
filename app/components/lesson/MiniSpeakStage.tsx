'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ACTOR_SRC = '/charackter/char.png'

/**
 * صحنهٔ کوچک مینی برای درس‌های پایتون — حباب گفتار چندخطی + حالت قفل.
 */
export function MiniSpeakStage({
  line,
  lines,
  locked,
  shaking,
}: {
  /** سازگاری با PY-01: یک خط */
  line?: string | null
  /** خروجی کارت چندخطی */
  lines?: string[] | null
  locked?: boolean
  shaking?: boolean
}) {
  const spoken =
    lines && lines.length > 0
      ? lines
      : line
        ? [line]
        : []

  return (
    <motion.div
      className="relative mx-auto overflow-hidden rounded-xl border border-sky-200"
      animate={shaking ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        width: '100%',
        maxWidth: 320,
        minHeight: 160,
        aspectRatio: spoken.length > 2 ? undefined : '320 / 160',
        background: 'linear-gradient(180deg, #E0F2FE 0%, #F0FDF4 55%, #FEF9C3 100%)',
      }}
      role="img"
      aria-label="صحنهٔ مینی"
    >
      <div className="pointer-events-none absolute inset-2 rounded-lg border-2 border-dashed border-sky-300/70" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <Image
          src={ACTOR_SRC}
          alt="مینی"
          width={64}
          height={64}
          className={[
            'object-contain drop-shadow-md transition',
            locked ? 'opacity-70 grayscale-[30%]' : '',
          ].join(' ')}
          priority
          draggable={false}
        />
        {locked ? (
          <span className="absolute -top-1 -left-1 text-lg" aria-hidden>
            😵
          </span>
        ) : null}
      </div>
      {spoken.length > 0 ? (
        <div
          className={[
            'absolute top-3 left-1/2 max-h-[58%] max-w-[88%] -translate-x-1/2 overflow-y-auto rounded-xl bg-white px-3 py-2 text-center text-xs font-bold leading-5 text-slate-800 shadow',
            locked ? 'opacity-80' : '',
          ].join(' ')}
        >
          {spoken.map((l, i) => (
            <p key={`${i}-${l.slice(0, 12)}`}>{l}</p>
          ))}
        </div>
      ) : null}
    </motion.div>
  )
}
