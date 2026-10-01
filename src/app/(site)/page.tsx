import Link from "next/link";
import { Award, Calendar, MapPin, Plane, Search } from "lucide-react";
import { ArticleCard, DestinationCard, ExperienceCard, OfferCard, SectionLink, ServiceTile, Stars } from "@/components/public/cards";
import { MediaImage } from "@/components/public/media-image";
import { getHomeData } from "@/server/content";
import { btnPrimary, btnSecondary, initials } from "@/lib/utils";

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      <section className="relative isolate min-h-[640px] overflow-hidden bg-navy">
        <div className="absolute inset-0">
          <MediaImage src={data.settings.heroImageUrl} alt="Voyage DIM VOYAGES" priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/45 to-transparent" />
        </div>
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
          <div className="rise max-w-2xl text-white">
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-6xl">Le pouvoir du voyage</h1>
            <p className="font-script text-4xl text-orange sm:text-6xl">Le chemin vers soi.</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Découvrez le monde avec DIM Voyages, votre agence de voyage et de tourisme en Côte d&apos;Ivoire. Des expériences sur mesure pour tous : particuliers, familles, entreprises, institutions et groupes.
            </p>
            <p className="mt-4 text-sm font-semibold text-gold">{data.settings.signature}</p>
          </div>
          <div className="hidden items-end justify-end lg:flex">
            <div className="max-w-xs rounded-3xl border border-white/20 bg-white/10 p-4 text-white backdrop-blur">
              <Award className="h-8 w-8 text-gold" />
              <p className="mt-2 text-sm font-semibold">Lauréat du</p>
              <p className="font-bold">{data.settings.award}</p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <form action="/demande" className="grid gap-3 rounded-3xl bg-white p-3 shadow-2xl md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="flex items-center gap-2 rounded-2xl bg-sand px-3">
              <MapPin className="h-4 w-4 text-orange" />
              <span className="sr-only">Destination</span>
              <input name="destination" placeholder="Destination" className="h-12 w-full bg-transparent text-sm outline-none" />
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-sand px-3">
              <Plane className="h-4 w-4 text-sea" />
              <span className="sr-only">Type de voyage</span>
              <select name="type" defaultValue="VOYAGE" className="h-12 w-full bg-transparent text-sm outline-none">
                <option value="VOYAGE">Voyage</option>
                <option value="DEVIS">Devis</option>
                <option value="JUNIOR">DIM Junior</option>
                <option value="CORPORATE">DIM Corporate</option>
                <option value="SPIRITUEL">Voyage spirituel</option>
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-2xl bg-sand px-3">
              <Calendar className="h-4 w-4 text-sea" />
              <span className="sr-only">Date de départ</span>
              <input name="date" type="date" className="h-12 w-full bg-transparent text-sm outline-none" />
            </label>
            <button className={`${btnPrimary} h-12`}>
              <Search className="h-4 w-4" />
              Rechercher
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-3 lg:hidden">
            <Link href="/experiences" className={btnPrimary}>Découvrir nos expériences</Link>
            <a href={`https://wa.me/${data.settings.whatsapp}`} className={btnSecondary}>Parler sur WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {data.services.map((service) => (
            <ServiceTile key={service.id} href={`/services/${service.slug}`} title={service.title} excerpt={service.excerpt} icon={service.icon} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:px-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-orange">À vivre</p>
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">Nos expériences du moment</h2>
            </div>
            <SectionLink href="/experiences">Voir tout</SectionLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {data.experiences.map((item) => (
              <ExperienceCard key={item.id} href={`/experiences/${item.slug}`} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} />
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-orange">Explorer</p>
              <h2 className="text-2xl font-bold text-navy sm:text-3xl">Nos destinations</h2>
            </div>
            <SectionLink href="/destinations">Voir tout</SectionLink>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
            {data.destinations.map((item) => (
              <DestinationCard key={item.id} href={`/destinations/${item.slug}`} name={item.name} imageUrl={item.imageUrl} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] bg-navy text-white lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-64">
            <MediaImage src={data.destinations[0]?.imageUrl || data.settings.heroImageUrl} alt="Explorez le monde avec DIM Voyages" sizes="50vw" />
          </div>
          <div className="p-6 sm:p-10">
            <h2 className="text-3xl font-bold">Explorez le monde avec DIM Voyages</h2>
            <p className="mt-3 text-white/90">Des destinations de rêve, des expériences uniques et un accompagnement sur mesure pour tous vos projets de voyage.</p>
            <Link href="/offres" className={`${btnPrimary} mt-6`}>Voir nos offres</Link>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                [data.settings.statYears, "Années d'expérience"],
                [data.settings.statTravelers, "Voyageurs satisfaits"],
                [data.settings.statDestinations, "Destinations"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-2xl font-bold text-gold">{value}</dt>
                  <dd className="text-xs text-white/70">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">Nos offres</h2>
          <SectionLink href="/offres">Voir toutes les offres</SectionLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data.offers.map((offer) => (
            <OfferCard
              key={offer.id}
              href={`/offres/${offer.slug}`}
              title={offer.title}
              destination={offer.destinationLabel}
              priceFrom={offer.priceFrom}
              badge={offer.badge}
              imageUrl={offer.imageUrl}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 grid w-full max-w-7xl gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-navy">Témoignages</h2>
            <SectionLink href="/a-propos">Notre histoire</SectionLink>
          </div>
          <div className="space-y-4">
            {data.testimonials.map((item) => (
              <article key={item.id} className="rounded-2xl bg-sand p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-sm font-bold text-white">{initials(item.authorName)}</span>
                  <div>
                    <p className="font-semibold text-navy">{item.authorName}</p>
                    <p className="text-xs text-muted">{item.location}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/80">{item.content}</p>
                <div className="mt-2"><Stars rating={item.rating} /></div>
              </article>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-navy">Actualités & promotions</h2>
            <SectionLink href="/actualites">Voir tout</SectionLink>
          </div>
          <div className="space-y-2">
            {data.articles.map((article) => (
              <ArticleCard
                key={article.id}
                href={`/actualites/${article.slug}`}
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.imageUrl}
                date={article.publishedAt}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
