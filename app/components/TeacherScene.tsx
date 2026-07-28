'use client'

import TeacherSceneClient from './TeacherScene.client'

interface Props {
  className?: string
  height?: string
  withChatProvider?: boolean
  withBridge?: boolean
}

/**
 * صحنه معلم ۳D.
 * import مستقیم (بدون dynamic تودرتو) تا از ChunkLoadError در درس‌های Konva جلوگیری شود.
 */
export function TeacherScene({
  className = '',
  height = '320px',
  withChatProvider = true,
  withBridge = true,
}: Props) {
  return (
    <TeacherSceneClient
      className={className}
      height={height}
      withChatProvider={withChatProvider}
      withBridge={withBridge}
    />
  )
}
