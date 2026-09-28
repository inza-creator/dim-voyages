"use client";

import { useState } from "react";

export function NewsletterForm({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, website: "" }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Inscription impossible.");
      return;
    }
    setStatus("ok");
    setMessage("Vous êtes bien inscrit à la newsletter.");
    setEmail("");
  }

  const field =
    tone === "dark"
      ? "h-12 flex-1 rounded-full border border-white/15 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-orange"
      : "h-12 flex-1 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-orange";

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Adresse email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Votre adresse email"
          className={field}
        />
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          disabled={status === "loading"}
          className="h-12 rounded-full bg-orange px-5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-70"
        >
          {status === "loading" ? "Envoi…" : "S'inscrire"}
        </button>
      </div>
      {message && (
        <p className={status === "error" ? "text-sm text-orange" : "text-sm text-gold"}>{message}</p>
      )}
    </form>
  );
}
