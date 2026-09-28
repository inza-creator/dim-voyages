"use client";

import { useState } from "react";

type Media = { id: string; url: string; alt: string; filename: string; size: number };

export function MediaManager({ initialItems }: { initialItems: Media[] }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/media");
    const data = await response.json();
    setItems(data.items ?? []);
  }

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Envoi impossible.");
      return;
    }
    setError("");
    await refresh();
  }

  async function saveAlt(id: string, alt: string) {
    await fetch(`/api/admin/media/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette image ? Les contenus qui l'utilisent perdront cette image.")) return;
    const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Suppression impossible.");
      return;
    }
    await refresh();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-navy">Médias</h1>
        <p className="text-sm text-muted">Les fichiers sont stockés sur le serveur. La base ne conserve que leur adresse.</p>
      </div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-sea/40 bg-white px-6 py-8 text-sm font-semibold text-sea">
        Choisir une image à envoyer
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(file); }} />
      </label>
      {error && <p className="text-sm text-orange-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.length === 0 && <p className="text-sm text-muted">Aucune image envoyée. Les visuels actuels du site sont des photos provisoires, remplaçables depuis chaque contenu.</p>}
        {items.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt} className="h-44 w-full object-cover" />
            <div className="space-y-2 p-4">
              <input defaultValue={item.alt} onBlur={(event) => saveAlt(item.id, event.target.value)} className="h-10 w-full rounded-xl border border-line px-3 text-sm" placeholder="Texte alternatif" />
              <p className="truncate text-xs text-muted">{item.url}</p>
              <button type="button" onClick={() => remove(item.id)} className="text-sm font-semibold text-orange">Supprimer</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
