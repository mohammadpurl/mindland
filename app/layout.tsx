import type { Metadata } from "next";
import "./globals.css";

/* Font is loaded via @fontsource-variable/vazirmatn in globals.css */

export const metadata: Metadata = {
  title: {
    template: "%s | مایلند",
    default: "مایلند — یادگیری هوشمند برای ذهن‌های کنجکاو",
  },
  description:
    "مایلند یک پلتفرم آموزشی هوشمند است. برای دانش‌آموزان: یادگیری با هوش مصنوعی، کدنویسی و خلاقیت. برای معلمان: ابزارهای تدریس مدرن، آزمون‌ساز و تولید محتوا.",
  keywords: [
    "پلتفرم آموزشی",
    "هوش مصنوعی",
    "یادگیری آنلاین",
    "آموزش کدنویسی",
    "ابزار تدریس",
  ],
  openGraph: {
    title:       "مایلند — یادگیری هوشمند",
    description: "پلتفرم هوشمند آموزشی برای دانش‌آموزان و معلمان",
    type:        "website",
    siteName:    "مایلند",
    locale:      "fa_IR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* Persian RTL: lang="fa" dir="rtl" on root */
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
