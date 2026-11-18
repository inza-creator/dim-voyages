import Link from "next/link";
import { ArrowRight, Award, Calendar, ChevronDown, Compass, MapPin, MessageCircle, Plane, Search, ShieldCheck } from "lucide-react";
import { DestinationCard, ExperienceCard, OfferCard, SectionLink, ServiceTile } from "@/components/public/cards";
import { CountUp } from "@/components/public/count-up";
import { HeroCarousel } from "@/components/public/hero-carousel";
import { HomeOffers } from "@/components/public/home-offers";
import { MediaImage } from "@/components/public/media-image";
import { OfferRail } from "@/components/public/offer-rail";
import { Reveal } from "@/components/public/reveal";
import { TestimonialCarousel } from "@/components/public/testimonial-carousel";
import { getHomeData } from "@/server/content";
import { btnPrimary, btnSecondary, formatDate, whatsappHref } from "@/lib/utils";
import { images } from "@/lib/constants";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

const whyIcons = [ShieldCheck, Award, Compass, MessageCircle];

export default async function HomePage() {
  const [data, locale] = await Promise.all([getHomeData(), getLocale()]);
  const t = copy(locale).home;
  const cards = copy(locale).cards;
  const ci = data.destinations.find((item) => item.slug === "cote-divoire");
  const ciOffers = ci ? data.offers.filter((offer) => offer.destinationId === ci.id) : [];
  const otherOffers = data.offers.filter((offer) => !ciOffers.includes(offer));
  const titleWords = t.title.split(" ");

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-4.75rem)] flex-col overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <HeroCarousel
            images={[
              { src: data.settings.heroImageUrl, alt: "Voyage DIM VOYAGES" },
              { src: data.settings.heroImageUrl2, alt: "Basilique Notre-Dame de la Paix à Yamoussoukro" },
              { src: data.settings.heroImageUrl3, alt: "Front de lagune à Abidjan" },
            ]}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/30" />
        </div>
        <div className="relative overflow-hidden border-b border-white/15 bg-[#012549]/45 py-2.5 text-white backdrop-blur-[2px]" role="region" aria-label={`${t.tickerTitle} — ${t.tickerText}`}>
          <div className="ticker-track flex w-max">
            {[0, 1].map((copy) => (
              <p key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                {Array.from({ length: 4 }, (_, index) => (
                  <span key={index} className="mx-8 whitespace-nowrap text-xs font-semibold tracking-[0.14em] sm:text-sm">
                    <span className="text-gold">{t.tickerTitle}</span>
                    <span className="text-white"> — {t.tickerText}</span>
                  </span>
                ))}
              </p>
            ))}
          </div>
        </div>
        <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="max-w-3xl text-white">
              <h1 className="text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl lg:text-8xl">
                {titleWords.map((word, index) => (
                  <span key={`${word}-${index}`} className="word-in mr-[0.25em] inline-block" style={{ animationDelay: `${150 + index * 140}ms` }}>
                    {word}
                  </span>
                ))}
              </h1>
              <p className="word-in mt-2 font-script text-5xl text-orange sm:text-7xl" style={{ animationDelay: `${300 + titleWords.length * 140}ms` }}>
                {t.script}
              </p>
              <p className="word-in mt-6 max-w-xl text-base leading-7 text-white/85 sm:text-lg" style={{ animationDelay: `${500 + titleWords.length * 140}ms` }}>
                {t.lead}
              </p>
              <p className="word-in mt-4 text-sm font-semibold text-gold" style={{ animationDelay: `${650 + titleWords.length * 140}ms` }}>
                {data.settings.signature}
              </p>
            </div>
            <div className="word-in hidden justify-end lg:flex" style={{ animationDelay: "1400ms" }}>
              <div className="max-w-xs rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-md">
                <Award className="h-9 w-9 text-gold" />
                <p className="mt-2 text-sm font-semibold">{t.award}</p>
                <p className="font-bold">{data.settings.award}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="word-in relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8" style={{ animationDelay: "1200ms" }}>
          <form action="/demande" className="grid gap-3 rounded-3xl bg-white/95 p-3 shadow-2xl ring-1 ring-white/40 backdrop-blur-md md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="flex items-center gap-2 rounded-2xl bg-sand px-3">
              <MapPin className="h-4 w-4 text-orange" />
              <span className="sr-only">{t.destination}</span>
              <input name="destination" placeholder={t.destination} className="h-12 w-full bg-transparent text-sm outline-none" />
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-sand px-3">
              <Plane className="h-4 w-4 text-sea" />
              <span className="sr-only">{t.tripType}</span>
              <select name="type" defaultValue="VOYAGE" className="h-12 w-full bg-transparent text-sm outline-none">
                <option value="VOYAGE">{t.voyage}</option>
                <option value="DEVIS">{t.quote}</option>
                <option value="JUNIOR">{t.junior}</option>
                <option value="CORPORATE">{t.corporate}</option>
                <option value="SPIRITUEL">{t.spiritual}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-sand px-3">
              <Calendar className="h-4 w-4 text-sea" />
              <span className="sr-only">{t.departure}</span>
              <input name="date" type="date" className="h-12 w-full bg-transparent text-sm outline-none" />
            </label>
            <button className={`${btnPrimary} h-12`}>
              <Search className="h-4 w-4" />
              {t.search}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-3 lg:hidden">
            <Link href="/experiences" className={btnPrimary}>{t.discoverExperiences}</Link>
            <a href={`https://wa.me/${data.settings.whatsapp}`} className={btnSecondary}>{t.whatsapp}</a>
          </div>
          <a href="#decouvrir" className="mt-6 hidden flex-col items-center gap-1 text-xs font-semibold tracking-[0.2em] text-white/70 uppercase hover:text-white lg:flex">
            {t.scroll}
            <ChevronDown className="scroll-cue h-5 w-5" />
          </a>
        </div>
      </section>

      <section id="decouvrir" className="relative z-10 mx-auto mt-10 w-full max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className={`grid gap-3 ${serviceColumns(data.services.length)}`}>
          {data.services.map((service, index) => (
            <Reveal key={service.id} delay={index * 100} className="h-full">
              <ServiceTile href={`/services/${service.slug}`} title={service.title} excerpt={service.excerpt} icon={service.icon} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-wide text-orange uppercase">{t.live}</p>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.experiencesNow}</h2>
          </div>
          <SectionLink href="/experiences">{t.seeAll}</SectionLink>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.experiences.map((item, index) => (
            <Reveal key={item.id} delay={index * 120}>
              <ExperienceCard href={`/experiences/${item.slug}`} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} discover={cards.discover} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold tracking-wide text-orange uppercase">{t.explore}</p>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.destinations}</h2>
          </div>
          <SectionLink href="/destinations">{t.seeAll}</SectionLink>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {data.destinations.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <DestinationCard href={`/destinations/${item.slug}`} name={item.name} imageUrl={item.imageUrl} />
            </Reveal>
          ))}
        </div>
      </section>

      {ci && ciOffers.length > 0 && (
        <section
          className="relative isolate mt-24 overflow-hidden bg-navy bg-cover bg-center py-20 md:bg-fixed"
          style={{ backgroundImage: `url("${ci.imageUrl || images.abidjan}")` }}
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy/90 via-navy/75 to-navy/95" />
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl text-white">
                <p className="text-sm font-semibold tracking-[0.2em] text-gold uppercase">{t.ciKicker}</p>
                <h2 className="mt-2 text-4xl font-bold sm:text-6xl">{t.ciTitle}</h2>
                <p className="mt-4 text-white/80 sm:text-lg">{t.ciText}</p>
              </div>
              <Link href={`/destinations/${ci.slug}`} className={btnPrimary}>
                {t.ciCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Reveal className="mt-10" delay={150}>
              <OfferRail previousLabel={t.previous} nextLabel={t.next}>
                {ciOffers.map((offer) => (
                  <div key={offer.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[calc(25%-0.75rem)]">
                    <OfferCard
                      href={`/offres/${offer.slug}`}
                      title={offer.title}
                      destination={offer.destinationLabel}
                      priceFrom={offer.priceFrom}
                      badge={offer.badge}
                      imageUrl={offer.imageUrl}
                      imageUrls={[offer.imageUrl2, offer.imageUrl3]}
                      fromLabel={cards.from}
                    />
                  </div>
                ))}
              </OfferRail>
            </Reveal>
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-6 flex items-end justify-between">
          <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.offers}</h2>
          <SectionLink href="/offres">{t.allOffers}</SectionLink>
        </Reveal>
        <Reveal delay={100}>
          <HomeOffers offers={otherOffers.length > 0 ? otherOffers : data.offers} fromLabel={cards.from} />
        </Reveal>
      </section>

      <section className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-navy text-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="group relative min-h-72 overflow-hidden">
              <MediaImage src={data.destinations[0]?.imageUrl || data.settings.heroImageUrl} alt={t.exploreWorld} sizes="50vw" className="object-cover transition duration-[2s] group-hover:scale-110" />
            </div>
            <div className="p-6 sm:p-12">
              <h2 className="text-3xl font-bold sm:text-4xl">{t.exploreWorld}</h2>
              <p className="mt-3 text-white/90">{t.exploreText}</p>
              <Link href="/offres" className={`${btnPrimary} mt-6`}>{t.seeOffers}</Link>
              <dl className="mt-10 grid grid-cols-3 gap-3">
                {[
                  [data.settings.statYears, t.years],
                  [data.settings.statTravelers, t.travelers],
                  [data.settings.statDestinations, t.destinationCount],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-3xl font-bold text-gold sm:text-4xl"><CountUp value={value} /></dt>
                    <dd className="mt-1 text-xs text-white/70">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mt-24 bg-white py-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-orange uppercase">{t.whyKicker}</p>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.whyTitle}</h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.why.map((item, index) => {
              const Icon = whyIcons[index % whyIcons.length];
              return (
                <Reveal key={item.title} delay={index * 100}>
                  <div className="group h-full rounded-3xl border border-line bg-sand p-6 transition duration-300 hover:-translate-y-1 hover:border-orange/40 hover:bg-white hover:shadow-xl">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-orange/10 text-orange transition group-hover:bg-orange group-hover:text-white">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-navy">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal className="mt-20 max-w-2xl">
            <p className="text-sm font-semibold tracking-wide text-orange uppercase">{t.howKicker}</p>
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.howTitle}</h2>
          </Reveal>
          <div className="relative mt-12">
            <div className="absolute top-7 right-[16.66%] left-[16.66%] hidden border-t-2 border-dashed border-orange/40 md:block" aria-hidden>
              <Plane className="plane-path absolute -top-[0.7rem] h-5 w-5 rotate-45 text-orange" />
            </div>
            <ol className="relative grid gap-10 md:grid-cols-3">
              {t.how.map((step, index) => (
                <li key={step.title}>
                  <Reveal delay={index * 150} className="text-center">
                    <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-orange text-xl font-bold text-white shadow-lg ring-8 ring-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-navy">{step.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">{step.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {data.testimonials.length > 0 && (
        <section className="relative isolate overflow-hidden bg-navy py-20">
          <div className="absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-sea/30 blur-3xl" aria-hidden />
          <div className="absolute -right-32 -bottom-32 -z-10 h-96 w-96 rounded-full bg-orange/20 blur-3xl" aria-hidden />
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center">
              <p className="text-sm font-semibold tracking-[0.2em] text-gold uppercase">{t.testimonialsKicker}</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t.testimonials}</h2>
            </Reveal>
            <Reveal className="mt-10" delay={150}>
              <TestimonialCarousel items={data.testimonials} label={t.testimonials} />
            </Reveal>
          </div>
        </section>
      )}

      {data.articles.length > 0 && (
        <section className="mx-auto mt-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-navy sm:text-4xl">{t.news}</h2>
            <SectionLink href="/actualites">{t.seeAll}</SectionLink>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {data.articles.map((article, index) => (
              <Reveal key={article.id} delay={index * 120}>
                <Link href={`/actualites/${article.slug}`} className="group block h-full overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <MediaImage src={article.imageUrl} alt="" sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    {article.publishedAt && <p className="text-xs font-semibold text-orange">{formatDate(article.publishedAt, locale)}</p>}
                    <h3 className="mt-1 text-lg font-bold text-navy">{article.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{article.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="relative isolate -mb-8 mt-24 flex min-h-[460px] items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <MediaImage src={images.aerial} alt="" sizes="100vw" className="hero-kenburns object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/40" />
        </div>
        <Reveal className="mx-auto w-full max-w-7xl px-4 py-20 text-white sm:px-6 lg:px-8">
          <h2 className="max-w-3xl text-4xl font-bold sm:text-6xl">{t.ctaTitle}</h2>
          <p className="mt-4 max-w-xl text-lg text-white/85">{t.ctaText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demande?type=DEVIS" className={`${btnPrimary} px-7 py-4 text-base`}>
              {t.ctaQuote}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a href={whatsappHref(data.settings.whatsapp)} className="inline-flex items-center justify-center gap-2 rounded-full bg-whatsapp px-7 py-4 text-base font-semibold text-white shadow-sm transition hover:brightness-110">
              <MessageCircle className="h-5 w-5" />
              {t.ctaWhatsapp}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function serviceColumns(count: number) {
  if (count <= 2) return "sm:grid-cols-2";
  if (count === 3) return "sm:grid-cols-3";
  if (count === 4) return "grid-cols-2 md:grid-cols-4";
  return "grid-cols-2 md:grid-cols-3 xl:grid-cols-5";
}
