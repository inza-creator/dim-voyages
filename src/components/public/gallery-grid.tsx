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
          const player = embedUrl(item.imageUrl);
          return (
            <figure key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="relative aspect-[4/3]">
                {player ? (
                  <iframe
                    src={player}
                    title={item.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    loading="lazy"
                  />
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
      {visible.length === 0 && <p className="text-muted">{labels.galleryEmpty}</p>}
    </div>
  );
}

function embedUrl(value: string) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return youtubeEmbed(url.pathname.split("/").filter(Boolean)[0]);
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") return youtubeEmbed(url.searchParams.get("v"));
      const [kind, id] = url.pathname.split("/").filter(Boolean);
      if (kind === "embed" || kind === "shorts") return youtubeEmbed(id);
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function youtubeEmbed(id: string | null | undefined) {
  return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
