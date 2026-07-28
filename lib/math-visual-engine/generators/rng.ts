/**
 * Seedable RNG بدون وابستگی خارجی —
 * mulberry32: سریع، deterministic، سازگار با bundlerهای Next.js
 */

export type SeededRng = () => number

/** hash سادهٔ string → uint32 */
function hashSeed(seed: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): SeededRng {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed?: string | number): SeededRng {
  if (seed === undefined) {
    return Math.random
  }
  const n = typeof seed === 'number' ? seed >>> 0 : hashSeed(String(seed))
  return mulberry32(n || 1)
}

/** عدد صحیح تصادفی در [min, max] inclusive */
export function randomInt(rng: SeededRng, min: number, max: number): number {
  if (max < min) throw new Error(`randomInt: max (${max}) < min (${min})`)
  return min + Math.floor(rng() * (max - min + 1))
}

/** انتخاب تصادفی از آرایه */
export function pickOne<T>(rng: SeededRng, items: readonly T[]): T {
  if (items.length === 0) throw new Error('pickOne: empty array')
  return items[randomInt(rng, 0, items.length - 1)]!
}
