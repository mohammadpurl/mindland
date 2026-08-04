'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const ACTOR_SRC = '/charackter/char.png'

/**
 * صحنهٔ کوچک مینی برای درس‌های پایتون — حباب گفتار + حالت قفل.
 */
export function MiniSpeakStage({
  line,
  locked,
  shaking,
}: {
  line: string | null
  locked?: boolean
  shaking?: boolean
}) {
  return (
    <motion.div
      className="relative mx-auto overflow-hidden rounded-xl border border-sky-200"
      animate={shaking ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.45 }}
      style={{
        width: '100%',
        maxWidth: 280,
        aspectRatio: '320 / 160',
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
      {line && !locked ? (
        <div className="absolute top-3 left-1/2 max-w-[85%] -translate-x-1/2 rounded-xl bg-white px-3 py-2 text-center text-xs font-bold text-slate-800 shadow">
          {line}
        </div>
      ) : null}
    </motion.div>
  )
}
