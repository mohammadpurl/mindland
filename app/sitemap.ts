import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindland.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "about", "articles"];

  return locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: path ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: path ? 0.8 : 1,
      lastModified: new Date(),
    }))
  );
}
