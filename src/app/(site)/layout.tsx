import { SiteHeader } from "@/components/public/header";
import { SiteFooter } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { getPublishedServices, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { localizeSettings } from "@/lib/localize";
import { absoluteUrl, JsonLd, siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [rawSettings, locale, services] = await Promise.all([getSettings(), getLocale(), getPublishedServices()]);
  const settings = localizeSettings(rawSettings, locale);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          name: "DIM VOYAGES",
          url: siteUrl,
          logo: absoluteUrl("/logo-dim-voyages.png"),
          image: absoluteUrl(settings.heroImageUrl),
          telephone: settings.phone,
          email: settings.email,
          slogan: settings.signature,
          award: settings.award,
          address: { "@type": "PostalAddress", streetAddress: settings.address, addressLocality: "Abidjan", addressCountry: "CI" },
          sameAs: [settings.facebook, settings.instagram, settings.linkedin].filter((link) => link.startsWith("http")),
        }}
      />
      <div className="flex min-h-screen flex-col">
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter
          settings={settings}
          locale={locale}
          services={services.map((service) => ({ href: `/services/${service.slug}`, label: service.title }))}
        />
      </div>
      <WhatsAppButton phone={settings.whatsapp} label={copy(locale).whatsapp} />
    </>
  );
}
