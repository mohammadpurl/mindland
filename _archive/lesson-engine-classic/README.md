# آرشیو — Lesson Engine Classic

منتقل‌شده در پاکسازی Mindland (مسیر واحد: Math Visual Engine).

## محتوا
- `lesson-engine/` — تایپ‌ها و موتور قدیمی (speak/animate/question/activity)
- `lessons/` — `math-fractions-demo.ts` و index
- کامپوننت‌ها: InteractiveLessonPlayer, LessonClassroom, LessonStepPanel, …
- `useLessonPlayer.ts`, `FractionDragGame.tsx`

## مسیرهای حذف‌شده از app router
- `/fa/lessons/math-fractions-demo` → `_archive/routes/lessonId-dynamic`
- `/fa/lessons/fraction-whiteboard` → `_archive/routes/fraction-whiteboard`

## جایگزین
- `/fa/curriculum` → `/fa/curriculum/math/fractions` → `/fa/lessons/math-visual/[lessonId]`

## تایپ‌های مشترک آواتار
به `lib/avatar-bridge/types.ts` منتقل شدند (AvatarAnimation, AvatarBridgePayload).
