import Link from "next/link";
import { Brain, Bot, Calculator, Code2, PenTool } from "lucide-react";
import { Container } from "@/components/ui/container";

const schools = [
  {
    title: "ریاضیات",
    href: "/curriculum/math",
    Icon: Calculator,
    cardClass: "bg-amber-50/90 border-amber-100",
    cubeClass: "from-amber-100 to-amber-50 text-amber-500 border-amber-200/70",
    available: true,
  },
  {
    title: "برنامه‌نویسی",
    href: "/curriculum/programming",
    Icon: Code2,
    cardClass: "bg-sky-50/90 border-sky-100",
    cubeClass: "from-sky-100 to-sky-50 text-sky-400 border-sky-200/70",
    available: false,
  },
  {
    title: "هوش مصنوعی",
    href: "/curriculum/ai",
    Icon: Brain,
    cardClass: "bg-indigo-50/90 border-indigo-100",
    cubeClass: "from-indigo-100 to-indigo-50 text-indigo-400 border-indigo-200/70",
    available: false,
  },
  {
    title: "رباتیک",
    href: "/curriculum/robotics",
    Icon: Bot,
    cardClass: "bg-emerald-50/90 border-emerald-100",
    cubeClass: "from-emerald-100 to-emerald-50 text-emerald-400 border-emerald-200/70",
    available: false,
  },
  {
    title: "طراحی",
    href: "/curriculum/design",
    Icon: PenTool,
    cardClass: "bg-orange-50/90 border-orange-100",
    cubeClass: "from-orange-100 to-orange-50 text-orange-400 border-orange-200/70",
    available: false,
  },
] as const;

interface ProgramSchoolsProps {
  lang?: string;
}

export function ProgramSchools({ lang = "fa" }: ProgramSchoolsProps) {
  return (
    <section id="program-schools" className="bg-white py-12 md:py-14 border-t border-slate-100">
      <Container>
        <div className="text-center mb-7 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">دروس و موضوعات</h2>
          <p className="text-sm text-slate-500 mt-2">
            یک موضوع را انتخاب کن و مسیر یادگیری را شروع کن
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {schools.map(({ title, href, Icon, cardClass, cubeClass, available }) => (
            <Link
              key={title}
              href={`/${lang}${href}`}
              className={`rounded-3xl border p-4 md:p-5 transition-transform duration-200 hover:-translate-y-1 block ${cardClass}`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`ice-cube w-16 h-16 border bg-gradient-to-br ${cubeClass}`}>
                  <span className="ice-cube-top" aria-hidden />
                  <span className="ice-cube-side" aria-hidden />
                  <span className="ice-cube-gloss" aria-hidden />
                  <Icon className="w-7 h-7 relative z-10" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-700 max-w-[12ch] leading-7">
                  {title}
                </h3>
                {!available ? (
                  <span className="text-[10px] font-semibold text-slate-400">به‌زودی</span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-600">شروع کن</span>
                )}
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link
            href={`/${lang}/curriculum`}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
          >
            مشاهده همه دروس ←
          </Link>
        </div>
      </Container>
    </section>
  );
}
