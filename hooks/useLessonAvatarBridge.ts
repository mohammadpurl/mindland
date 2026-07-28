'use client'

import { useEffect } from 'react'
import type { AvatarBridgePayload } from '@/lib/avatar-bridge/types'

/**
 * برای اتصال آواتار ۳بعدی (Avatar.jsx) به موتور درس:
 * در صفحه teacher این hook را صدا بزنید تا رویدادهای speak/animation دریافت شود.
 */
export function useLessonAvatarBridge(
  onCommand: (payload: AvatarBridgePayload) => void
) {
  useEffect(() => {
    const handler = (event: Event) => {
      const custom = event as CustomEvent<AvatarBridgePayload>
      if (custom.detail) onCommand(custom.detail)
    }
    window.addEventListener('mindland:avatar', handler)
    return () => window.removeEventListener('mindland:avatar', handler)
  }, [onCommand])
}
