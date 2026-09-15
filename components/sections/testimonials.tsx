import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "دخترم از کلاس پنجم وارد مایلند شد. بعد از ۴ ماه خودش یک بازی ساده با Python ساخته و حالا عاشق حل مسئله شده.",
    author: "زهرا محمدی",
    role: "مادر دانش‌آموز پایه پنجم",
  },
  {
    id: 2,
    quote: "گزارش‌های هفتگی مایلند دقیق و قابل فهم است. بالاخره می‌دانم پسرم در کدام مهارت جلوتر است و کجا نیاز به حمایت دارد.",
    author: "امیرحسین ملکی",
    role: "پدر دانش‌آموز ۱۳ ساله",
  },
  {
    id: 3,
    quote: "با آزمون‌ساز و تولید محتوای AI، طراحی کلاس از ۳ ساعت به کمتر از ۱ ساعت رسیده و کیفیت خروجی بهتر شده است.",
    author: "مجید رضایی",
    role: "معلم ریاضی متوسطه اول",
  },
  {
    id: 4,
    quote: "قبل از مایلند نگران بودم پسرم فقط مصرف‌کننده موبایل باشد. الان هر هفته پروژه جدید نشان می‌دهد و اعتمادبه‌نفسش کاملا تغییر کرده.",
    author: "مریم نادری",
    role: "مادر دانش‌آموز ۱۱ ساله",
  },
  {
    id: 5,
    quote: "با ابزار تولید محتوا و آزمون‌ساز مایلند، زمان آماده‌سازی کلاس من خیلی کمتر شده و تمرکزم روی آموزش بهتر دانش‌آموزهاست.",
    author: "خانم احمدی",
    role: "معلم علوم کامپیوتر",
  },
];

export function Testimonials() {
  return (
    <section className="py-24" style={{ background: "#0B0F19" }}>
      <Container>
        <Reveal className="text-center mb-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#A5B4FC", letterSpacing: "0.14em" }}
          >
            صدای کاربران
          </p>
          <h2
            className="font-extrabold mx-auto mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: "1.35", color: "#F8FAFC", maxWidth: "700px" }}
          >
            تجربه واقعی خانواده‌ها و معلمان{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #818CF8, #38BDF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              بعد از استفاده از مایلند
            </span>
          </h2>
          <p className="text-sm mx-auto" style={{ color: "#94A3B8", maxWidth: "520px", lineHeight: "1.9" }}>
            نظرات زیر از جنس دغدغه‌های واقعی والدین ایرانی و نیازهای روزمره معلمان طراحی شده‌اند تا تصمیم‌گیری برای شما ساده‌تر شود.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((item, i) => (
            <Reveal key={item.id} delay={0.08 * i}>
              <article className="h-full rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Quote className="w-5 h-5 mb-4" style={{ color: "#A5B4FC" }} />
                <p className="text-sm mb-5" style={{ color: "#CBD5E1", lineHeight: "1.9" }}>
                  «{item.quote}»
                </p>
                <p className="text-sm font-bold" style={{ color: "#F1F5F9" }}>{item.author}</p>
                <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{item.role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
