import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/page-hero";
import { ServiceIcon } from "@/components/public/icons";
import { MediaImage } from "@/components/public/media-image";
import { getPublishedServices, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.servicesTitle };
}

export default async function ServicesPage() {
  const [items, settings, locale] = await Promise.all([getPublishedServices(), getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return (
    <>
      <PageHero title={t.servicesTitle} subtitle={t.servicesText} image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
        {items.map((item) => (
          <Link key={item.id} href={`/services/${item.slug}`} className="grid overflow-hidden rounded-3xl bg-white shadow-sm sm:grid-cols-[180px_1fr]">
            <div className="relative min-h-40">
              <MediaImage src={item.imageUrl} alt={item.title} sizes="180px" />
            </div>
            <div className="p-5">
              <ServiceIcon name={item.icon} className="h-6 w-6 text-orange" />
              <h2 className="mt-2 text-xl font-bold text-navy">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
