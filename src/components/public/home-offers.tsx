import { OfferCard } from "@/components/public/cards";

type HomeOffer = {
  id: string;
  slug: string;
  title: string;
  destinationLabel: string;
  priceFrom: number | null;
  badge: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
};

function packsOfFour(offers: HomeOffer[]) {
  const packs: HomeOffer[][] = [];
  for (let index = 0; index < offers.length; index += 4) {
    packs.push(offers.slice(index, index + 4));
  }
  return packs;
}

function OfferGrid({
  offers,
  fromLabel,
}: {
  offers: HomeOffer[];
  fromLabel: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          href={`/offres/${offer.slug}`}
          title={offer.title}
          destination={offer.destinationLabel}
          priceFrom={offer.priceFrom}
          badge={offer.badge}
          imageUrl={offer.imageUrl}
          imageUrls={[offer.imageUrl2, offer.imageUrl3]}
          fromLabel={fromLabel}
        />
      ))}
    </div>
  );
}

export function HomeOffers({
  offers,
  fromLabel,
}: {
  offers: HomeOffer[];
  fromLabel: string;
}) {
  const packs = packsOfFour(offers);
  const count = packs.length;
  const seconds = 6;

  if (count <= 1) {
    return <OfferGrid offers={offers} fromLabel={fromLabel} />;
  }

  const visible = (100 / count) * 0.8;
  const hideFrom = 100 / count;

  return (
    <div className="relative">
      <style>{`
        @keyframes home-offer-pack {
          0%, ${visible}% { opacity: 1; z-index: 2; pointer-events: auto; }
          ${hideFrom}%, 100% { opacity: 0; z-index: 0; pointer-events: none; }
        }
      `}</style>
      {packs.map((pack, index) => (
        <div
          key={pack.map((offer) => offer.id).join("-")}
          className={index === 0 ? undefined : "absolute inset-0"}
          style={{
            animationName: "home-offer-pack",
            animationDuration: `${count * seconds}s`,
            animationDelay: `${index * seconds}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        >
          <OfferGrid offers={pack} fromLabel={fromLabel} />
        </div>
      ))}
    </div>
  );
}
