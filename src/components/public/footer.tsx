import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
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
    { href: settings.facebook, label: "Facebook" },
    { href: settings.instagram, label: "Instagram" },
    { href: settings.linkedin, label: "LinkedIn" },
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
                  className="rounded-full border border-white/25 px-3 py-1.5 text-xs font-semibold text-white/90 hover:border-orange hover:text-orange"
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title={t.footer.quick} links={quick} />
        <FooterColumn title={t.footer.experiences} links={experiences} />
        <FooterColumn title={t.footer.services} links={services} />

        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/15 bg-white p-5 text-[#0e4f7c] shadow-sm">
            <p className="text-xs font-bold tracking-[0.16em] text-gold uppercase">{t.footer.contact}</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                {settings.address}
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            </ul>
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
