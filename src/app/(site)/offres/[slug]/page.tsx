import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { formatPrice } from "@/lib/utils";
import { getOffer } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getOffer(slug);
  return { title: item?.title ?? "Offre" };
}

export default async function OfferPage({ params }: Props) {
  const { slug } = await params;
  const item = await getOffer(slug);
  if (!item) notFound();
  return (
    <>
      <PageHero kicker={item.destinationLabel} title={item.title} subtitle={item.excerpt} image={item.imageUrl} />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <article>
          {item.priceFrom != null && <p className="text-lg font-bold text-navy">À partir de {formatPrice(item.priceFrom)}</p>}
          <p className="mt-4 text-lg leading-8">{item.description}</p>
        </article>
        <RequestForm type="DEVIS" destination={item.destinationLabel} />
      </section>
    </>
  );
}
