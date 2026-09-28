import type { Metadata } from "next";
import { FaqList } from "@/components/public/faq-list";
import { PageHero } from "@/components/public/page-hero";
import { getPublishedFaqs, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const [items, settings] = await Promise.all([getPublishedFaqs(), getSettings()]);
  return (
    <>
      <PageHero title="Questions fréquentes" subtitle="Les réponses utiles avant d'envoyer votre demande." image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <FaqList items={items} />
      </section>
    </>
  );
}
