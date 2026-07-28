import { NextResponse } from "next/server";
import { defaultLang, locales } from "@/lib/i18n";

export function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => {
    return pathname === `/${locale}` || pathname.startsWith(`/${locale}/`);
  });

  if (!hasLocale) {
    return NextResponse.redirect(new URL(`/${defaultLang}${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};