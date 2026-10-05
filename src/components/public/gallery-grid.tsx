"use client";

import { useState } from "react";
import { MediaImage } from "@/components/public/media-image";
import { copy, type Locale } from "@/lib/i18n";

export function GalleryGrid({
  items,
  locale = "fr",
}: {
  items: { id: string; title: string; caption: string; category: string; imageUrl: string }[];
  locale?: Locale;
}) {
  const labels = copy(locale).pages;
  const filters = [
    { id: "TOUT", label: labels.galleryAll },
    { id: "PHOTO", label: labels.galleryPhotos },
    { id: "VIDEO", label: labels.galleryVideos },
    { id: "EVENEMENT", label: labels.galleryEvents },
  ] as const;
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("TOUT");
  const visible = items.filter((item) => filter === "TOUT" || item.category === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              filter === item.id ? "bg-navy text-white" : "bg-white text-navy"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {visible.map((item) => {
          const video = /youtube|youtu\.be|vimeo/.test(item.imageUrl);
          return (
            <figure key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                {video ? (
                  <a href={item.imageUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 grid place-items-center bg-navy text-sm font-semibold text-white">
                    Voir la vidéo
                  </a>
                ) : (
                  <MediaImage src={item.imageUrl} alt={item.title} sizes="(max-width:768px) 50vw, 33vw" />
                )}
              </div>
              <figcaption className="p-3">
                <p className="font-semibold text-navy">{item.title}</p>
                {item.caption && <p className="text-sm text-muted">{item.caption}</p>}
              </figcaption>
            </figure>
          );
        })}
      </div>
      {visible.length === 0 && <p className="text-muted">Aucun visuel dans cette catégorie.</p>}
    </div>
  );
}
