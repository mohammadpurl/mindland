import { Building2, ChartNoAxesCombined, GraduationCap, MessagesSquare, SmilePlus, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const resultCards = [
  {
    Icon: ChartNoAxesCombined,
    title: "۳۴٪ افزایش میانگین تکمیل دوره",
    body: "دانش‌آموزان ماینلند تکالیف و پروژه‌ها را منظم‌تر و با کیفیت بالاتر انجام می‌دهند.",
  },
  {
    Icon: SmilePlus,
    title: "۲ برابر مشارکت در کلاس آنلاین",
    body: "ترکیب بازی‌وارسازی، پروژه و بازخورد فوری باعث تعامل بیشتر کودکان می‌شود.",
  },
  {
    Icon: MessagesSquare,
    title: "۵۸٪ کاهش زمان آماده‌سازی معلم",
    body: "ابزارهای AI برای طراحی آزمون، اسلاید و محتوا زمان معلم را به‌طور ملموس آزاد می‌کند.",
  },
] as const;

const schoolLogos = ["دبستان نوآوران", "مدرسه مهر دانش", "آموزشگاه آینده‌ساز", "مدرسه هوشمند البرز"] as const;

export function TeacherWorld() {
  return (
    <section id="teacher-world" className="py-24" style={{ background: "#F8FAFC" }}>
      <Container>
        <Reveal className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6C5CE7", letterSpacing: "0.14em" }}>
            نتایج و اعتمادسازی
          </p>
          <h2
            className="font-extrabold mx-auto mb-5"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.7rem)", lineHeight: "1.35", color: "#0B0F19", maxWidth: "760px" }}
          >
            خانواده‌ها و مدارس
            {" "}
            <span style={{ backgroundImage: "linear-gradient(135deg, #6C5CE7, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              به خاطر نتیجه واقعی
            </span>
            {" "}ماینلند را انتخاب می‌کنند.
          </h2>
          <p className="mx-auto text-base" style={{ maxWidth: "700px", color: "#64748B", lineHeight: "1.9" }}>
            تمرکز ما فقط روی ظاهر جذاب نیست؛ معیار اصلی، پیشرفت قابل سنجش دانش‌آموز و صرفه‌جویی زمانی برای معلم است.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {resultCards.map((item) => (
            <StaggerItem key={item.title}>
              <div className="h-full rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}>
                  <item.Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#0F172A" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#475569", lineHeight: "1.8" }}>{item.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mb-8">
          <div className="rounded-2xl p-6 md:p-8" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
            <div className="flex items-center gap-2 mb-5">
              <Building2 className="w-5 h-5" style={{ color: "#6C5CE7" }} />
              <p className="font-bold" style={{ color: "#0F172A" }}>برخی مدارس و مراکز همکار</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {schoolLogos.map((logo) => (
                <div key={logo} className="h-12 rounded-xl flex items-center justify-center text-sm font-semibold" style={{ background: "#F8FAFC", color: "#475569", border: "1px solid rgba(15,23,42,0.08)" }}>
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal className="grid md:grid-cols-2 gap-5">
          <article className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
            <div className="inline-flex gap-1 mb-3" style={{ color: "#F59E0B" }}>
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <p className="text-sm mb-4" style={{ color: "#334155", lineHeight: "1.9" }}>
              «قبل از ماینلند نگران بودم پسرم فقط مصرف‌کننده موبایل باشد. الان هر هفته پروژه جدید نشان می‌دهد و اعتمادبه‌نفسش کاملا تغییر کرده.»
            </p>
            <p className="text-sm font-bold" style={{ color: "#0F172A" }}>مریم نادری - مادر دانش‌آموز ۱۱ ساله</p>
          </article>

          <article className="rounded-2xl p-6" style={{ background: "#FFFFFF", border: "1px solid rgba(15,23,42,0.08)" }}>
            <div className="inline-flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" style={{ color: "#6C5CE7" }} />
              <span className="text-sm font-bold" style={{ color: "#4338CA" }}>نظر معلم</span>
            </div>
            <p className="text-sm mb-4" style={{ color: "#334155", lineHeight: "1.9" }}>
              «با ابزار تولید محتوا و آزمون‌ساز ماینلند، زمان آماده‌سازی کلاس من خیلی کمتر شده و تمرکزم روی آموزش بهتر دانش‌آموزهاست.»
            </p>
            <p className="text-sm font-bold" style={{ color: "#0F172A" }}>خانم احمدی - معلم علوم کامپیوتر</p>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
