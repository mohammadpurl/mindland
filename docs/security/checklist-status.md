# وضعیت چک‌لیست امنیت Mindland

تاریخ به‌روزرسانی: فاز ۲ — بک‌اند FastAPI در `backend/`

افسانه: **DONE** · **PARTIAL** · **MISSING** · **N/A** (هنوز موضوعیت ندارد)

---

## ۱. احراز هویت و نشست

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| HttpOnly + Secure + SameSite cookies برای JWT | DONE | `mindland-access-token` / `mindland-refresh-token`؛ Secure از env |
| Access کوتاه + Refresh با rotation | DONE | access کوتاه + refresh jti در DB با revoke |
| پین الگوریتم JWT (`alg`، نه `none`) | DONE | فقط HS256 در `core/security.py` |
| Rate limit روی login/register | DONE | slowapi `5/minute` |
| bcrypt/argon2 برای پسورد | DONE | passlib bcrypt |
| RBAC دانش‌آموز / معلم / ادمین | DONE | `constants/roles.py` + `require_permission` |

## ۲. XSS و ورودی

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| بدون `dangerouslySetInnerHTML` خام | DONE | در کد فعال یافت نشد |
| CSP | DONE | در `next.config.ts` (+ connect به API لوکال) |
| اعتبارسنجی فرانت + بک‌اند | DONE | Zod فرانت + Pydantic بک‌اند |

## ۳. CSRF

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| CSRF token برای cookie-session | DONE | double-submit: کوکی `mindland-csrf` + هدر `X-CSRF-Token` |
| SameSite روی cookie | DONE | پیش‌فرض `lax` |

## ۴. API فرانت ↔ FastAPI

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| CORS محدود | DONE | `ALLOWED_ORIGINS` + credentials |
| HTTPS اجباری | PARTIAL | HSTS در فرانت و API در production |
| بدون secret در باندل JS | DONE | کلیدها فقط سرور FastAPI |
| خطاهای production بدون stack داخلی | DONE | `build_error_response` بدون stack |
| محدودیت payload | PARTIAL | TTS/متن محدود؛ ویدئو با max size |

## ۵. دیتابیس

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| ORM / parameterized queries | DONE | SQLAlchemy + Alembic |
| least privilege DB user | PARTIAL | در docker-compose قابل تنظیم؛ هنوز harden نشده |
| بک‌آپ رمزنگاری‌شده | MISSING | ops |

## ۶. حریم خصوصی کودکان

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| حداقل PII + رضایت والد | PARTIAL | مدل `parent_id` هست؛ سیاست رضایت هنوز ناقص |
| دوربین/میک پیش‌فرض خاموش + رضایت | DONE | فرانت |
| فیلتر محتوای کاربر قبل از انتشار | N/A | مسیر انتشار کاربر هنوز نیست |

## ۷. Headers عمومی

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| HSTS, nosniff, X-Frame-Options | DONE | Next + FastAPI middleware |
| مخفی‌سازی `X-Powered-By` | DONE | `poweredByHeader: false` |
| `npm audit` / `pip-audit` منظم | PARTIAL | فرایند تیم |

## ۸. لاگ و مانیتورینگ

| آیتم | وضعیت | یادداشت |
|------|--------|---------|
| بدون پسورد/توکن در لاگ | PARTIAL | لاگ production ساکت‌تر؛ هنوز مانیتورینگ کامل نیست |
| هشدار الگوی غیرعادی | MISSING | infra |

---

## کارهای انجام‌شده در فاز ۲ (FastAPI)

1. اسکلت `backend/` با routes / services / models / schemas جدا
2. Auth HttpOnly + CSRF + refresh rotation + RBAC
3. داشبورد دانش‌آموز / معلم / ادمین
4. دوره، ثبت‌نام، پیشرفت، تمرین، پرداخت (Zarinpal sandbox)، ویدئو
5. OpenAI + ElevenLabs + Avasho
6. اتصال Login/Register فرانت به API (`lib/api/auth.ts`)
