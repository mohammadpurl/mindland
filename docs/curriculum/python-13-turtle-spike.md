# Spike فنی turtle (PY-13)

**تصمیم:** Pyodide + ماژول turtle شبیه‌سازی‌شده + `<canvas>` (بدون iframe)

## معماری

- `lib/pythonTurtleRuntime.ts` — ماژول turtle مینی که خطوط را به stdout می‌فرستد (`MINDLAND_TURTLE:{json}`)
- `app/components/lesson/TurtleCanvas.tsx` — پارس خروجی و رسم روی canvas
- `PythonCodeRunner` — `prepareSource()` برای PY-13 با `wrapWithTurtlePreamble`

## محدودیت‌های MVP

- فقط `forward`/`fd`, `left`/`right`, `penup`/`pendown`, `goto`, `circle` (تقریبی)
- بدون انیمیشن realtime — رسم بعد از اجرای کامل
- `import turtle` از طریق `sys.modules` پشتیبانی می‌شود

## گزینه‌های رد شده

1. **iframe Trinket** — SEO و کنترل کمتر
2. **turtle واقعی Pyodide** — وابستگی سنگین و canvas hook پیچیده
