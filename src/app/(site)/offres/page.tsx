import type { Metadata } from "next";
import { OfferCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedOffers, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "Nos offres" };

export default async function OffersPage() {
  const [items, settings] = await Promise.all([getPublishedOffers(), getSettings()]);
  return (
    <>
      <PageHero title="Nos offres" subtitle="Des points de départ pour imaginer votre prochain voyage. Chaque tarif se confirme avec un conseiller." image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((offer) => (
          <OfferCard key={offer.id} href={`/offres/${offer.slug}`} title={offer.title} destination={offer.destinationLabel} priceFrom={offer.priceFrom} badge={offer.badge} imageUrl={offer.imageUrl} />
        ))}
      </section>
    </>
  );
}
