import { getArticleBySlug } from "@/lib/articles";
import { getLangOrDefault, getTranslations } from "@/lib/i18n";
import Link from "next/link";
import { notFound } from "next/navigation";

type ArticlePageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { lang: rawLang, slug } = await params;
  const lang = getLangOrDefault(rawLang);
  const t = getTranslations(lang);
  const article = getArticleBySlug(lang, slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="px-5 md:px-10 py-24">
      <article className="max-w-4xl mx-auto">
        <Link href={`/${lang}/articles`} className="text-sm text-muted-foreground hover:text-foreground">
          {t.articles.back}
        </Link>
        <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold leading-tight">{article.localized.title}</h1>
        <p className="mt-4 text-lg text-foreground/80 leading-8">{article.localized.excerpt}</p>

        <div className="mt-8 space-y-5">
          {article.localized.content.map((paragraph, index) => (
            <p key={index} className="text-foreground/85 leading-8 text-base md:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}
