import Image from "next/image";
import { Building2, MonitorPlay, Video } from "lucide-react";
import { Container } from "@/components/ui/container";

const formats = [
  {
    title: "دوره‌های آفلاین",
    subtitle: "با ویدئوهای ضبط‌شده",
    Icon: Video,
    desc: "یادگیری زمان‌محور نیست؛ کودک هر زمان آماده بود، ویدئوها را می‌بیند و تمرین‌ها را کامل می‌کند.",
    styleClass: "bg-blue-50 border-blue-100 text-blue-500",
  },
  {
    title: "دوره‌های حضوری",
    subtitle: "تعامل مستقیم با مربی",
    Icon: Building2,
    desc: "برای خانواده‌هایی که کلاس حضوری را ترجیح می‌دهند؛ با فضای آموزشی پویا و تمرین‌های گروهی.",
    styleClass: "bg-violet-50 border-violet-100 text-violet-500",
  },
  {
    title: "دوره‌های آنلاین",
    subtitle: "کلاس زنده و تعاملی",
    Icon: MonitorPlay,
    desc: "جلسات آنلاین منظم با مربی، رفع اشکال لحظه‌ای و گزارش پیشرفت برای والدین.",
    styleClass: "bg-emerald-50 border-emerald-100 text-emerald-500",
  },
] as const;

export function ClassFormats() {
  return (
    <section id="class-formats" className="py-14 md:py-16 bg-slate-50/55 border-t border-slate-100">
      <Container>
        <div dir="ltr" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          <div className="order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-[0_14px_38px_rgba(15,23,42,0.12)]">
              <Image
                src="/Images/teacherScroll3.png"
                alt="فضای آموزشی تصویری و جذاب مایلند برای کودکان"
                width={1456}
                height={816}
                className="w-full h-auto object-cover min-h-[300px] lg:min-h-[520px]"
              />
            </div>
          </div>

          <div dir="rtl" className="order-1 lg:order-2 lg:col-span-2">
            <header className="mb-5 md:mb-7">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">
                نحوه برگزاری کلاس‌ها و آموزش‌های مایلند
              </h2>
              <p className="text-sm md:text-base leading-8 text-slate-600 max-w-none mb-3">
                در مایلند، آموزش‌ها با رویکردی پروژه‌محور در حوزه هوش مصنوعی و برنامه‌نویسی برگزار می‌شوند تا هر دانشجو
                بتواند متناسب با هدف، شرایط و سبک یادگیری خودش مسیر مناسبی را انتخاب کند.
              </p>
              <p className="text-sm md:text-base leading-8 text-slate-600 max-w-none">
                سعی شده برای جذابیت آموزش برای کودکان از شخصیت‌های کارتونی در ارائه آموزش‌ها کمک گرفته شود و فضای آموزشی،
                یک فضای کاملا ویزوال و دیداری است که باعث ماندگاری و یادگیری عمیق می‌شود.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              {formats.map((item) => (
                <article key={item.title} className={`rounded-3xl border p-5 md:p-6 ${item.styleClass}`}>
                  <div className="w-12 h-12 rounded-xl bg-white/80 border border-white flex items-center justify-center mb-4">
                    <item.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 mb-3">{item.subtitle}</p>
                  <p className="text-sm leading-7 text-slate-600">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
