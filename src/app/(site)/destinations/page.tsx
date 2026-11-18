import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MediaImage } from "@/components/public/media-image";
import { getPublishedDestinations, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { btnPrimary, btnSecondary, whatsappHref } from "@/lib/utils";
import { Reveal } from "@/components/public/reveal";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [items, locale] = await Promise.all([getPublishedDestinations(), getLocale()]);
  const t = copy(locale).pages;
  return pageMetadata({ title: t.destinationsTitle, description: t.destinationsLead, path: "/destinations", image: items[0]?.imageUrl, locale });
}

export default async function DestinationsPage() {
  const [items, settings, locale] = await Promise.all([getPublishedDestinations(), getSettings(), getLocale()]);
  const t = copy(locale).pages;
  const featured = items[0];
  const others = items.slice(1);

  return (
    <>
      {featured ? (
        <section className="relative isolate min-h-[78vh] overflow-hidden bg-[#0e4f7c] text-white">
          <div className="absolute inset-0">
            <MediaImage src={featured.imageUrl} alt={featured.name} priority className="hero-kenburns object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e4f7c] via-[#0e4f7c]/55 to-[#0e4f7c]/15" />
          </div>
          <div className="relative mx-auto flex min-h-[78vh] w-full max-w-7xl flex-col justify-end px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <p className="word-in text-xs font-semibold tracking-[0.2em] text-gold uppercase sm:text-sm" style={{ animationDelay: "100ms" }}>{t.destinationsKicker}</p>
            <h1 className="word-in mt-3 max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl" style={{ animationDelay: "250ms" }}>{featured.name}</h1>
            {featured.region && <p className="word-in mt-3 text-sm font-semibold text-white/80" style={{ animationDelay: "400ms" }}>{featured.region}</p>}
            <p className="word-in mt-4 max-w-xl text-base leading-7 text-white/90 sm:text-lg" style={{ animationDelay: "500ms" }}>{featured.excerpt}</p>
            <div className="word-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "650ms" }}>
              <Link href={`/destinations/${featured.slug}`} className={btnPrimary}>
                {t.destinationsSee}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={`/demande?type=VOYAGE&destination=${encodeURIComponent(featured.name)}`} className={btnSecondary}>
                {t.destinationsPlan}
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-[#0e4f7c] px-4 py-20 text-white sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{t.destinationsKicker}</p>
            <h1 className="mt-3 text-4xl font-bold">{t.destinationsTitle}</h1>
            <p className="mt-4 text-lg leading-8 text-white/85">{t.destinationsLead}</p>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-orange uppercase">{t.destinationsElsewhere}</p>
            <p className="mt-2 text-base leading-7 text-ink/80 sm:text-lg">{t.destinationsLead}</p>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map((item, index) => (
              <Reveal key={item.id} delay={(index % 2) * 120}>
              <Link
                href={`/destinations/${item.slug}`}
                className="group relative block min-h-[26rem] overflow-hidden rounded-[2rem] shadow-sm sm:min-h-[30rem]"
              >
                <MediaImage
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e4f7c] via-[#0e4f7c]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  {item.region && (
                    <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">{item.region}</p>
                  )}
                  <h2 className="mt-2 text-3xl font-bold text-white">{item.name}</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-white/85">{item.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange transition-all group-hover:gap-2">
                    {t.destinationsExplore}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[#0e4f7c] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="font-script text-4xl text-gold">{t.destinationsBeyond}</p>
            <p className="mt-3 text-base leading-7 text-white/85">{t.destinationsBeyondText}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/demande?type=DEVIS" className={btnPrimary}>
              {t.destinationsQuote}
            </Link>
            <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
              {t.destinationsAdvisor}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
