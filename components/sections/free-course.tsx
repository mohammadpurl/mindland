import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Boxes, Headset, MessageSquareText } from "lucide-react";
import { Container } from "@/components/ui/container";

const features = [
  {
    title: "مشاوره تخصصی",
    body: "بررسی مسیر یادگیری کودک و انتخاب مناسب‌ترین برنامه آموزشی.",
    Icon: MessageSquareText,
  },
  {
    title: "پروژه عملی",
    body: "انجام یک پروژه واقعی برای تقویت مهارت و تجربه عملی دانش‌آموز.",
    Icon: Boxes,
  },
  {
    title: "پشتیبانی",
    body: "همراهی کامل تیم آموزشی برای پاسخ به سوالات و رفع اشکال.",
    Icon: Headset,
  },
  {
    title: "دریافت مدرک",
    body: "پس از پایان مسیر رایگان، گواهی شرکت در دوره ارائه می‌شود.",
    Icon: BadgeCheck,
  },
] as const;

interface FreeCourseProps {
  lang?: string;
}

export function FreeCourse({ lang = "fa" }: FreeCourseProps) {
  return (
    <section id="free-course" className="bg-white py-14 md:py-16 border-t border-slate-100">
      <Container>
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-3">
            دوره رایگان آکادمی مایلند
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-8 max-w-[900px] mx-auto">
            با ثبت‌نام در دوره رایگان مایلند، می‌توانید فضای واقعی آموزش هوش مصنوعی و برنامه‌نویسی را تجربه کنید
            و علاقه و توانایی فرزندتان را در این مسیر بسنجید.
          </p>
          <Link
            href={`/${lang}/signup`}
            className="inline-flex mt-4 h-11 px-6 items-center justify-center rounded-xl font-bold text-sm text-white bg-hero-gradient shadow-glow-sm"
          >
            شروع رایگان
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-center">
          <div className="grid grid-cols-1 gap-4">
            {[features[0], features[2]].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-indigo-50/40 p-5 md:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-7 mt-1 max-w-none">{item.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="relative flex justify-center py-2">
            <Image
              src="/Images/FreeCourse.webp"
              alt="ربات آموزشی مایلند در دوره رایگان"
              width={360}
              height={480}
              className="w-[230px] md:w-[280px] h-auto object-contain drop-shadow-[0_18px_30px_rgba(30,64,175,0.22)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[features[1], features[3]].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50/70 to-indigo-50/40 p-5 md:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                    <item.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-7 mt-1 max-w-none">{item.body}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
