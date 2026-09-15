import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";

const plans = [
  {
    key: "free",
    name: "رایگان",
    price: "۰ تومان",
    unit: "/ همیشه رایگان",
    description: "برای آشنایی اولیه با محیط و سبک آموزشی مایلند",
    features: ["۱ دانش‌آموز", "دسترسی محدود به دوره‌ها", "گزارش پایه پیشرفت", "پشتیبانی عمومی"],
    cta: "شروع رایگان",
    href: "/signup",
    featured: false,
  },
  {
    key: "monthly",
    name: "ماهانه",
    price: "۴۹۹٬۰۰۰ تومان",
    unit: "/ ماه",
    description: "پلن استاندارد خانواده برای یادگیری مستمر و پروژه‌محور",
    features: ["تا ۲ دانش‌آموز", "دسترسی کامل به دوره‌ها", "مسیر AI شخصی‌سازی‌شده", "گزارش هفتگی والدین", "پشتیبانی اولویت‌دار"],
    cta: "شروع ۷ روز آزمایشی",
    href: "/signup",
    featured: true,
  },
  {
    key: "annual",
    name: "سالانه",
    price: "۴٬۷۹۰٬۰۰۰ تومان",
    unit: "/ سال",
    description: "به‌صرفه‌ترین انتخاب برای خانواده‌های جدی با تخفیف ویژه",
    features: ["تمام امکانات پلن ماهانه", "۱۵٪ تخفیف نسبت به ماهانه", "مشاوره آموزشی فصلی", "اولویت در کلاس‌های جدید"],
    cta: "رزرو پلن سالانه",
    href: "/signup",
    featured: false,
  },
] as const;

interface PricingPlansProps {
  lang?: string;
}

export function PricingPlans({ lang = "fa" }: PricingPlansProps) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <Reveal
            key={plan.key}
            delay={0.08 * i}
          >
            <div
              className="h-full p-8 rounded-2xl flex flex-col relative overflow-hidden"
              style={
                plan.featured
                  ? {
                      background:  "linear-gradient(#fff,#fff) padding-box, linear-gradient(135deg,#6C5CE7,#3B82F6) border-box",
                      border:      "2px solid transparent",
                      boxShadow:   "0 8px 40px rgba(108,92,231,0.18)",
                    }
                  : {
                      background:  "#FFFFFF",
                      border:      "1px solid rgba(0,0,0,0.06)",
                      boxShadow:   "0 2px 12px rgba(0,0,0,0.04)",
                    }
              }
            >
              {plan.featured && (
                <div
                  className="absolute top-6 left-6 px-3 py-1 rounded-full text-xs font-bold text-white inline-flex items-center gap-1"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
                >
                  <Sparkles className="w-3 h-3" />
                  پیشنهادی
                </div>
              )}

              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6C5CE7", letterSpacing: "0.12em" }}>
                {plan.name}
              </p>

              <div className="mb-4 flex items-end gap-2">
                <span className="font-extrabold" style={{ fontSize: "1.7rem", color: "#0B0F19", lineHeight: "1" }}>
                  {plan.price}
                </span>
                <span className="text-xs mb-1" style={{ color: "#6B7280" }}>{plan.unit}</span>
              </div>

              <p className="text-sm mb-8" style={{ color: "#6B7280", lineHeight: "1.75", maxWidth: "none" }}>
                {plan.description}
              </p>

              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-4">
                    <Check className="w-4 h-4 shrink-0" style={{ color: plan.featured ? "#6C5CE7" : "#00FFB2" }} />
                    <span className="text-sm" style={{ color: "#374151" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}${plan.href}`}
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl font-bold text-sm mt-auto"
                style={
                  plan.featured
                    ? { background: "linear-gradient(135deg, #6C5CE7, #3B82F6)", color: "#fff", boxShadow: "0 8px 32px rgba(108,92,231,0.3)" }
                    : { border: "1px solid rgba(0,0,0,0.1)", color: "#0B0F19", background: "transparent" }
                }
              >
                {plan.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
  );
}
