import type { Metadata } from "next";
import Link from "next/link";
import { MediaImage } from "@/components/public/media-image";
import { PageHero } from "@/components/public/page-hero";
import { formatDate } from "@/lib/utils";
import { getPublishedArticles, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "Actualités" };

export default async function NewsPage() {
  const [items, settings] = await Promise.all([getPublishedArticles(), getSettings()]);
  return (
    <>
      <PageHero title="Actualités & promotions" subtitle="Les nouvelles de DIM VOYAGES et les formules du moment." image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <Link key={item.id} href={`/actualites/${item.slug}`} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="relative h-48">
              <MediaImage src={item.imageUrl} alt={item.title} sizes="(max-width:768px) 100vw, 33vw" />
            </div>
            <div className="p-5">
              {item.publishedAt && <p className="text-xs font-semibold text-orange">{formatDate(item.publishedAt)}</p>}
              <h2 className="mt-1 text-xl font-bold text-navy">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
