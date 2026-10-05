import type { Metadata } from "next";
import { OfferCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedOffers, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.offersTitle };
}

export default async function OffersPage() {
  const [items, settings, locale] = await Promise.all([getPublishedOffers(), getSettings(), getLocale()]);
  const t = copy(locale);
  return (
    <>
      <PageHero title={t.pages.offersTitle} subtitle={t.pages.offersText} image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((offer) => (
          <OfferCard key={offer.id} href={`/offres/${offer.slug}`} title={offer.title} destination={offer.destinationLabel} priceFrom={offer.priceFrom} badge={offer.badge} imageUrl={offer.imageUrl} fromLabel={t.cards.from} />
        ))}
      </section>
    </>
  );
}
