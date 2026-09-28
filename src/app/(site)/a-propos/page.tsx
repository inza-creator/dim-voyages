import type { Metadata } from "next";
import { Award } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { ExperienceCard } from "@/components/public/cards";
import { getPublishedExperiences, getSettings } from "@/server/content";

export const metadata: Metadata = { title: "À propos" };

export default async function AboutPage() {
  const [settings, experiences] = await Promise.all([getSettings(), getPublishedExperiences()]);
  return (
    <>
      <PageHero title="À propos de DIM Voyages" subtitle="Le spécialiste du tourisme, à Abidjan." image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-lg leading-8">{settings.aboutText}</p>
            <p className="mt-6 font-script text-4xl text-orange">{settings.signature}</p>
          </div>
          <div className="rounded-[2rem] bg-navy p-6 text-white">
            <Award className="h-8 w-8 text-gold" />
            <p className="mt-3 text-sm text-white/70">Une reconnaissance</p>
            <p className="mt-1 text-2xl font-bold">{settings.award}</p>
            <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div><dt className="text-xl font-bold text-gold">{settings.statYears}</dt><dd className="text-xs text-white/70">Années</dd></div>
              <div><dt className="text-xl font-bold text-gold">{settings.statTravelers}</dt><dd className="text-xs text-white/70">Voyageurs</dd></div>
              <div><dt className="text-xl font-bold text-gold">{settings.statDestinations}</dt><dd className="text-xs text-white/70">Destinations</dd></div>
            </dl>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {experiences.map((item) => (
            <ExperienceCard key={item.id} href={`/experiences/${item.slug}`} title={item.title} subtitle={item.subtitle} imageUrl={item.imageUrl} />
          ))}
        </div>
      </section>
    </>
  );
}
