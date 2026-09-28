"use client";

import { FormEvent, useState } from "react";
import { Logo } from "@/components/public/logo";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? "Connexion impossible.");
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.href = next && next.startsWith("/admin") ? next : "/admin";
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-navy bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block">
        <div className="flex h-full flex-col justify-end bg-navy/70 p-10 text-white">
          <p className="font-script text-5xl text-orange">Le chemin vers soi.</p>
          <p className="mt-3 max-w-md text-white/80">L&apos;espace de gestion de DIM VOYAGES.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-12">
        <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <Logo className="h-16" />
          <h1 className="mt-6 text-2xl font-bold text-navy">Connexion</h1>
          <p className="mt-1 text-sm text-muted">Accès réservé à l&apos;équipe DIM VOYAGES.</p>
          <label className="mt-6 block text-sm font-medium">
            Email
            <input name="email" type="email" required className="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 outline-none focus:border-orange" />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Mot de passe
            <input name="password" type="password" required minLength={8} className="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 outline-none focus:border-orange" />
          </label>
          {error && <p className="mt-3 text-sm text-orange-600">{error}</p>}
          <button type="submit" disabled={loading} className="mt-6 h-12 w-full rounded-full bg-orange font-semibold text-white hover:bg-orange-600 disabled:opacity-70">
            {loading ? "Connexion…" : "Entrer"}
          </button>
        </form>
      </div>
    </div>
  );
}
