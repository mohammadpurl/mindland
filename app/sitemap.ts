import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getCurriculum } from "@/lib/math-visual-engine/curriculum";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mindland.ir";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "about", "articles", "curriculum"];
  const curriculum = getCurriculum();

  const subjectPaths = curriculum.subjects.flatMap((subject) => {
    const base = `curriculum/${subject.id}`
    const topics = subject.topics.map((t) => `${base}/${t.id}`)
    return [base, ...topics]
  })

  const lessonPaths = curriculum.subjects.flatMap((subject) =>
    subject.topics.flatMap((topic) =>
      topic.lessons.map((lesson) => `lessons/math-visual/${lesson.id}`)
    )
  );

  const allPaths = [...staticPaths, ...subjectPaths, ...lessonPaths];

  return locales.flatMap((locale) =>
    allPaths.map((path) => ({
      url: path ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "curriculum" ? 0.9 : 0.8,
      lastModified: new Date(),
    }))
  );
}
