'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { UI } from '@/app/components/UI'
import { LoadingVideo } from '@/app/components/LoadingVideo'
import { ChatProvider } from '@/hooks/useChat'
import { Leva } from 'leva'
import { MessageHistory } from '@/app/components/MessageHistory'
import { CameraDetection } from '@/app/components/CameraDetection'
import { AvatarLockButton } from '@/app/components/AvatarLockButton'
import { NotificationProvider } from '@/app/contexts/NotificationContext'
import { LessonAvatarBridge } from '@/app/components/LessonAvatarBridge'

const TeacherCanvas3D = dynamic(() => import('./TeacherCanvas3D'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-[1] flex items-center justify-center bg-slate-950 text-white/60 text-sm">
      در حال بارگذاری صحنه سه‌بعدی...
    </div>
  ),
})

export default function TeacherAvatarView() {
  const [cameraDetectionEnabled, setCameraDetectionEnabled] = useState(false)
  const [showLoadingVideo, setShowLoadingVideo] = useState(true)
  const [avatarLocked, setAvatarLocked] = useState(false)

  return (
    <main className="h-screen">
      <ChatProvider>
        <NotificationProvider>
          <LessonAvatarBridge />
          <div className="h-full relative">
            <TeacherCanvas3D
              avatarLocked={avatarLocked}
              onAvatarLockChange={setAvatarLocked}
              onAvatarLoaded={(loaded) => setShowLoadingVideo(!loaded)}
            />
            {/* بدون این خط، useControls پنل پیش‌فرض Leva را نشان می‌دهد */}
            <Leva hidden />
            <UI
              hidden={false}
              cameraDetectionEnabled={cameraDetectionEnabled}
              setCameraDetectionEnabled={setCameraDetectionEnabled}
            />
            <CameraDetection enabled={cameraDetectionEnabled} />
            <AvatarLockButton onLockChange={setAvatarLocked} isLocked={avatarLocked} />
            <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
              <MessageHistory />
            </div>
            {showLoadingVideo && (
              <LoadingVideo
                onVideoEnd={() => setShowLoadingVideo(false)}
                onVideoError={() => setShowLoadingVideo(false)}
              />
            )}
          </div>
        </NotificationProvider>
      </ChatProvider>
    </main>
  )
}
