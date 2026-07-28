'use client'

import { FractionDragGame } from '@/app/components/ui/animations/FractionDragGame'

interface Props {
  activityId: string
  onComplete: () => void
}

export function LessonActivity({ activityId, onComplete }: Props) {
  if (activityId === 'fraction-drag') {
    return <FractionDragGame embedded onAllLevelsComplete={onComplete} />
  }

  return (
    <div className="text-center text-white/70 py-10">
      فعالیت «{activityId}» هنوز ثبت نشده است.
    </div>
  )
}
