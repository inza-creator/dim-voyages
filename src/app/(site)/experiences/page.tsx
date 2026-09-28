import type { Metadata } from "next";
import { ExperienceCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedExperiences, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "Nos expériences" };

export default async function ExperiencesPage() {
  const [items, settings] = await Promise.all([getPublishedExperiences(), getSettings()]);
  return (
    <>
      <PageHero title="Nos expériences" subtitle="DIM Junior, DIM Corporate et Voyages spirituels." image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <ExperienceCard key={item.id} href={`/experiences/${item.slug}`} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} />
        ))}
      </section>
    </>
  );
}
