import type { Metadata } from "next";
import { GalleryGrid } from "@/components/public/gallery-grid";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedGallery, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "Galerie" };

export default async function GalleryPage() {
  const [items, settings] = await Promise.all([getPublishedGallery(), getSettings()]);
  return (
    <>
      <PageHero title="Galerie" subtitle="Photos, vidéos et événements DIM VOYAGES." image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <GalleryGrid items={items} />
      </section>
    </>
  );
}
