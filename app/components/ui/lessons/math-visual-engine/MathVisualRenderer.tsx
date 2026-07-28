'use client'

import type { MathVisualConfig, MathVisualComponentProps } from '@/lib/math-visual-engine/types'
import { isMathVisualType, MATH_VISUAL_REGISTRY } from './registry'

interface Props extends Omit<MathVisualComponentProps, 'mode' | 'params'> {
  config: MathVisualConfig
}

/** رندر ویژوال ریاضی بر اساس type در JSON */
export function MathVisualRenderer({
  config,
  width,
  height,
  onSpeak,
  setAnimation,
  onSuccess,
  onWrong,
}: Props) {
  if (!isMathVisualType(config.type)) {
    return (
      <div className="text-amber-600 text-sm p-4 bg-amber-50 rounded-lg">
        نوع ویژوال «{config.type}» در رجیستری ثبت نشده است.
      </div>
    )
  }

  const Visual = MATH_VISUAL_REGISTRY[config.type]

  return (
    <Visual
      mode={config.mode}
      params={config.params ?? {}}
      width={width}
      height={height}
      onSpeak={onSpeak}
      setAnimation={setAnimation}
      onSuccess={onSuccess}
      onWrong={onWrong}
    />
  )
}
