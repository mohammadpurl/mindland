/**
 * Footer — Persian RTL
 */

import Link from "next/link";
import { Sparkles } from "lucide-react";

interface SiteFooterProps {
  lang?: string;
}

export function SiteFooter({ lang = "fa" }: SiteFooterProps) {
  const navColumns = [
    {
      heading: "محصول",
      links: [
        { label: "دروس", href: `/${lang}/curriculum` },
        { label: "ویژگی‌ها", href: `/${lang}#features` },
        { label: "نحوه کار", href: `/${lang}#how-it-works` },
        { label: "قیمت‌گذاری", href: `/${lang}#pricing` },
      ],
    },
    {
      heading: "شرکت",
      links: [
        { label: "درباره ما", href: `/${lang}/about` },
        { label: "وبلاگ", href: `/${lang}/articles` },
        { label: "فرصت‌های شغلی", href: "#" },
      ],
    },
    {
      heading: "پشتیبانی",
      links: [
        { label: "تماس با ما", href: "#" },
        { label: "سوالات متداول", href: "#" },
        { label: "حریم خصوصی", href: "#" },
      ],
    },
  ];

  return (
    <footer className="py-16" style={{ background: "#0B0F19" }}>
      <div className="max-w-[1200px] xl:max-w-[1360px] 2xl:max-w-[1440px] mx-auto px-4 sm:px-5 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-16 mb-16">
          <div>
            <Link href={`/${lang}`} className="flex items-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">مایلند</span>
            </Link>
            <p className="text-sm" style={{ color: "#94A3B8", lineHeight: "1.75", maxWidth: "180px" }}>
              یادگیری هوشمند برای ذهن‌های کنجکاو.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {navColumns.map((col) => (
              <div key={col.heading}>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#94A3B8", letterSpacing: "0.1em" }}
                >
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-4">
                  {col.links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm transition-colors duration-150 hover:text-white"
                        style={{ color: "#94A3B8" }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            © {new Date().getFullYear()} مایلند. تمامی حقوق محفوظ است.
          </p>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            ساخته‌شده با{" "}
            <span style={{ color: "#6C5CE7" }}>هوش مصنوعی</span>
            {" "}برای نسل بعدی یادگیرندگان.
          </p>
        </div>
      </div>
    </footer>
  );
}
