import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { requestTypeLabels } from "@/lib/constants";
import { getSettings } from "@/server/content";

export const metadata: Metadata = { title: "Demande" };

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; destination?: string; date?: string }>;
}) {
  const params = await searchParams;
  const settings = await getSettings();
  const title = requestTypeLabels[params.type ?? "VOYAGE"] ?? "Demande de voyage";
  return (
    <>
      <PageHero title={title} subtitle="Dites-nous l'essentiel. Un conseiller DIM VOYAGES vous répond." image={settings.heroImageUrl} />
      <section className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
        <RequestForm type={params.type} destination={params.destination} travelDate={params.date} />
      </section>
    </>
  );
}
