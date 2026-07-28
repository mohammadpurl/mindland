import type { AvatarAnimation } from '@/lib/lesson-engine/types'
import type { TeacherState } from '@/lib/animation-types'

export type TeachingStepKind =
  | 'intro'
  | 'divide'
  | 'examples'
  | 'numerator'
  | 'compare'
  | 'ready'

export interface TeachingStep {
  id: number
  kind: TeachingStepKind
  title: string
  speak: string
  animation: AvatarAnimation
  emotion?: TeacherState['emotion']
}

/** ۶ مرحله تدریس کسر روی وایت‌برد */
export const FRACTION_TEACHING_STEPS: TeachingStep[] = [
  {
    id: 1,
    kind: 'intro',
    title: 'کسر یعنی چه؟',
    speak: 'کسر دو بخش دارد: صورت بالا و مخرج پایین. صورت می‌گوید چند قسمت برداشتیم، مخرج می‌گوید کل به چند قسمت تقسیم شده.',
    animation: 'Talking',
    emotion: 'happy',
  },
  {
    id: 2,
    kind: 'divide',
    title: 'تقسیم مساوی',
    speak: 'نگاه کن! یک دایره را به قسمت‌های مساوی تقسیم می‌کنیم. همه برش‌ها باید اندازه یکسان داشته باشند.',
    animation: 'Pointing',
  },
  {
    id: 3,
    kind: 'examples',
    title: 'مثال‌های پیتزا',
    speak: 'یک دوم، یک سوم و یک چهارم! هر چه مخرج بزرگ‌تر شود، هر برش کوچک‌تر می‌شود.',
    animation: 'Pointing',
  },
  {
    id: 4,
    kind: 'numerator',
    title: 'تغییر صورت',
    speak: 'حالا صورت را عوض می‌کنیم. اگر دو برش از چهار برش برداریم، می‌شود دو چهارم.',
    animation: 'Talking',
  },
  {
    id: 5,
    kind: 'compare',
    title: 'مقایسه کسرها',
    speak: 'یک دوم از یک چهارم بزرگ‌تر است. کسر بزرگ‌تر یعنی سهم بیشتری از کل را برداشته‌ایم.',
    animation: 'Pointing',
  },
  {
    id: 6,
    kind: 'ready',
    title: 'آماده تمرین!',
    speak: 'عالی! حالا خودت با پیتزای تعاملی تمرین کن. برش‌ها را بکش و درست کن!',
    animation: 'StandingGreeting',
    emotion: 'encouraging',
  },
]
