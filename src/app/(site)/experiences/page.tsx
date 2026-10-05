import type { Metadata } from "next";
import { ExperienceCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedExperiences, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.experiencesTitle };
}

export default async function ExperiencesPage() {
  const [items, settings, locale] = await Promise.all([getPublishedExperiences(), getSettings(), getLocale()]);
  const t = copy(locale);
  return (
    <>
      <PageHero title={t.pages.experiencesTitle} subtitle={t.pages.experiencesText} image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((item) => (
          <ExperienceCard key={item.id} href={`/experiences/${item.slug}`} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} discover={t.cards.discover} />
        ))}
      </section>
    </>
  );
}
