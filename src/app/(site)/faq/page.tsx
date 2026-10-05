import type { Metadata } from "next";
import { FaqList } from "@/components/public/faq-list";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedFaqs, getSettings } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  return { title: copy(await getLocale()).pages.faqTitle };
}

export default async function FaqPage() {
  const [items, settings, locale] = await Promise.all([getPublishedFaqs(), getSettings(), getLocale()]);
  const t = copy(locale).pages;
  return (
    <>
      <PageHero title={t.faqTitle} subtitle={t.faqText} image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <FaqList items={items} />
      </section>
    </>
  );
}
