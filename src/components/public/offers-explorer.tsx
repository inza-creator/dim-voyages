"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { OfferCard } from "@/components/public/cards";

type ExplorerOffer = {
  id: string;
  slug: string;
  title: string;
  destinationLabel: string;
  destinationId: string | null;
  priceFrom: number | null;
  badge: string;
  imageUrl: string;
  imageUrl2: string;
  imageUrl3: string;
  featured: boolean;
  sortOrder: number;
};

type Labels = {
  all: string;
  destination: string;
  formula: string;
  budget: string;
  sort: string;
  sortFeatured: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  under500: string;
  from500: string;
  over1500: string;
  results: string;
  result: string;
  none: string;
  reset: string;
};

const budgets = {
  under500: (price: number) => price < 500000,
  from500: (price: number) => price >= 500000 && price <= 1500000,
  over1500: (price: number) => price > 1500000,
};

type Budget = keyof typeof budgets | "";
type Sort = "featured" | "asc" | "desc";

export function OffersExplorer({
  offers,
  destinations,
  labels,
  fromLabel,
}: {
  offers: ExplorerOffer[];
  destinations: { id: string; name: string }[];
  labels: Labels;
  fromLabel: string;
}) {
  const [destination, setDestination] = useState("");
  const [formula, setFormula] = useState("");
  const [budget, setBudget] = useState<Budget>("");
  const [sort, setSort] = useState<Sort>("featured");

  const formulas = useMemo(
    () => Array.from(new Set(offers.map((offer) => offer.badge).filter((badge) => badge && !badge.startsWith("-")))).sort((a, b) => a.localeCompare(b)),
    [offers],
  );
  const usedDestinations = destinations.filter((item) => offers.some((offer) => offer.destinationId === item.id));

  const visible = useMemo(() => {
    const list = offers.filter((offer) => {
      if (destination && offer.destinationId !== destination) return false;
      if (formula && offer.badge !== formula) return false;
      if (budget && (offer.priceFrom == null || !budgets[budget](offer.priceFrom))) return false;
      return true;
    });
    if (sort === "featured") return list;
    return [...list].sort((a, b) => {
      const left = a.priceFrom ?? Number.MAX_SAFE_INTEGER;
      const right = b.priceFrom ?? Number.MAX_SAFE_INTEGER;
      return sort === "asc" ? left - right : right - left;
    });
  }, [offers, destination, formula, budget, sort]);

  const filtered = destination || formula || budget;
  const select = "h-11 w-full rounded-full border border-line bg-white px-4 text-sm font-medium text-navy outline-none focus:border-orange";

  return (
    <div>
      <div className="sticky top-[4.75rem] z-30 -mx-4 border-b border-line bg-sand/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => setDestination("")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${destination === "" ? "bg-navy text-white" : "bg-white text-navy hover:bg-navy/5"}`}
          >
            {labels.all}
          </button>
          {usedDestinations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setDestination(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${destination === item.id ? "bg-navy text-white" : "bg-white text-navy hover:bg-navy/5"}`}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
          <label className="block">
            <span className="sr-only">{labels.formula}</span>
            <select value={formula} onChange={(event) => setFormula(event.target.value)} className={select}>
              <option value="">{labels.formula} : {labels.all}</option>
              {formulas.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">{labels.budget}</span>
            <select value={budget} onChange={(event) => setBudget(event.target.value as Budget)} className={select}>
              <option value="">{labels.budget} : {labels.all}</option>
              <option value="under500">{labels.under500}</option>
              <option value="from500">{labels.from500}</option>
              <option value="over1500">{labels.over1500}</option>
            </select>
          </label>
          <label className="col-span-2 block md:col-span-1">
            <span className="sr-only">{labels.sort}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)} className={select}>
              <option value="featured">{labels.sort} : {labels.sortFeatured}</option>
              <option value="asc">{labels.sortPriceAsc}</option>
              <option value="desc">{labels.sortPriceDesc}</option>
            </select>
          </label>
          <p className="col-span-2 flex items-center gap-2 text-sm text-muted md:col-span-1 md:justify-end">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="font-semibold text-navy">{visible.length}</span> {visible.length > 1 ? labels.results : labels.result}
            {filtered && (
              <button type="button" onClick={() => { setDestination(""); setFormula(""); setBudget(""); }} className="ml-2 font-semibold text-orange hover:text-orange-600">
                {labels.reset}
              </button>
            )}
          </p>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">{labels.none}</p>
      ) : (
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((offer, index) => (
            <div key={`${offer.id}-${destination}-${formula}-${budget}-${sort}`} className="rise h-full" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
              <OfferCard
                href={`/offres/${offer.slug}`}
                title={offer.title}
                destination={offer.destinationLabel}
                priceFrom={offer.priceFrom}
                badge={offer.badge}
                imageUrl={offer.imageUrl}
                imageUrls={[offer.imageUrl2, offer.imageUrl3]}
                fromLabel={fromLabel}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
