import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { whatsappHref } from "@/lib/utils";
import { getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { localizeSettings } from "@/lib/localize";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).nav.contact };
}

export default async function ContactPage() {
  const [rawSettings, locale] = await Promise.all([getSettings(), getLocale()]);
  const settings = localizeSettings(rawSettings, locale);
  const t = copy(locale).pages;
  return (
    <>
      <PageHero title={t.contactTitle} subtitle={t.contactText} image={settings.heroImageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="space-y-4">
          <Info icon={<MapPin className="h-5 w-5" />} label={t.address} value={settings.address} />
          <Info icon={<Phone className="h-5 w-5" />} label={t.phone} value={settings.phone} href={`tel:${settings.phone.replace(/\s/g, "")}`} />
          <Info icon={<Mail className="h-5 w-5" />} label={t.email} value={settings.email} href={`mailto:${settings.email}`} />
          <a href={whatsappHref(settings.whatsapp)} className="flex h-12 items-center justify-center rounded-full bg-whatsapp font-semibold text-white">
            {t.writeWhatsapp}
          </a>
          <iframe
            title={t.map}
            className="h-64 w-full rounded-3xl border-0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=-4.12%2C5.28%2C-3.90%2C5.42&layer=mapnik&marker=5.345%2C-4.024"
          />
        </div>
        <RequestForm type="CONTACT" locale={locale} />
      </section>
    </>
  );
}

function Info({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange/10 text-orange">{icon}</span>
      <span>
        <span className="block text-xs font-semibold text-muted">{label}</span>
        <span className="font-semibold text-navy">{value}</span>
      </span>
    </>
  );
  const className = "flex items-center gap-3 rounded-3xl bg-white p-4 shadow-sm";
  return href ? <a href={href} className={className}>{content}</a> : <div className={className}>{content}</div>;
}
