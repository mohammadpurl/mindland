import type { InteractiveLesson } from '@/lib/lesson-engine/types'

export const mathFractionsDemoLesson: InteractiveLesson = {
  id: 'math-fractions-demo',
  title: 'آشنایی با کسر — درس تعاملی ریاضی',
  subject: 'math',
  description: 'درس نمونه با آواتار، سوال کلیکی و تمرین drag & drop',
  steps: [
    {
      type: 'speak',
      id: 'intro',
      message: 'سلام! امروز با هم یاد می‌گیریم کسر یعنی چه و چطور بخشی از یک چیز را نشان می‌دهیم.',
      emotion: 'happy',
      animation: 'StandingGreeting',
      durationMs: 4200,
    },
    {
      type: 'animate',
      id: 'show-pizza',
      animationId: 'fraction-intro',
      message: 'نگاه کن! یک پیتزا را به چند قسمت مساوی تقسیم کردیم.',
      emotion: 'explaining',
    },
    {
      type: 'question',
      id: 'q1',
      question: 'اگر پیتزا را به ۴ قسمت مساوی تقسیم کنیم و ۱ قسمت را برداریم، کسر چیست؟',
      hint: 'یک قسمت از چهار قسمت — یعنی ۱/۴',
      options: [
        { id: 'a', label: '۱/۴', correct: true },
        { id: 'b', label: '۴/۱', correct: false },
        { id: 'c', label: '۲/۴', correct: false },
      ],
      correctMessage: 'دقیقاً! یک چهارم یعنی ۱/۴ 🍕',
      wrongMessage: 'نزدیک بود! به تعداد قسمت‌های برداشته و کل قسمت‌ها دقت کن.',
    },
    {
      type: 'speak',
      id: 'before-activity',
      message: 'حالا خودت امتحان کن و برش‌های پیتزا را بکش و رها کن.',
      emotion: 'encouraging',
      animation: 'Pointing',
      durationMs: 3200,
    },
    {
      type: 'activity',
      id: 'fraction-game',
      activityId: 'fraction-drag',
      introMessage: 'برش‌های درست را به سمت پیتزای هدف بکش!',
    },
    {
      type: 'speak',
      id: 'outro',
      message: 'عالی بود! حالا کسرها برایت آشناتر شده‌اند.',
      emotion: 'celebrating',
      animation: 'Clapping',
      durationMs: 3000,
    },
  ],
}
