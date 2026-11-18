import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MessageCircle } from "lucide-react";
import { OfferCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { Reveal } from "@/components/public/reveal";
import { btnPrimary, btnSecondary, whatsappHref } from "@/lib/utils";
import { getDestination, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, absoluteUrl, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, locale] = await Promise.all([getDestination(slug), getLocale()]);
  if (!item) return { title: copy(locale).pages.destinationsTitle };
  return pageMetadata({ title: item.name, description: item.excerpt, path: `/destinations/${slug}`, image: item.imageUrl, locale });
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const [item, settings, locale] = await Promise.all([getDestination(slug), getSettings(), getLocale()]);
  if (!item) notFound();
  const t = copy(locale);
  const offers = item.offers ?? [];
  const crumbs = [
    { href: "/", label: t.offer.home },
    { href: "/destinations", label: t.pages.destinationsTitle },
    { label: item.name },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            name: item.name,
            description: item.excerpt,
            image: item.imageUrl ? absoluteUrl(item.imageUrl) : undefined,
            url: absoluteUrl(`/destinations/${slug}`),
          },
          breadcrumbLd(crumbs.map((crumb) => ({ name: crumb.label, path: crumb.href ?? `/destinations/${slug}` }))),
        ]}
      />
      <PageHero kicker={item.region || t.pages.destinationsKicker} title={item.name} subtitle={item.excerpt} image={item.imageUrl} breadcrumbs={crumbs}>
        <div className="flex flex-wrap gap-3">
          {offers.length > 0 && (
            <a href="#offres" className={btnPrimary}>
              {offers.length} {offers.length > 1 ? t.offer.filters.results : t.offer.filters.result}
              <ArrowRight className="h-4 w-4" />
            </a>
          )}
          <a href={whatsappHref(settings.whatsapp, t.offer.destinationMessage.replace("{name}", item.name))} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            <MessageCircle className="h-4 w-4" />
            {t.pages.destinationsAdvisor}
          </a>
        </div>
      </PageHero>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-xl leading-9 whitespace-pre-line text-ink/85">{item.description}</p>
        </Reveal>
      </section>

      {offers.length > 0 && (
        <section id="offres" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 pb-6 sm:px-6 lg:px-8">
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.home.offers}</h2>
            <Link href="/offres" className="inline-flex items-center gap-1 text-sm font-semibold text-orange hover:text-orange-600">
              {t.home.allOffers}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {offers.map((offer, index) => (
              <Reveal key={offer.id} delay={(index % 4) * 100} className="h-full">
                <OfferCard href={`/offres/${offer.slug}`} title={offer.title} destination={offer.destinationLabel} priceFrom={offer.priceFrom} badge={offer.badge} imageUrl={offer.imageUrl} imageUrls={[offer.imageUrl2, offer.imageUrl3]} fromLabel={t.cards.from} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-14 w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-navy shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 text-white sm:p-12">
              <p className="font-script text-4xl text-gold sm:text-5xl">{t.pages.destinationsBeyond}</p>
              <h2 className="mt-4 text-3xl font-bold">{t.offer.formTitle}</h2>
              <p className="mt-3 text-white/80">{t.offer.formText}</p>
              <ul className="mt-6 space-y-2 text-sm text-white/85">
                {t.offer.reassurance.map((line) => <li key={line}>✓ {line}</li>)}
              </ul>
            </div>
            <div className="bg-white p-4 sm:p-6">
              <RequestForm type="VOYAGE" destination={item.name} locale={locale} />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
