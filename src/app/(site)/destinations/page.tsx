import type { Metadata } from "next";
import { DestinationCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedDestinations, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.destinationsTitle };
}

export default async function DestinationsPage() {
  const [items, settings, locale] = await Promise.all([getPublishedDestinations(), getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return (
    <>
      <PageHero title={t.destinationsTitle} subtitle={t.destinationsText} image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {items.map((item) => (
          <DestinationCard key={item.id} href={`/destinations/${item.slug}`} name={item.name} imageUrl={item.imageUrl} />
        ))}
      </section>
    </>
  );
}
