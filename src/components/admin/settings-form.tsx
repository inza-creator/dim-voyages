"use client";

import { useState } from "react";
import type { PublicSettings } from "@/lib/constants";

const labels: Record<keyof PublicSettings, string> = {
  phone: "Téléphone affiché",
  whatsapp: "WhatsApp (format international, sans +)",
  email: "Email",
  address: "Adresse",
  heroImageUrl: "Image principale de l'accueil",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  statYears: "Années d'expérience",
  statTravelers: "Voyageurs",
  statDestinations: "Destinations",
  signature: "Signature",
  award: "Reconnaissance",
  aboutText: "Texte À propos",
};

export function SettingsForm({ initial }: { initial: PublicSettings }) {
  const [settings, setSettings] = useState(initial);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });
    setMessage(response.ok ? "Paramètres enregistrés." : "Enregistrement impossible.");
  }

  async function uploadHero(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json();
    if (response.ok) setSettings((current) => ({ ...current, heroImageUrl: data.media.url }));
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Mot de passe modifié." : data.error ?? "Modification impossible.");
    if (response.ok) setPassword("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
      <form onSubmit={save} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-navy">Paramètres</h1>
        {(Object.keys(labels) as (keyof PublicSettings)[]).map((key) => (
          <label key={key} className="block text-sm font-medium">
            {labels[key]}
            {key === "aboutText" ? (
              <textarea value={settings[key]} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} rows={5} className="mt-1.5 w-full rounded-2xl border border-line px-3 py-2" />
            ) : (
              <input value={settings[key]} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} className="mt-1.5 h-11 w-full rounded-2xl border border-line px-3" />
            )}
          </label>
        ))}
        {settings.heroImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.heroImageUrl} alt="Aperçu de l'accueil" className="h-40 w-full rounded-2xl object-cover" />
        )}
        <label className="block text-sm font-medium">
          Remplacer l&apos;image d&apos;accueil
          <input type="file" accept="image/*" className="mt-2 block" onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadHero(file); }} />
        </label>
        <button className="rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white">Enregistrer</button>
        {message && <p className="text-sm text-muted">{message}</p>}
      </form>
      <form onSubmit={changePassword} className="h-fit rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="font-bold text-navy">Mot de passe</h2>
        <input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-3 h-11 w-full rounded-2xl border border-line px-3" placeholder="Nouveau mot de passe" />
        <button className="mt-3 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white">Mettre à jour</button>
      </form>
    </div>
  );
}
