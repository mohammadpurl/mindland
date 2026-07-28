'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { TeacherState } from '@/lib/animation-types'

interface Props {
  message: string
  emotion?: TeacherState['emotion']
  speaking?: boolean
}

export function LessonTeacherBubble({ message, speaking }: Props) {
  if (!message.trim()) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={message.slice(0, 40)}
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.28 }}
        className="lesson-teacher-bubble"
        role="status"
        aria-live="polite"
      >
        {speaking && <span className="lesson-teacher-bubble__dot" aria-hidden />}
        <p>{message}</p>
      </motion.div>
    </AnimatePresence>
  )
}
