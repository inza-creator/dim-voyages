import type { Metadata } from "next";
import { ExperienceCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { getPublishedExperiences, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return pageMetadata({ title: t.experiencesTitle, description: t.experiencesText, path: "/experiences", image: settings.heroImageUrl, locale });
}

export default async function ExperiencesPage() {
  const [items, settings, locale] = await Promise.all([getPublishedExperiences(), getSettings(), getLocale()]);
  const t = copy(locale);
  return (
    <>
      <PageHero
        title={t.pages.experiencesTitle}
        subtitle={t.pages.experiencesText}
        image={settings.heroImageUrl}
        breadcrumbs={[{ href: "/", label: t.offer.home }, { label: t.pages.experiencesTitle }]}
      />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={index * 120} className="h-full">
            <ExperienceCard href={`/experiences/${item.slug}`} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} discover={t.cards.discover} />
          </Reveal>
        ))}
      </section>
    </>
  );
}
