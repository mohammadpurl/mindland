"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  House,
  LayoutTemplate,
  Route,
  BookOpen,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  lang: string;
}

const navLinks = [
  { label: "دروس", href: "/curriculum" },
  { label: "ویژگی‌ها", href: "/#features" },
  { label: "نحوه کار", href: "/#how-it-works" },
  { label: "قیمت‌گذاری", href: "/#pricing" },
] as const;

const mobileDockLinks = [
  { label: "خانه", href: "/", Icon: House },
  { label: "دروس", href: "/curriculum", Icon: BookOpen },
  { label: "ویژگی‌ها", href: "/#features", Icon: LayoutTemplate },
  { label: "مسیر", href: "/#how-it-works", Icon: Route },
  { label: "پلن‌ها", href: "/#pricing", Icon: WalletCards },
] as const;

function resolveHref(lang: string, href: string) {
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`;
  if (href === "/") return `/${lang}`;
  if (href.startsWith("/")) return `/${lang}${href}`;
  return href;
}

export function Navbar({ lang }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#1E1B4B]/85 backdrop-blur-2xl border-b border-white/10"
            : "bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/5"
        )}
      >
        <nav
          dir="ltr"
          className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        >
          <Link
            href={`/${lang}/signup`}
            className="nav-glass-cta inline-flex items-center h-10 px-4 rounded-xl text-xs sm:text-sm font-bold text-white"
          >
            شروع رایگان
          </Link>

          <div dir="rtl" className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={resolveHref(lang, href)}
                className="px-4 py-2 text-sm text-slate-200 hover:text-white rounded-xl hover:bg-white/10 transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </div>

          <Link href={`/${lang}`} className="flex items-center gap-2 shrink-0">
            <div className="nav-logo-badge w-8 h-8 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight select-none">
              مایلند
            </span>
          </Link>
        </nav>
      </motion.header>

      <div className="md:hidden fixed bottom-4 inset-x-0 z-[60] px-4">
        <div className="nav-mobile-dock mx-auto max-w-[680px] rounded-[1.8rem] px-3 py-2">
          <div className="grid grid-cols-5 gap-1">
            {mobileDockLinks.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={resolveHref(lang, href)}
                className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] text-slate-200"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
