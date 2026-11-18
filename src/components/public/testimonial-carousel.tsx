"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { Stars } from "@/components/public/cards";
import { initials } from "@/lib/utils";

type Item = { id: string; authorName: string; location: string; content: string; rating: number };

export function TestimonialCarousel({ items, label }: { items: Item[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % count), 7000);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  return (
    <div
      className="relative mx-auto max-w-3xl text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label={label}
    >
      <Quote className="mx-auto h-12 w-12 text-gold" aria-hidden />
      <div className="relative mt-6 grid">
        {items.map((item, slide) => (
          <figure
            key={item.id}
            className={`col-start-1 row-start-1 transition-all duration-700 ${
              slide === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
            aria-hidden={slide !== index}
          >
            <blockquote className="text-xl leading-relaxed font-medium text-white sm:text-2xl sm:leading-relaxed">
              « {item.content} »
            </blockquote>
            <figcaption className="mt-8 flex items-center justify-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-orange text-sm font-bold text-white">{initials(item.authorName)}</span>
              <span className="text-left">
                <span className="block font-semibold text-white">{item.authorName}</span>
                {item.location && <span className="block text-sm text-white/60">{item.location}</span>}
              </span>
            </figcaption>
            <div className="mt-3 flex justify-center">
              <Stars rating={item.rating} />
            </div>
          </figure>
        ))}
      </div>
      {count > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {items.map((item, slide) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(slide)}
              aria-label={`${slide + 1} / ${count}`}
              aria-current={slide === index}
              className={`h-2.5 rounded-full transition-all ${slide === index ? "w-8 bg-orange" : "w-2.5 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
