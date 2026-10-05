import type { Metadata } from "next";
import Link from "next/link";
import { MediaImage } from "@/components/public/media-image";
import { PageHero } from "@/components/public/page-hero";
import { formatDate } from "@/lib/utils";
import { getPublishedArticles, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.newsTitle };
}

export default async function NewsPage() {
  const [items, settings, locale] = await Promise.all([getPublishedArticles(), getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return (
    <>
      <PageHero title={t.newsTitle} subtitle={t.newsText} image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <Link key={item.id} href={`/actualites/${item.slug}`} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-48">
              <MediaImage src={item.imageUrl} alt={item.title} sizes="(max-width:768px) 100vw, 33vw" />
            </div>
            <div className="p-5">
              {item.publishedAt && <p className="text-xs font-semibold text-orange">{formatDate(item.publishedAt, locale)}</p>}
              <h2 className="mt-1 text-xl font-bold text-navy">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
