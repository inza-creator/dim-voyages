import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MediaImage } from "@/components/public/media-image";

export function PageHero({
  kicker = "DIM VOYAGES",
  title,
  subtitle,
  image,
  breadcrumbs,
  children,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumbs?: { href?: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate min-h-[28rem] overflow-hidden bg-navy sm:min-h-[34rem] lg:min-h-[38rem]">
      <div className="absolute inset-0">
        <MediaImage src={image} alt="" priority className="hero-kenburns object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[28rem] w-full max-w-7xl flex-col justify-end px-4 py-12 sm:min-h-[34rem] sm:px-6 sm:py-16 lg:min-h-[38rem] lg:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="word-in mb-6" style={{ animationDelay: "50ms" }}>
            <ol className="flex flex-wrap items-center gap-1 text-xs font-medium text-white/70 sm:text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-white/40" />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-white">{crumb.label}</Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="word-in text-sm font-semibold tracking-[0.18em] text-gold uppercase" style={{ animationDelay: "150ms" }}>{kicker}</p>
        <h1 className="word-in mt-3 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-6xl" style={{ animationDelay: "300ms" }}>{title}</h1>
        {subtitle && (
          <p className="word-in mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg" style={{ animationDelay: "500ms" }}>{subtitle}</p>
        )}
        {children && <div className="word-in mt-6" style={{ animationDelay: "650ms" }}>{children}</div>}
      </div>
    </section>
  );
}
