/**
 * Footer — Persian RTL
 * DS §3  bg: #0B0F19
 * DS §5  py-16 (64px)
 * DS §4  Small: 14px/20px
 * Clean: logo + columns + copyright
 */

import Link from "next/link";
import { Sparkles } from "lucide-react";

const navColumns = [
  {
    heading: "محصول",
    links: [
      { label: "ویژگی‌ها", href: "#features" },
      { label: "نحوه کار", href: "#how-it-works" },
      { label: "اعتماد کاربران", href: "#teacher-world" },
      { label: "قیمت‌گذاری", href: "#pricing" },
    ],
  },
  {
    heading: "شرکت",
    links: [
      { label: "درباره ما",     href: "#" },
      { label: "وبلاگ",        href: "#" },
      { label: "فرصت‌های شغلی", href: "#" },
    ],
  },
  {
    heading: "پشتیبانی",
    links: [
      { label: "تماس با ما",   href: "#" },
      { label: "سوالات متداول", href: "#" },
      { label: "حریم خصوصی",  href: "#" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="py-16" style={{ background: "#0B0F19" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-16 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">ماینلند</span>
            </Link>
            <p className="text-sm" style={{ color: "#6B7280", lineHeight: "1.75", maxWidth: "180px" }}>
              یادگیری هوشمند برای ذهن‌های کنجکاو.
            </p>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {navColumns.map((col) => (
              <div key={col.heading}>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-4"
                  style={{ color: "#4B5563", letterSpacing: "0.1em" }}
                >
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-4">
                  {col.links.map(({ label, href }) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-sm transition-colors duration-150 hover:text-white"
                        style={{ color: "#6B7280" }}
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

        {/* Divider */}
        <div className="mb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "#4B5563" }}>
            © {new Date().getFullYear()} ماینلند. تمامی حقوق محفوظ است.
          </p>
          <p className="text-xs" style={{ color: "#4B5563" }}>
            ساخته‌شده با{" "}
            <span style={{ color: "#6C5CE7" }}>هوش مصنوعی</span>
            {" "}برای نسل بعدی یادگیرندگان.
          </p>
        </div>
      </div>
    </footer>
  );
}
