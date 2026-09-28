import type { Metadata } from "next";
import { DestinationCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedDestinations, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const [items, settings] = await Promise.all([getPublishedDestinations(), getSettings()]);
  return (
    <>
      <PageHero title="Destinations" subtitle="Explorez le monde, une destination à la fois." image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {items.map((item) => (
          <DestinationCard key={item.id} href={`/destinations/${item.slug}`} name={item.name} imageUrl={item.imageUrl} />
        ))}
      </section>
    </>
  );
}
