import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PricingPlans } from "@/components/sections/pricing-plans";

const compareRows = [
  { title: "دسترسی به دوره‌ها", free: "محدود", monthly: "کامل", annual: "کامل" },
  { title: "مسیر یادگیری شخصی AI", free: "پایه", monthly: "پیشرفته", annual: "پیشرفته" },
  { title: "گزارش پیشرفت والدین", free: "ماهانه", monthly: "هفتگی", annual: "هفتگی + تحلیل فصلی" },
  { title: "ابزار معلم (محتوا + آزمون)", free: "ندارد", monthly: "دارد", annual: "دارد" },
  { title: "پشتیبانی", free: "عمومی", monthly: "اولویت‌دار", annual: "VIP" },
] as const;

export function Pricing() {
  return (
    <section id="pricing" className="py-24" style={{ background: "#FFFFFF" }}>
      <Container>
        <Reveal className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6C5CE7", letterSpacing: "0.14em" }}>
            قیمت‌گذاری
          </p>
          <h2
            className="font-extrabold mx-auto mb-6"
            style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: "1.3", color: "#0B0F19" }}
          >
            پلن شفاف، انتخاب ساده
            {" "}
            <span style={{ backgroundImage: "linear-gradient(135deg, #6C5CE7, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              برای هر خانواده
            </span>
          </h2>
          <p className="text-base mx-auto" style={{ color: "#6B7280", lineHeight: "1.85", maxWidth: "540px" }}>
            بدون هزینه پنهان و بدون پیچیدگی. می‌توانید با پلن رایگان شروع کنید و هر زمان که نیاز داشتید ارتقا دهید.
          </p>
        </Reveal>

        <PricingPlans />

        <Reveal delay={0.2} className="mt-12 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(15,23,42,0.08)" }}>
          <div className="grid grid-cols-4 text-sm font-bold" style={{ background: "#F8FAFC", color: "#0F172A" }}>
            <div className="p-4">مقایسه امکانات</div>
            <div className="p-4 text-center">رایگان</div>
            <div className="p-4 text-center">ماهانه</div>
            <div className="p-4 text-center">سالانه</div>
          </div>
          {compareRows.map((row, index) => (
            <div
              key={row.title}
              className="grid grid-cols-4 text-sm"
              style={{ borderTop: "1px solid rgba(15,23,42,0.08)", background: index % 2 === 0 ? "#FFFFFF" : "#F8FAFC" }}
            >
              <div className="p-4 font-semibold" style={{ color: "#1E293B" }}>{row.title}</div>
              <div className="p-4 text-center" style={{ color: "#475569" }}>{row.free}</div>
              <div className="p-4 text-center font-semibold" style={{ color: "#334155" }}>{row.monthly}</div>
              <div className="p-4 text-center font-semibold" style={{ color: "#334155" }}>{row.annual}</div>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
