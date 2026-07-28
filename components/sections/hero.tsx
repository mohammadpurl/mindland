import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Sparkles, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { AnimateIn } from "@/components/ui/animate-in";

export function Hero() {
  return (
    <section className="hero-section-bg relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="hero-overlay-radial absolute inset-0" />
        <div className="hero-overlay-linear absolute inset-0" />
        <div className="hero-overlay-cyan-glow absolute top-14 left-10 w-80 h-80 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex items-center py-24 md:py-32">
        <Container className="px-1 sm:px-4 lg:px-5">
          <div dir="ltr" className="grid grid-cols-1 lg:grid-cols-[1.22fr_0.92fr] gap-10 lg:gap-14 items-center">
            <AnimateIn delay={0.36} className="order-2 lg:order-1">
              <div className="relative max-w-[840px] mx-auto lg:ml-0 lg:mr-auto">
                <div className="hero-image-glow absolute -inset-7 rounded-[2.2rem] blur-3xl" />
                <div className="hero-image-shell relative rounded-[2.2rem] overflow-hidden">
                  <Image
                    src="/Images/Hero2.png"
                    alt="دانش‌آموز در حال یادگیری برنامه‌نویسی و هوش مصنوعی"
                    width={1024}
                    height={576}
                    className="w-full h-auto object-cover min-h-[380px] md:min-h-[460px]"
                    priority
                  />
                </div>
              </div>
            </AnimateIn>

            <div dir="rtl" className="order-1 lg:order-2">
              <AnimateIn delay={0} className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7">
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span className="text-xs font-bold text-indigo-100">
                  پلتفرم آموزش هوشمند کودکان
                </span>
              </AnimateIn>

              <AnimateIn delay={0.1} className="mb-5">
                <h1
                  className="font-extrabold text-white text-[clamp(2.3rem,7vw,4.2rem)] leading-[1.18] tracking-[-0.02em]"
                >
                  آینده فرزندت را از امروز بساز
                </h1>
              </AnimateIn>

              <AnimateIn delay={0.2} className="mb-10">
                <p className="text-base md:text-lg text-blue-100 leading-8 max-w-[720px]">
                  اولین پلتفرم ایرانی آموزش هوشمند برنامه‌نویسی، هوش مصنوعی، رباتیک و طراحی برای کودکان ۷ تا ۱۵ سال.
                  یادگیری لذت‌بخش با نتایج واقعی.
                </p>
              </AnimateIn>

              <AnimateIn delay={0.26} className="flex flex-wrap items-center gap-5 mb-8">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-slate-50">
                  <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ۴.۹ از ۵ (۱,۸۰۰ نظر والدین)
                </div>
                <div className="text-sm font-bold text-cyan-300">
                  بیش از ۱۸,۰۰۰ کودک فعال
                </div>
              </AnimateIn>

              <AnimateIn delay={0.3} className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div dir="ltr" className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link
                    href="/fa/signup"
                    className="hero-primary-cta inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-bold text-base text-white"
                  >
                    رایگان شروع کنید
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="hero-secondary-cta inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl font-bold text-base text-indigo-50"
                  >
                    مشاهده دمو کلاس
                    <PlayCircle className="w-4 h-4" />
                  </Link>
                </div>
              </AnimateIn>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
