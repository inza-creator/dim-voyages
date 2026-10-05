import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RequestForm } from "@/components/public/request-form";
import { PageHero } from "@/components/public/page-hero";
import { experienceRequestType } from "@/lib/constants";
import { getExperience } from "@/server/content";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getExperience(slug);
  return { title: item?.title ?? copy(await getLocale()).pages.experience };
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const [item, locale] = await Promise.all([getExperience(slug), getLocale()]);
  if (!item) notFound();
  const t = copy(locale);

  return (
    <>
      <PageHero kicker={t.pages.experience} title={item.title} subtitle={item.subtitle} image={item.imageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <article>
          <p className="text-lg leading-8 text-ink/85">{item.description}</p>
          <ul className="mt-6 space-y-2">
            {item.highlights.map((point) => (
              <li key={point} className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-navy">{point}</li>
            ))}
          </ul>
        </article>
        <RequestForm type={experienceRequestType[item.slug] ?? "VOYAGE"} locale={locale} />
      </section>
    </>
  );
}
