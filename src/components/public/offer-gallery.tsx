"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { MediaImage } from "@/components/public/media-image";

export function OfferGallery({
  images,
  title,
  labels,
}: {
  images: string[];
  title: string;
  labels: { open: string; close: string; previous: string; next: string };
}) {
  const [open, setOpen] = useState<number | null>(null);
  const count = images.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (direction: 1 | -1) => setOpen((value) => (value == null ? value : (value + direction + count) % count)),
    [count],
  );

  useEffect(() => {
    if (open == null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  if (count === 0) return null;

  return (
    <>
      <div className={`grid gap-3 ${count === 1 ? "" : "sm:grid-cols-[2fr_1fr]"}`}>
        <button
          type="button"
          onClick={() => setOpen(0)}
          className="group relative block aspect-[16/10] overflow-hidden rounded-3xl sm:aspect-auto sm:min-h-[26rem]"
          aria-label={labels.open}
        >
          <MediaImage src={images[0]} alt={title} priority sizes="(max-width:768px) 100vw, 60vw" className="object-cover transition duration-700 group-hover:scale-105" />
          <span className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-navy shadow-lg backdrop-blur">
            <Expand className="h-4 w-4" />
            {labels.open}
          </span>
        </button>
        {count > 1 && (
          <div className="hidden gap-3 sm:grid">
            {images.slice(1, 3).map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpen(index + 1)}
                className="group relative block min-h-[12.6rem] overflow-hidden rounded-3xl"
                aria-label={`${labels.open} ${index + 2}`}
              >
                <MediaImage src={src} alt="" sizes="30vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </button>
            ))}
          </div>
        )}
      </div>

      {open != null &&
        createPortal(
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={close}>
            <button type="button" onClick={close} aria-label={labels.close} className="absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="h-6 w-6" />
            </button>
            {count > 1 && (
              <>
                <button type="button" onClick={(event) => { event.stopPropagation(); step(-1); }} aria-label={labels.previous} className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button type="button" onClick={(event) => { event.stopPropagation(); step(1); }} aria-label={labels.next} className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
              <MediaImage src={images[open]} alt={title} sizes="100vw" className="object-contain" />
            </div>
            <p className="absolute bottom-6 text-sm font-semibold text-white/80">
              {open + 1} / {count}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
