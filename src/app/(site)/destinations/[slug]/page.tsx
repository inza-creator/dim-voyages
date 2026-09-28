import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferCard } from "@/components/public/cards";
import { PageHero } from "@/components/public/page-hero";
import { RequestForm } from "@/components/public/request-form";
import { getDestination } from "@/server/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getDestination(slug);
  return { title: item?.name ?? "Destination" };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const item = await getDestination(slug);
  if (!item) notFound();
  return (
    <>
      <PageHero title={item.name} subtitle={item.excerpt} image={item.imageUrl} />
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-lg leading-8">{item.description}</p>
        {item.offers.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {item.offers.map((offer) => (
              <OfferCard key={offer.id} href={`/offres/${offer.slug}`} title={offer.title} destination={offer.destinationLabel} priceFrom={offer.priceFrom} badge={offer.badge} imageUrl={offer.imageUrl} />
            ))}
          </div>
        )}
        <div className="mt-10 max-w-3xl">
          <RequestForm type="VOYAGE" destination={item.name} />
        </div>
      </section>
    </>
  );
}
