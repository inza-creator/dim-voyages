import { MediaImage } from "@/components/public/media-image";

export function PageHero({
  kicker = "DIM VOYAGES",
  title,
  subtitle,
  image,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-navy">
      <div className="absolute inset-0">
        <MediaImage src={image} alt="" className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/50 to-navy/15" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-gold uppercase">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
