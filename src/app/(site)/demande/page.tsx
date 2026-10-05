import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const text = copy(await getLocale());
  const kind = params.type ?? "VOYAGE";
  const title = kind in text.types ? text.types[kind as keyof typeof text.types] : text.types.VOYAGE;
  return { title };
}

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; destination?: string; date?: string }>;
}) {
  const params = await searchParams;
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  const text = copy(locale);
  const kind = params.type ?? "VOYAGE";
  const title = kind in text.types ? text.types[kind as keyof typeof text.types] : text.types.VOYAGE;
  return (
    <>
      <PageHero title={title} subtitle={text.pages.requestLead} image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <RequestForm type={params.type} destination={params.destination} travelDate={params.date} locale={locale} />
      </section>
    </>
  );
}
