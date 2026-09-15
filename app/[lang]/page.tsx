/**
 * Landing Page — مایلند (Mindland Persian)
 *
 * Section rhythm (DS §3 — no two adjacent sections share a background,
 * with one dark anchor mid-page and the dark footer to close):
 *   Hero            → #0B0F19  Dark    — cinematic entry
 *   ProgramSchools  → #FFFFFF  Light   — subject picker
 *   ClassFormats    → slate-50 Soft    — how classes run
 *   FreeCourse      → #FFFFFF  Light   — free trial CTA
 *   StudentWorld    → #F8FAFC  Soft    — value proposition (bento)
 *   TeacherWorld    → #FFFFFF  Light   — results + partner logos
 *   HowItWorks      → #F8FAFC  Soft    — 3-step numbered path
 *   Testimonials    → #0B0F19  Dark    — social proof (mid-page anchor)
 *   Pricing         → #FFFFFF  Light   — plans + comparison
 *   Footer          → #0B0F19  Dark    — clean close
 *
 * NOTE: the StudentWorld / TeacherWorld component names are historical —
 * they now render the value-proposition and results/trust blocks.
 */

import { Navbar }       from "@/components/nav/navbar";
import { Hero }         from "@/components/sections/hero";
import { ProgramSchools } from "@/components/sections/program-schools";
import { ClassFormats } from "@/components/sections/class-formats";
import { FreeCourse } from "@/components/sections/free-course";
import { StudentWorld } from "@/components/sections/student-world";
import { TeacherWorld } from "@/components/sections/teacher-world";
import { HowItWorks }   from "@/components/sections/how-it-works";
import { Testimonials } from "@/components/sections/testimonials";
import { Pricing }      from "@/components/sections/pricing";
import { SiteFooter }   from "@/components/sections/site-footer";
import { type Locale, locales } from "@/lib/i18n";
import type { Metadata } from "next";

type Props = { params: Promise<{ lang: string }> };
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindland.ir";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const canonicalUrl = `${siteUrl}/${lang}`;

  return {
    title: "آموزش برنامه‌نویسی و هوش مصنوعی برای کودکان ۷ تا ۱۵ سال",
    description:
      "مایلند پلتفرم ایرانی آموزش هوشمند برنامه‌نویسی، هوش مصنوعی، رباتیک و طراحی برای کودکان ۷ تا ۱۵ سال است. مسیر یادگیری پروژه‌محور، گزارش پیشرفت والدین و ابزار تدریس برای معلمان.",
    keywords: [
      "آموزش برنامه نویسی کودکان",
      "آموزش هوش مصنوعی برای کودکان",
      "مایلند",
      "رباتیک کودکان",
      "آموزش طراحی سایت کودکان",
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title: "مایلند | آموزش هوشمند برنامه‌نویسی و AI برای کودکان",
      description:
        "یادگیری پروژه‌محور برنامه‌نویسی، هوش مصنوعی و رباتیک برای کودکان ۷ تا ۱۵ سال با مسیر شخصی‌سازی‌شده.",
      url: canonicalUrl,
      siteName: "مایلند",
      locale: lang === "fa" ? "fa_IR" : "en_US",
      type: "website",
      images: [
        {
          url: `${siteUrl}/Images/Hero2.png`,
          width: 1024,
          height: 576,
          alt: "مایلند - آموزش برنامه‌نویسی و هوش مصنوعی برای کودکان",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "مایلند | آموزش برنامه‌نویسی و AI برای کودکان",
      description:
        "پلتفرم هوشمند آموزش برنامه‌نویسی، هوش مصنوعی، رباتیک و طراحی برای کودکان ۷ تا ۱۵ سال.",
      images: [`${siteUrl}/Images/Hero2.png`],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LandingPage({ params }: Props) {
  const { lang } = await params;
  const locale = lang as Locale;

  return (
    <main className="overflow-x-hidden pb-24 md:pb-0">
      <Navbar lang={locale} />

      {/* Hero pulled up under sticky nav */}
      <div className="-mt-16">
        <Hero lang={locale} />
      </div>

      <ProgramSchools lang={locale} />
      <ClassFormats />
      <FreeCourse lang={locale} />
      <StudentWorld />
      <TeacherWorld />
      <HowItWorks />
      <Testimonials />
      <Pricing lang={locale} />
      <SiteFooter lang={locale} />
    </main>
  );
}
