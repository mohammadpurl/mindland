import { Brain, Bot, Code2, Gamepad2, PenTool } from "lucide-react";
import { Container } from "@/components/ui/container";

const schools = [
  {
    title: "مدرسه طراحی سایت",
    Icon: PenTool,
    cardClass: "bg-orange-50/90 border-orange-100",
    cubeClass: "from-orange-100 to-orange-50 text-orange-400 border-orange-200/70",
  },
  {
    title: "مدرسه بازی‌سازی",
    Icon: Gamepad2,
    cardClass: "bg-violet-50/90 border-violet-100",
    cubeClass: "from-violet-100 to-violet-50 text-violet-400 border-violet-200/70",
  },
  {
    title: "مدرسه برنامه‌نویسی",
    Icon: Code2,
    cardClass: "bg-sky-50/90 border-sky-100",
    cubeClass: "from-sky-100 to-sky-50 text-sky-400 border-sky-200/70",
  },
  {
    title: "مدرسه رباتیک",
    Icon: Bot,
    cardClass: "bg-emerald-50/90 border-emerald-100",
    cubeClass: "from-emerald-100 to-emerald-50 text-emerald-400 border-emerald-200/70",
  },
  {
    title: "مدرسه هوش مصنوعی",
    Icon: Brain,
    cardClass: "bg-indigo-50/90 border-indigo-100",
    cubeClass: "from-indigo-100 to-indigo-50 text-indigo-400 border-indigo-200/70",
  },
] as const;

export function ProgramSchools() {
  return (
    <section id="program-schools" className="bg-white py-12 md:py-14 border-t border-slate-100">
      <Container>
        <div className="text-center mb-7 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800">دوره‌های ما</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {schools.map(({ title, Icon, cardClass, cubeClass }) => (
            <article
              key={title}
              className={`rounded-3xl border p-4 md:p-5 transition-transform duration-200 hover:-translate-y-1 ${cardClass}`}
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
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
