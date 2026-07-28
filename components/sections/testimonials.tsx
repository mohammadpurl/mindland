import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "دخترم از کلاس پنجم وارد ماینلند شد. بعد از ۴ ماه خودش یک بازی ساده با Python ساخته و حالا عاشق حل مسئله شده.",
    author: "زهرا محمدی",
    role: "مادر دانش‌آموز پایه پنجم",
  },
  {
    id: 2,
    quote: "گزارش‌های هفتگی ماینلند دقیق و قابل فهم است. بالاخره می‌دانم پسرم در کدام مهارت جلوتر است و کجا نیاز به حمایت دارد.",
    author: "امیرحسین ملکی",
    role: "پدر دانش‌آموز ۱۳ ساله",
  },
  {
    id: 3,
    quote: "با آزمون‌ساز و تولید محتوای AI، طراحی کلاس از ۳ ساعت به کمتر از ۱ ساعت رسیده و کیفیت خروجی بهتر شده است.",
    author: "مجید رضایی",
    role: "معلم ریاضی متوسطه اول",
  },
];

export function Testimonials() {
  return (
    <section className="py-24" style={{ background: "#FFFFFF" }}>
      <Container>
        <Reveal className="text-center mb-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: "#6C5CE7", letterSpacing: "0.14em" }}
          >
            صدای کاربران
          </p>
          <h2
            className="font-extrabold mx-auto mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: "1.35", color: "#0F172A", maxWidth: "700px" }}
          >
            تجربه واقعی خانواده‌ها و معلمان{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, #6C5CE7, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              بعد از استفاده از ماینلند
            </span>
          </h2>
          <p className="text-sm mx-auto" style={{ color: "#64748B", maxWidth: "520px", lineHeight: "1.9" }}>
            نظرات زیر از جنس دغدغه‌های واقعی والدین ایرانی و نیازهای روزمره معلمان طراحی شده‌اند تا تصمیم‌گیری برای شما ساده‌تر شود.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((item, i) => (
            <Reveal key={item.id} delay={0.1 * i}>
              <article className="h-full rounded-2xl p-6" style={{ background: "#F8FAFC", border: "1px solid rgba(15,23,42,0.08)" }}>
                <Quote className="w-5 h-5 mb-4" style={{ color: "#6C5CE7" }} />
                <p className="text-sm mb-5" style={{ color: "#334155", lineHeight: "1.9" }}>
                  «{item.quote}»
                </p>
                <p className="text-sm font-bold" style={{ color: "#0F172A" }}>{item.author}</p>
                <p className="text-xs mt-1" style={{ color: "#64748B" }}>{item.role}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
