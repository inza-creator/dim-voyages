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
    <section className="relative isolate min-h-[26rem] overflow-hidden bg-navy sm:min-h-[32rem] lg:min-h-[36rem]">
      <div className="absolute inset-0">
        <MediaImage src={image} alt="" className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/35 to-navy/20" />
      </div>
      <div className="relative mx-auto flex min-h-[26rem] w-full max-w-7xl flex-col justify-end px-4 py-12 sm:min-h-[32rem] sm:px-6 sm:py-16 lg:min-h-[36rem] lg:px-8">
        <p className="text-sm font-semibold tracking-[0.18em] text-gold uppercase">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}
