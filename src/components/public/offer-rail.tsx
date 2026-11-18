"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function OfferRail({
  children,
  previousLabel,
  nextLabel,
}: {
  children: React.ReactNode;
  previousLabel: string;
  nextLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const node = ref.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div ref={ref} className="rail -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8">
        {children}
      </div>
      <div className="mt-2 hidden justify-end gap-2 md:flex">
        <button type="button" onClick={() => scroll(-1)} aria-label={previousLabel} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={nextLabel} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-navy">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
