import type { OrchestratorLesson } from '../types'

/** ارجاع به یک درس در فهرست — فایل JSON جداگانه */
export interface CurriculumLessonRef {
  id: string
  title: string
  description?: string
  order: number
  /** سطح دشواری ۱ (آسان) تا ۵ */
  level?: number
  /** تعداد گام تدریس (برای نمایش در لیست) */
  teachSteps?: number
  /** تعداد گام تمرین */
  practiceSteps?: number
}

/** موضوع درسی — مثلاً کسرها */
export interface CurriculumTopic {
  id: string
  title: string
  description?: string
  order: number
  icon?: string
  lessons: CurriculumLessonRef[]
}

/** درس‌نامه / پایه — مثلاً ریاضی ششم */
export interface CurriculumSubject {
  id: string
  title: string
  description?: string
  grade?: number
  order: number
  /** کلید آیکون برای UI (مثلاً math | code | ai) */
  icon?: string
  topics: CurriculumTopic[]
}

/** ریشه برنامه درسی */
export interface Curriculum {
  id: string
  title: string
  description?: string
  subjects: CurriculumSubject[]
}

/** درس کامل + متادیتای برنامه */
export interface OrchestratorLessonMeta extends OrchestratorLesson {
  topicId: string
  subjectId: string
  order: number
  level?: number
}
