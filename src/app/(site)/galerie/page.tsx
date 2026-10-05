import type { Metadata } from "next";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedGallery, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.galleryTitle };
}

export default async function GalleryPage() {
  const [items, settings, locale] = await Promise.all([getPublishedGallery(), getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return (
    <>
      <PageHero title={t.galleryTitle} subtitle={t.galleryText} image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GalleryGrid items={items} locale={locale} />
      </section>
    </>
  );
}
