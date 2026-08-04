# -*- coding: utf-8 -*-
import json
from pathlib import Path

p = Path(r"d:\leila\leila\my projects\mali\mindland\lib\math-visual-engine\curriculum\math-grade-6.json")
old = json.loads(p.read_text(encoding="utf-8"))
math_old = next(s for s in old["subjects"] if s["id"] == "math")
frac = next(t for t in math_old["topics"] if t["id"] == "fractions")
geo = next(t for t in math_old["topics"] if t["id"] == "geometry")


def topic(tid, title, description, order, icon, lessons=None, coming=True):
    desc = description
    if coming and not lessons:
        desc = description + " — به‌زودی"
    return {
        "id": tid,
        "title": title,
        "description": desc,
        "order": order,
        "icon": icon,
        "lessons": lessons or [],
    }


math_topics = [
    topic(
        "fractions",
        "کسرها",
        "جمع، تفریق، ضرب، تقسیم و مقایسه کسرها — هم‌راستا با کتاب ششم ۱۴۰۴",
        1,
        "🍕",
        frac["lessons"],
        coming=False,
    ),
    topic("decimals", "اعداد اعشاری و درصد", "اعشار، درصد و کاربرد روزمره", 2, "💯"),
    topic("ratios", "نسبت و تناسب", "نسبت، تناسب و مسئله‌های کاربردی", 3, "⚖️"),
    topic("integers", "اعداد صحیح و منفی", "اعداد صحیح، منفی و خط اعداد", 4, "➖"),
    topic(
        "geometry",
        "هندسه پایه",
        "محیط، مساحت، زاویه و اشکال دوبعدی",
        5,
        "📐",
        geo["lessons"],
        coming=False,
    ),
    topic("algebra", "جبر پایه", "معادلات یک‌مجهولی و عبارت‌های جبری", 6, "𝑥"),
    topic("powers", "توان و رادیکال", "توان، ریشه و قوانین پایه", 7, "²"),
    topic("coordinates", "مختصات و دستگاه محورها", "صفحه مختصات و نقاط", 8, "🗺️"),
    topic("stats", "آمار توصیفی", "میانگین، میانه و نمودار", 9, "📊"),
    topic("probability", "احتمال پایه", "احتمال ساده و ترکیبیات مقدماتی", 10, "🎲"),
    topic(
        "algebra-advanced",
        "جبر پیشرفته",
        "معادلات دومجهولی، نامعادلات و توابع خطی",
        11,
        "∑",
    ),
    topic("functions", "توابع و نمودار", "توابع و رسم نمودار", 12, "📈"),
    topic(
        "analytic-geometry",
        "هندسه تحلیلی مقدماتی",
        "خط، فاصله و شکل در مختصات",
        13,
        "📏",
    ),
    topic(
        "stats-advanced",
        "آمار و احتمال پیشرفته",
        "توزیع احتمال و احتمال شرطی — پیش‌نیاز هوش مصنوعی",
        14,
        "📉",
    ),
    topic(
        "trigonometry",
        "مثلثات پایه",
        "سینوس، کسینوس — پیش‌نیاز رباتیک و گرافیک",
        15,
        "△",
    ),
    topic(
        "linear-algebra",
        "مبانی جبر خطی",
        "بردار و ماتریس — پیش‌نیاز هوش مصنوعی",
        16,
        "▦",
    ),
    topic(
        "calculus-intro",
        "مبانی مشتق و حد",
        "درک شهودی حد و مشتق — اختیاری برای AI پیشرفته",
        17,
        "∂",
    ),
]

data = {
    "id": "mindland-schools",
    "title": "پنج مدرسه مایلند",
    "description": "مدرسه ریاضیات ستون فقرات است؛ بقیه مدارس به درس‌های ریاضی ارجاع می‌دهند و محتوای تکراری نمی‌سازند.",
    "subjects": [
        {
            "id": "math",
            "title": "مدرسه ریاضیات",
            "description": "ستون فقرات همه مدارس — از کسر تا جبر خطی و مثلثات",
            "grade": 6,
            "order": 1,
            "icon": "math",
            "topics": math_topics,
        },
        {
            "id": "programming",
            "title": "مدرسه برنامه‌نویسی",
            "description": "از برنامه‌نویسی بلوکی تا پایتون، داده و پروژه — وب پایه اختیاری",
            "order": 2,
            "icon": "code",
            "topics": [
                topic("block-coding", "برنامه‌نویسی بلوکی", "منطق، حلقه و شرط مثل Scratch", 1, "🧩"),
                topic("python-intro", "مقدمه پایتون", "متغیر، ورودی/خروجی و عملگرها", 2, "🐍"),
                topic("python-loops", "حلقه‌ها و شرط‌ها", "ساختار کنترل در پایتون", 3, "🔁"),
                topic("python-functions", "توابع در پایتون", "تعریف و استفاده از تابع", 4, "ƒ"),
                topic("data-structures", "ساختمان داده‌های پایه", "لیست، دیکشنری، تاپل و مجموعه", 5, "📦"),
                topic("oop-intro", "شیءگرایی مقدماتی", "کلاس و شیء", 6, "🏗️"),
                topic("files-errors", "فایل و خطایابی", "کار با فایل و exception", 7, "📁"),
                topic("mini-projects", "پروژه‌محور", "بازی یا ابزار کوچک", 8, "🎮"),
                topic("algorithms", "الگوریتم و پیچیدگی", "درک شهودی پیچیدگی زمانی", 9, "⏱️"),
                topic("advanced-structures", "ساختار داده پیشرفته", "پشته، صف و درخت مقدماتی", 10, "🌳"),
                topic("git", "Git و GitHub", "نسخه‌کنترل برای کار تیمی", 11, "🔀"),
                topic("web-basics", "مقدمه توسعه وب", "HTML/CSS/JS پایه — مسیر جانبی اختیاری", 12, "🌐"),
            ],
        },
        {
            "id": "ai",
            "title": "مدرسه هوش مصنوعی",
            "description": "پیش‌نیاز از ریاضی و برنامه‌نویسی — سپس داده، ML و پروژه نهایی",
            "order": 3,
            "icon": "ai",
            "topics": [
                topic("data-concept", "داده چیست؟", "مفهوم، انواع و جمع‌آوری داده", 1, "💾"),
                topic("numpy", "NumPy مقدماتی", "کار با آرایه و عدد در پایتون", 2, "🔢"),
                topic("pandas", "Pandas مقدماتی", "جدول داده", 3, "📋"),
                topic("matplotlib", "مصورسازی داده", "Matplotlib مقدماتی", 4, "📊"),
                topic("ml-intro", "مقدمه یادگیری ماشین", "نظارت‌شده در برابر بدون‌نظارت", 5, "🤖"),
                topic("linear-regression", "رگرسیون خطی", "اولین مدل با مثال ملموس", 6, "📈"),
                topic("classification", "طبقه‌بندی مقدماتی", "درخت تصمیم و نزدیک‌ترین همسایه", 7, "🌲"),
                topic("train-test", "آموزش و آزمایش مدل", "train/test و دقت", 8, "✅"),
                topic("neural-intro", "مقدمه شبکه عصبی", "درک شهودی بدون ریاضی سنگین", 9, "🧠"),
                topic("vision", "بینایی ماشین", "تشخیص تصویر ساده — پروژه‌محور", 10, "👁️"),
                topic("nlp", "پردازش زبان", "چت‌بات ساده — پروژه‌محور", 11, "💬"),
                topic("ai-ethics", "اخلاق در AI", "سوگیری، حریم خصوصی و استفاده درست", 12, "⚖️"),
                topic("ai-capstone", "پروژه نهایی AI", "یک مدل کوچک end-to-end", 13, "🛰️"),
            ],
        },
        {
            "id": "robotics",
            "title": "مدرسه رباتیک",
            "description": "پیش‌نیاز هندسه و مثلثات + برنامه‌نویسی پایه — سپس مدار، حسگر و پروژه",
            "order": 4,
            "icon": "robot",
            "topics": [
                topic("circuits", "مدار الکتریکی پایه", "جریان، ولتاژ و مقاومت شهودی", 1, "⚡"),
                topic("microcontroller", "میکروکنترلر", "Arduino یا مشابه", 2, "🔌"),
                topic("sensors", "حسگرها", "نور، فاصله، دما", 3, "📡"),
                topic("actuators", "محرک‌ها", "موتور و سروو", 4, "⚙️"),
                topic("robot-logic", "برنامه‌نویسی رباتیک", "منطق حسگر-محرک", 5, "🤖"),
                topic("mech-design", "ساخت مکانیکی ساده", "شاسی و اتصالات", 6, "🔧"),
                topic("line-follower", "پروژه: دنبال‌کننده خط", "رباتیک پروژه‌محور ۱", 7, "🛤️"),
                topic("obstacle", "پروژه: اجتناب از مانع", "رباتیک پروژه‌محور ۲", 8, "🚧"),
                topic("navigation", "مسیریابی مقدماتی", "الگوریتم‌های ساده ناوبری", 9, "🧭"),
                topic("ai-robotics", "AI در رباتیک", "بینایی برای تشخیص شیء — نیازمند AI", 10, "👁️"),
                topic("robot-capstone", "پروژه نهایی ربات", "ربات خودمختار ساده", 11, "🚀"),
            ],
        },
        {
            "id": "design",
            "title": "مدرسه طراحی",
            "description": "طراحی بصری، UX/UI و پروتوتایپ — پیش‌نیاز هندسه پایه؛ کدنویسی اختیاری",
            "order": 5,
            "icon": "design",
            "topics": [
                topic("visual-basics", "مبانی طراحی بصری", "نقطه، خط، شکل و فضای منفی", 1, "✏️"),
                topic("color-theory", "تئوری رنگ", "رنگ و کاربرد آن", 2, "🎨"),
                topic("typography", "تایپوگرافی پایه", "خوانایی و سلسله‌مراتب", 3, "🔤"),
                topic("composition", "ترکیب‌بندی", "گرید، تراز و ترکیب", 4, "▦"),
                topic("figma", "ابزار طراحی دیجیتال", "آشنایی با Figma یا مشابه", 5, "🖌️"),
                topic("character-icon", "کاراکتر و آیکون", "طراحی کاراکتر و آیکون ساده", 6, "🦄"),
                topic("ux-basics", "مبانی UX", "کاربر کیست و چه می‌خواهد", 7, "👤"),
                topic("ui-simple", "UI ساده", "طراحی رابط یک اپ فرضی", 8, "📱"),
                topic("prototype", "پروتوتایپ تعاملی", "بدون کد، در Figma", 9, "🔗"),
                topic("kids-a11y", "طراحی برای کودک و a11y", "دسترس‌پذیری پایه", 10, "♿"),
                topic("design-capstone", "پروژه نهایی طراحی", "از ایده تا پروتوتایپ کامل", 11, "🎯"),
            ],
        },
    ],
}

p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("ok", [s["id"] for s in data["subjects"]], "math topics", len(math_topics))
