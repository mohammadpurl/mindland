import { locales, isRTL, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  const locale = lang as Locale;
  const dir = isRTL(locale) ? "rtl" : "ltr";

  return <div dir={dir}>{children}</div>;
}
