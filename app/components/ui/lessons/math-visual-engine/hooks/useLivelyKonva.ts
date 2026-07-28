'use client'

import { useEffect, useState } from 'react'

/** انیمیشن‌های زنده مشترک Konva: نفس، پلک، برق */
export function useLivelyKonva() {
  const [breathPhase, setBreathPhase] = useState(0)
  const [sparklePhase, setSparklePhase] = useState(0)
  const [blink, setBlink] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })

  const breathScale = 1 + Math.sin(breathPhase) * 0.028

  useEffect(() => {
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      setBreathPhase(t * 2.2)
      setSparklePhase(t * 4)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 120)
    }, 2600 + Math.random() * 1400)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setEyeOffset({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 3,
      })
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return { breathScale, sparklePhase, blink, eyeOffset }
}
