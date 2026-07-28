import { BadgeCheck, Brain, Clock3, MonitorSmartphone, Users, WandSparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
const values = [
  {
    Icon: Brain,
    title: "یادگیری شخصی‌سازی‌شده با AI",
    body: "هر کودک مسیر مخصوص خودش را دارد؛ نه درس‌های یکسان برای همه.",
  },
  {
    Icon: MonitorSmartphone,
    title: "پلتفرم یکپارچه برای خانه و مدرسه",
    body: "دانش‌آموز، والد و معلم هم‌زمان تصویر شفافی از مسیر رشد دارند.",
  },
  {
    Icon: Clock3,
    title: "استفاده مفید از زمان آنلاین",
    body: "به‌جای مصرف محتوا، کودک شما پروژه می‌سازد، فکر می‌کند و مهارت می‌گیرد.",
  },
  {
    Icon: Users,
    title: "گزارش قابل فهم برای والدین",
    body: "پیشرفت هفتگی، نقاط قوت و نیازهای یادگیری به زبان ساده نمایش داده می‌شود.",
  },
  {
    Icon: WandSparkles,
    title: "ابزار تولید محتوا برای معلمان",
    body: "مشابه Canva اما آموزشی؛ ساخت آزمون، اسلاید و محتوای کلاسی در چند دقیقه.",
  },
  {
    Icon: BadgeCheck,
    title: "محتوای استاندارد و قابل اتکا",
    body: "مناسب سن ۷ تا ۱۵ سال، با چارچوب آموزشی روشن و پشتیبانی فارسی.",
  },
] as const;

/* ── Student World Section — Server Component ───────────── */
export function StudentWorld() {
  return (
    <section id="features" className="py-24" style={{ background: "#F8FAFC" }}>
      <Container>
        <Reveal className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6C5CE7", letterSpacing: "0.14em" }}>
            ارزش پیشنهادی ماینلند
          </p>
          <h2
            className="font-extrabold mx-auto mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.7rem)", lineHeight: "1.35", maxWidth: "760px", color: "#0F172A" }}
          >
            ترکیب یادگیری عمیق، فناوری مدرن
            {" "}
            <span style={{ backgroundImage: "linear-gradient(135deg, #6C5CE7, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              و تجربه جذاب برای کودک
            </span>
          </h2>
          <p className="mx-auto text-base" style={{ maxWidth: "700px", color: "#475569", lineHeight: "1.9" }}>
            ماینلند فقط یک دوره آنلاین نیست؛ یک اکوسیستم آموزشی کامل است که دغدغه آینده شغلی،
            خلاقیت و رشد مهارت‌های واقعی فرزند شما را پوشش می‌دهد.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((item) => (
            <StaggerItem key={item.title}>
              <div
                className="h-full rounded-2xl p-6"
                style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)", boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
                >
                  <item.Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#0F172A" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#475569", lineHeight: "1.8" }}>{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
