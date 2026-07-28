import { getArticlesByLang } from "@/lib/articles";
import { getLangOrDefault, getTranslations } from "@/lib/i18n";
import Link from "next/link";

type ArticlesPageProps = {
  params: Promise<{ lang: string }>;
};

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { lang: rawLang } = await params;
  const lang = getLangOrDefault(rawLang);
  const t = getTranslations(lang);
  const items = getArticlesByLang(lang);

  return (
    <main className="px-5 md:px-10 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="section-kicker">{t.articles.tag}</span>
          <h1 className="mt-4 font-display font-bold text-4xl md:text-6xl leading-tight">{t.articles.title}</h1>
          <p className="mt-4 text-foreground/80">{t.articles.sub}</p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-5">
          {items.map((article) => (
            <article key={article.slug} className="border border-border bg-card/30 p-6">
              <h2 className="text-2xl font-display font-semibold">{article.localized.title}</h2>
              <p className="mt-3 text-foreground/80 leading-7">{article.localized.excerpt}</p>
              <div className="mt-5 flex items-center gap-4">
                <Link href={`/${lang}/articles/${article.slug}`} className="text-neon hover:underline font-medium">
                  {t.articles.read}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
