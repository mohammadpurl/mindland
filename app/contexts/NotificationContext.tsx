'use client'

import React, { createContext, useContext, type ReactNode } from 'react'
import {
  NotificationContainer,
  useNotification,
  type NotificationData,
} from '@/app/components/Notification'

type NotificationContextValue = ReturnType<typeof useNotification>

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const value = useNotification()

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={value.notifications}
        onClose={value.removeNotification}
      />
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('useNotificationContext must be used within NotificationProvider')
  }
  return ctx
}

export type { NotificationData }
