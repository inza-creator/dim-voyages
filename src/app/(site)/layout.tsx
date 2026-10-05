import { SiteHeader } from "@/components/public/header";
import { SiteFooter } from "@/components/public/footer";
import { WhatsAppButton } from "@/components/public/whatsapp-button";
import { getPublishedServices, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, locale, services] = await Promise.all([getSettings(), getLocale(), getPublishedServices()]);

  return (
    <>
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
