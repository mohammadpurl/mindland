import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BookOpen, Compass, Rocket } from "lucide-react";

const steps = [
  {
    Icon: BookOpen,
    title: "۱) ارزیابی و انتخاب مسیر",
    body: "سن، سطح مهارتی و علاقه فرزندتان ثبت می‌شود تا مسیر مناسب برنامه‌نویسی، هوش مصنوعی، طراحی سایت یا رباتیک پیشنهاد شود.",
  },
  {
    Icon: Compass,
    title: "۲) یادگیری تعاملی و پروژه‌محور",
    body: "دانش‌آموز با درس‌های کوتاه، تمرین‌های هدفمند و پروژه واقعی پیش می‌رود و معلم با AI محتوای کلاس را سریع آماده می‌کند.",
  },
  {
    Icon: Rocket,
    title: "۳) گزارش پیشرفت و ارتقای مهارت",
    body: "والدین گزارش واضح هفتگی دریافت می‌کنند، نقاط ضعف مشخص می‌شود و مسیر یادگیری برای رشد مداوم به‌روزرسانی می‌شود.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" style={{ background: "#FFFFFF" }}>
      <Container>
        <Reveal className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6C5CE7", letterSpacing: "0.14em" }}>
            چگونه کار می‌کند
          </p>
          <h2
            className="font-extrabold mx-auto mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: "1.4", color: "#0B0F19", maxWidth: "700px" }}
          >
            مسیر شفاف از ثبت‌نام تا نتیجه واقعی
          </h2>
          <p className="mx-auto text-base" style={{ color: "#64748B", maxWidth: "680px", lineHeight: "1.9" }}>
            بدون پیچیدگی؛ در سه مرحله مشخص، فرزند شما وارد یک مسیر آموزشی هدفمند می‌شود و شما همیشه در جریان پیشرفت او هستید.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <Reveal key={step.title}>
              <article
                className="h-full rounded-2xl p-6 md:p-7"
                style={{ background: "#F8FAFC", border: "1px solid rgba(15,23,42,0.08)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
                >
                  <step.Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold mb-3" style={{ color: "#0F172A" }}>{step.title}</h3>
                <p className="text-sm" style={{ color: "#475569", lineHeight: "1.9" }}>{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
