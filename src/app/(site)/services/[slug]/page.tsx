import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { getService } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getService(slug);
  return { title: item?.title ?? copy(await getLocale()).pages.service };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const [item, locale] = await Promise.all([getService(slug), getLocale()]);
  if (!item) notFound();
  const t = copy(locale);
  return (
    <>
      <PageHero kicker={t.pages.service} title={item.title} subtitle={item.excerpt} image={item.imageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <p className="text-lg leading-8">{item.description}</p>
        <RequestForm type="DEVIS" locale={locale} />
      </section>
    </>
  );
}
