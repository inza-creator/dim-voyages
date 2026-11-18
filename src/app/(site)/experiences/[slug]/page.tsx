import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { RequestForm } from "@/components/public/request-form";
import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/public/reveal";
import { experienceRequestType } from "@/lib/constants";
import { getExperience, getSettings } from "@/server/content";
import { whatsappHref } from "@/lib/utils";
import { getLocale } from "@/lib/locale";
import { copy } from "@/lib/i18n";
import { breadcrumbLd, JsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [item, locale] = await Promise.all([getExperience(slug), getLocale()]);
  if (!item) return { title: copy(locale).pages.experience };
  return pageMetadata({ title: item.title, description: item.excerpt || item.subtitle, path: `/experiences/${slug}`, image: item.imageUrl, locale });
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const [item, settings, locale] = await Promise.all([getExperience(slug), getSettings(), getLocale()]);
  if (!item) notFound();
  const t = copy(locale);
  const crumbs = [
    { href: "/", label: t.offer.home },
    { href: "/experiences", label: t.pages.experiencesTitle },
    { label: item.title },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs.map((crumb) => ({ name: crumb.label, path: crumb.href ?? `/experiences/${slug}` })))} />
      <PageHero kicker={t.pages.experience} title={item.title} subtitle={item.subtitle} image={item.imageUrl} breadcrumbs={crumbs} />
      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <Reveal>
            <p className="text-xl leading-9 whitespace-pre-line text-ink/85">{item.description}</p>
          </Reveal>
          {item.highlights.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {item.highlights.map((point, index) => (
                <li key={point}>
                  <Reveal delay={index * 80} className="flex h-full items-start gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-navy shadow-sm">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    {point}
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
          <Reveal className="mt-8 flex flex-wrap gap-4 rounded-3xl bg-navy p-6 text-white">
            <div className="flex-1">
              <p className="font-script text-3xl text-gold">{t.pages.destinationsBeyond}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/85">
                {t.offer.reassurance.map((line) => (
                  <li key={line} className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-gold" />{line}</li>
                ))}
              </ul>
            </div>
            <a href={whatsappHref(settings.whatsapp, t.offer.destinationMessage.replace("{name}", item.title))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-end rounded-full bg-whatsapp px-5 py-3 text-sm font-semibold text-white hover:brightness-110">
              <MessageCircle className="h-4 w-4" />
              {t.offer.whatsapp}
            </a>
          </Reveal>
        </div>
        <Reveal delay={150} className="lg:sticky lg:top-28 lg:self-start">
          <RequestForm type={experienceRequestType[item.slug] ?? "VOYAGE"} locale={locale} />
        </Reveal>
      </section>
    </>
  );
}
