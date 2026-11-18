import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, MapPin, MessageCircle, ShieldCheck, Sparkles, Tag, X } from "lucide-react";
import { OfferCard } from "@/components/public/cards";
import { OfferGallery } from "@/components/public/offer-gallery";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { Reveal } from "@/components/public/reveal";
import { btnPrimary, formatPrice, whatsappHref } from "@/lib/utils";
import { getOffer, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { absoluteUrl, breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, locale] = await Promise.all([getOffer(slug), getLocale()]);
  if (!item) return { title: copy(locale).pages.offersTitle };
  return pageMetadata({ title: item.title, description: item.excerpt, path: `/offres/${slug}`, image: item.imageUrl, locale });
}

export default async function OfferPage({ params }: Props) {
  const { slug } = await params;
  const [item, settings, locale] = await Promise.all([getOffer(slug), getSettings(), getLocale()]);
  if (!item) notFound();
  const t = copy(locale);
  const o = t.offer;
  const images = [item.imageUrl, item.imageUrl2, item.imageUrl3].filter((src, index, all) => src && all.indexOf(src) === index);
  const whatsapp = whatsappHref(settings.whatsapp, `${o.whatsappMessage.replace("{title}", item.title)} ${absoluteUrl(`/offres/${slug}`)}`);
  const price = item.priceFrom != null ? formatPrice(item.priceFrom) : null;
  const facts = [
    item.duration && { icon: Clock, label: o.duration, value: item.duration },
    { icon: MapPin, label: o.destination, value: item.destinationLabel },
    item.badge && { icon: Tag, label: o.formula, value: item.badge },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string }[];
  const crumbs = [
    { href: "/", label: o.home },
    { href: "/offres", label: t.pages.offersTitle },
    ...(item.destination ? [{ href: `/destinations/${item.destination.slug}`, label: item.destination.name }] : []),
    { label: item.title },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: item.title,
            description: item.excerpt,
            image: images.map((src) => absoluteUrl(src)),
            brand: { "@type": "Brand", name: "DIM VOYAGES" },
            ...(item.priceFrom != null
              ? {
                  offers: {
                    "@type": "Offer",
                    price: item.priceFrom,
                    priceCurrency: "XOF",
                    availability: "https://schema.org/InStock",
                    url: absoluteUrl(`/offres/${slug}`),
                  },
                }
              : {}),
          },
          breadcrumbLd(crumbs.map((crumb) => ({ name: crumb.label, path: crumb.href ?? `/offres/${slug}` }))),
        ]}
      />
      <PageHero kicker={item.destinationLabel} title={item.title} subtitle={item.excerpt} image={item.imageUrl} breadcrumbs={crumbs} />

      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <Reveal>
          <OfferGallery images={images} title={item.title} labels={{ open: o.openPhotos, close: o.close, previous: o.previous, next: o.next }} />
        </Reveal>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_22rem] lg:px-8">
        <div className="min-w-0">
          <Reveal className="flex flex-wrap gap-3">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange/10 text-orange">
                  <fact.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-muted">{fact.label}</span>
                  <span className="block font-semibold text-navy">{fact.value}</span>
                </span>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">{o.about}</h2>
            <p className="mt-4 text-lg leading-8 whitespace-pre-line text-ink/85">{item.description}</p>
          </Reveal>

          {item.highlights.length > 0 && (
            <Reveal className="mt-10">
              <h2 className="text-2xl font-bold text-navy">{o.highlights}</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {item.highlights.map((point) => (
                  <li key={point} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-navy shadow-sm">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {item.program.length > 0 && (
            <Reveal className="mt-12">
              <h2 className="text-2xl font-bold text-navy">{o.program}</h2>
              <ol className="relative mt-6 space-y-6 border-l-2 border-dashed border-orange/40 pl-8">
                {item.program.map((step, index) => {
                  const [head, ...rest] = step.split(/\s*:\s*/);
                  const body = rest.join(" : ");
                  return (
                    <li key={`${index}-${step}`} className="relative">
                      <span className="absolute top-0 -left-[2.95rem] grid h-9 w-9 place-items-center rounded-full bg-orange text-sm font-bold text-white ring-4 ring-sand">
                        {index + 1}
                      </span>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        {body ? (
                          <>
                            <p className="font-semibold text-navy">{head}</p>
                            <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
                          </>
                        ) : (
                          <p className="text-sm leading-6 text-navy">{step}</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          )}

          {(item.included.length > 0 || item.excluded.length > 0) && (
            <Reveal className="mt-12 grid gap-4 sm:grid-cols-2">
              {item.included.length > 0 && (
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-navy">{o.included}</h2>
                  <ul className="mt-4 space-y-3">
                    {item.included.map((line) => (
                      <li key={line} className="flex items-start gap-3 text-sm text-ink/85">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-whatsapp/15 text-whatsapp"><Check className="h-3.5 w-3.5" /></span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.excluded.length > 0 && (
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-navy">{o.excluded}</h2>
                  <ul className="mt-4 space-y-3">
                    {item.excluded.map((line) => (
                      <li key={line} className="flex items-start gap-3 text-sm text-ink/85">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-orange/15 text-orange"><X className="h-3.5 w-3.5" /></span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          )}

          <Reveal className="mt-14 scroll-mt-28" >
            <div id="devis" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">{o.formTitle}</h2>
              <p className="mt-2 mb-6 text-muted">{o.formText}</p>
              <RequestForm type="DEVIS" destination={`${item.title} (${item.destinationLabel})`} locale={locale} />
            </div>
          </Reveal>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-line">
            {price ? (
              <>
                <p className="text-sm text-muted">{t.cards.from}</p>
                <p className="mt-1 text-3xl font-bold text-navy">{price}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-navy">{o.priceOnRequest}</p>
            )}
            {item.duration && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted"><Clock className="h-4 w-4" />{item.duration}</p>
            )}
            <div className="mt-6 grid gap-3">
              <a href="#devis" className={`${btnPrimary} w-full`}>
                {o.quote}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110">
                <MessageCircle className="h-4 w-4" />
                {o.whatsapp}
              </a>
            </div>
            <ul className="mt-6 space-y-2 border-t border-line pt-5">
              {o.reassurance.map((line) => (
                <li key={line} className="flex items-center gap-2 text-sm text-ink/80">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-sea" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {item.similar.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-navy">{o.similar}</h2>
            {item.destination && (
              <Link href={`/destinations/${item.destination.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-orange hover:text-orange-600">
                {o.seeDestination}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {item.similar.map((offer, index) => (
              <Reveal key={offer.id} delay={index * 100} className="h-full">
                <OfferCard href={`/offres/${offer.slug}`} title={offer.title} destination={offer.destinationLabel} priceFrom={offer.priceFrom} badge={offer.badge} imageUrl={offer.imageUrl} imageUrls={[offer.imageUrl2, offer.imageUrl3]} fromLabel={t.cards.from} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 py-3 pr-24 pl-4 shadow-[0_-8px_30px_rgba(1,37,73,0.12)] backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {price && <p className="text-xs text-muted">{t.cards.from}</p>}
            <p className="font-bold whitespace-nowrap text-navy">{price ?? o.priceOnRequest}</p>
          </div>
          <a href="#devis" className={`${btnPrimary} shrink-0 px-4 py-2.5 whitespace-nowrap`}>{o.quote}</a>
        </div>
      </div>
    </>
  );
}
