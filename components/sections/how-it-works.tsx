import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BookOpen, Compass, Rocket } from "lucide-react";

const steps = [
  {
    n: "۱",
    Icon: BookOpen,
    title: "ارزیابی و انتخاب مسیر",
    body: "سن، سطح مهارتی و علاقه فرزندتان ثبت می‌شود تا مسیر مناسب برنامه‌نویسی، هوش مصنوعی، طراحی سایت یا رباتیک پیشنهاد شود.",
  },
  {
    n: "۲",
    Icon: Compass,
    title: "یادگیری تعاملی و پروژه‌محور",
    body: "دانش‌آموز با درس‌های کوتاه، تمرین‌های هدفمند و پروژه واقعی پیش می‌رود و معلم با AI محتوای کلاس را سریع آماده می‌کند.",
  },
  {
    n: "۳",
    Icon: Rocket,
    title: "گزارش پیشرفت و ارتقای مهارت",
    body: "والدین گزارش واضح هفتگی دریافت می‌کنند، نقاط ضعف مشخص می‌شود و مسیر یادگیری برای رشد مداوم به‌روزرسانی می‌شود.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24" style={{ background: "#F8FAFC" }}>
      <Container>
        <Reveal className="text-center mb-14">
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

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {/* connector rail — desktop only */}
          <div
            aria-hidden
            className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(108,92,231,0.35) 20%, rgba(108,92,231,0.35) 80%, transparent)" }}
          />
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <div className="relative flex flex-col items-center text-center px-2">
                <div
                  className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 font-extrabold text-white text-xl"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)", boxShadow: "0 12px 26px rgba(108,92,231,0.3)" }}
                >
                  {step.n}
                </div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <step.Icon className="w-4 h-4" style={{ color: "#6C5CE7" }} />
                  <h3 className="font-bold" style={{ color: "#0F172A" }}>{step.title}</h3>
                </div>
                <p className="text-sm" style={{ color: "#475569", lineHeight: "1.9", maxWidth: "320px" }}>{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
