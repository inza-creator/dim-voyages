"use client";

import { btnPrimary } from "@/lib/utils";

export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-navy">La page n&apos;a pas pu s&apos;afficher</h1>
      <p className="mt-3 text-muted">Réessayez dans un instant. Si le problème continue, contactez DIM VOYAGES.</p>
      <button type="button" onClick={reset} className={`${btnPrimary} mt-6`}>Réessayer</button>
    </div>
  );
}
