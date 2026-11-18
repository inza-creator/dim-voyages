import type { Metadata } from "next";
import { OffersExplorer } from "@/components/public/offers-explorer";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedDestinations, getPublishedOffers, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return pageMetadata({ title: t.offersTitle, description: t.offersText, path: "/offres", image: settings.heroImageUrl, locale });
}

export default async function OffersPage() {
  const [items, destinations, settings, locale] = await Promise.all([getPublishedOffers(), getPublishedDestinations(), getSettings(), getLocale()]);
  const t = copy(locale);
  return (
    <>
      <PageHero
        title={t.pages.offersTitle}
        subtitle={t.pages.offersText}
        image={settings.heroImageUrl}
        breadcrumbs={[{ href: "/", label: t.offer.home }, { label: t.pages.offersTitle }]}
      />
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <OffersExplorer
          offers={items.map((offer) => ({
            id: offer.id,
            slug: offer.slug,
            title: offer.title,
            destinationLabel: offer.destinationLabel,
            destinationId: offer.destinationId,
            priceFrom: offer.priceFrom,
            badge: offer.badge,
            imageUrl: offer.imageUrl,
            imageUrl2: offer.imageUrl2,
            imageUrl3: offer.imageUrl3,
            featured: offer.featured,
            sortOrder: offer.sortOrder,
          }))}
          destinations={destinations.map((item) => ({ id: item.id, name: item.name }))}
          labels={t.offer.filters}
          fromLabel={t.cards.from}
        />
      </section>
    </>
  );
}
