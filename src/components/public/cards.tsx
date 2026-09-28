import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { MediaImage } from "@/components/public/media-image";
import { ServiceIcon } from "@/components/public/icons";
import { formatDate, formatPrice } from "@/lib/utils";

export function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-orange hover:text-orange-600">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function ExperienceCard({
  href,
  title,
  subtitle,
  imageUrl,
}: {
  href: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}) {
  return (
    <Link href={href} className="group relative block min-h-64 overflow-hidden rounded-3xl shadow-sm">
      <MediaImage src={imageUrl} alt={title} className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 30vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/80">{subtitle}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange">
          Découvrir <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export function DestinationCard({ href, name, imageUrl }: { href: string; name: string; imageUrl: string }) {
  return (
    <Link href={href} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl shadow-sm">
      <MediaImage src={imageUrl} alt={name} className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 50vw, 20vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 to-transparent" />
      <h3 className="absolute inset-x-0 bottom-0 p-3 text-base font-bold text-white">{name}</h3>
    </Link>
  );
}

export function OfferCard({
  href,
  title,
  destination,
  priceFrom,
  badge,
  imageUrl,
}: {
  href: string;
  title: string;
  destination: string;
  priceFrom?: number | null;
  badge?: string;
  imageUrl: string;
}) {
  return (
    <Link href={href} className="group overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-44">
        <MediaImage src={imageUrl} alt={title} className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 25vw" />
        {badge && <span className="absolute top-3 left-3 rounded-full bg-orange px-3 py-1 text-xs font-bold text-white">{badge}</span>}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold tracking-wide text-sea uppercase">{destination}</p>
        <h3 className="mt-1 font-bold text-navy">{title}</h3>
        {priceFrom != null && <p className="mt-2 text-sm text-muted">À partir de <span className="font-bold text-navy">{formatPrice(priceFrom)}</span></p>}
      </div>
    </Link>
  );
}

export function ServiceTile({ href, title, excerpt, icon }: { href: string; title: string; excerpt: string; icon: string }) {
  return (
    <Link href={href} className="rounded-3xl border border-line bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-orange/10 text-orange">
        <ServiceIcon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mt-3 font-bold text-navy">{title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{excerpt}</p>
    </Link>
  );
}

export function ArticleCard({
  href,
  title,
  excerpt,
  imageUrl,
  date,
}: {
  href: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date?: Date | string | null;
}) {
  return (
    <Link href={href} className="flex gap-3 rounded-2xl p-2 transition hover:bg-sand">
      <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl">
        <MediaImage src={imageUrl} alt="" sizes="96px" />
      </div>
      <div>
        {date && <p className="text-xs font-semibold text-orange">{formatDate(date)}</p>}
        <h3 className="font-bold text-navy">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{excerpt}</p>
      </div>
    </Link>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-gold" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? "fill-current" : "opacity-30"}`} />
      ))}
    </div>
  );
}
