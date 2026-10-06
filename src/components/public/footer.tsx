import Link from "next/link";
import { Logo } from "@/components/public/logo";
import { NewsletterForm } from "@/components/public/newsletter-form";
import type { PublicSettings } from "@/lib/constants";
import { copy, type Locale } from "@/lib/i18n";
import { whatsappHref } from "@/lib/utils";

export function SiteFooter({
  settings,
  locale,
  services,
}: {
  settings: PublicSettings;
  locale: Locale;
  services: { href: string; label: string }[];
}) {
  const t = copy(locale);
  const quick = [
    { href: "/", label: t.nav.home },
    { href: "/experiences", label: t.nav.experiences },
    { href: "/destinations", label: t.nav.destinations },
    { href: "/offres", label: t.nav.offers },
    { href: "/galerie", label: t.nav.gallery },
    { href: "/actualites", label: t.nav.news },
    { href: "/faq", label: t.nav.faq },
    { href: "/contact", label: t.nav.contact },
  ];
  const experiences = [
    { href: "/experiences/dim-junior", label: "DIM Junior" },
    { href: "/experiences/dim-corporate", label: "DIM Corporate" },
    { href: "/experiences/voyages-spirituels", label: t.footer.spiritual },
  ];
  const year = new Date().getFullYear();
  const socials = [
    { href: settings.facebook, label: "Facebook" as const },
    { href: settings.instagram, label: "Instagram" as const },
    { href: settings.linkedin, label: "LinkedIn" as const },
  ].filter((item) => item.href.startsWith("http"));

  return (
    <footer className="relative mt-8 overflow-hidden bg-[#0e4f7c] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 text-gold" aria-hidden>
        <svg viewBox="0 0 1440 110" className="h-full w-full" preserveAspectRatio="none">
          <path
            d="M-10 78 C 180 18, 360 18, 560 64 S 980 120, 1460 36"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="7 9"
          />
        </svg>
        <span className="absolute top-5 right-[14%] text-lg">✈</span>
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pt-20 pb-8 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <Logo className="h-16" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/90">
            {t.footer.intro}
          </p>
          <p className="mt-4 text-sm font-semibold leading-6 text-gold">{settings.signature}</p>
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white hover:border-orange hover:text-orange"
                >
                  <SocialLogo name={item.label} />
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title={t.footer.quick} links={quick} />
        <FooterColumn title={t.footer.experiences} links={experiences} />
        <FooterColumn title={t.footer.services} links={services} />

        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/15 bg-white p-5 text-center text-[#0e4f7c] shadow-sm">
            <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">{t.footer.hours}</p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold">{t.footer.weekdays}</dt>
                <dd>{t.footer.weekHours}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t.footer.saturday}</dt>
                <dd>{t.footer.saturdayHours}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t.footer.sunday}</dt>
                <dd>{t.footer.closed}</dd>
              </div>
            </dl>
            <a
              href={whatsappHref(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex h-12 items-center justify-center rounded-full bg-whatsapp text-sm font-semibold text-white"
            >
              {t.footer.advisor}
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#14639a] px-5 py-5 text-white sm:px-8">
          <div className="grid items-center gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="font-semibold">{t.footer.newsTitle}</p>
              <p className="mt-1 text-sm text-white/90">{t.footer.newsText}</p>
            </div>
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {year} DIM Voyages. {t.footer.rights}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/faq" className="hover:text-orange">{t.footer.help}</Link>
          <Link href="/mentions-legales" className="hover:text-orange">{t.footer.legal}</Link>
          <Link href="/politique-de-confidentialite" className="hover:text-orange">{t.footer.privacy}</Link>
          <Link href="/conditions-d-utilisation" className="hover:text-orange">{t.footer.terms}</Link>
        </div>
      </div>
    </footer>
  );
}

function SocialLogo({ name }: { name: "Facebook" | "Instagram" | "LinkedIn" }) {
  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
        <path d="M15.1 8.5h-2v-1c0-.6.4-1 1-1h1V4h-2c-1.7 0-3 1.4-3 3.1V8.5H8.2V11h1.9V20h2.7v-9H15l.4-2.5h-2.3z" />
      </svg>
    );
  }
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden fill="currentColor">
      <path d="M6.7 9.2H4V20h2.7V9.2zM5.3 4a1.6 1.6 0 1 0 0 3.2A1.6 1.6 0 0 0 5.3 4zM20 20h-2.7v-5.3c0-1.5-.5-2.5-1.8-2.5-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20H11V9.2h2.6v1.5c.4-.7 1.2-1.7 2.9-1.7 2.1 0 3.5 1.4 3.5 4.3V20z" />
    </svg>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="lg:col-span-2">
      <p className="text-sm font-bold">{title}</p>
      <ul className="mt-3 space-y-2 text-sm text-white/90">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hover:text-orange">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
