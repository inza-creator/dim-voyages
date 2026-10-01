"use client";

import { useState } from "react";
import { requestTypeLabels } from "@/lib/constants";
import { btnPrimary, whatsappHref } from "@/lib/utils";

const types = ["VOYAGE", "DEVIS", "JUNIOR", "CORPORATE", "SPIRITUEL", "CONTACT"] as const;
type RequestType = (typeof types)[number];

export function RequestForm({
  type = "VOYAGE",
  destination = "",
  travelDate = "",
  compact = false,
}: {
  type?: string;
  destination?: string;
  travelDate?: string;
  compact?: boolean;
}) {
  const initial = types.includes(type as RequestType) ? (type as RequestType) : "VOYAGE";
  const [kind, setKind] = useState<RequestType>(initial);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const travelers = String(form.get("travelers") ?? "");
    const details: Record<string, string> = {};
    ["travelType", "budget", "company", "childName", "childAge", "participants", "subject"].forEach((key) => {
      const value = String(form.get(key) ?? "").trim();
      if (value) details[key] = value;
    });
    const currency = String(form.get("currency") ?? "").trim();
    if (details.budget && currency) details.currency = currency;

    const response = await fetch("/api/demandes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: kind,
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        phone: String(form.get("phone") ?? ""),
        destination: String(form.get("destination") ?? ""),
        travelDate: String(form.get("travelDate") ?? ""),
        travelers: travelers ? Number(travelers) : null,
        message: String(form.get("message") ?? ""),
        details,
        website: String(form.get("website") ?? ""),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "La demande n'a pas pu être envoyée.");
      return;
    }
    setStatus("ok");
    setReference(data.reference);
    setMessage("Votre demande est enregistrée. DIM VOYAGES vous contactera par WhatsApp, téléphone ou email.");
    event.currentTarget.reset();
  }

  if (status === "ok") {
    return (
      <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-orange">Demande envoyée</p>
        <h2 className="mt-2 text-2xl font-bold text-navy">Merci, nous revenons vers vous.</h2>
        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
        {reference && <p className="mt-3 font-semibold text-navy">Référence {reference}</p>}
        <a href={whatsappHref("2250700156981", `Bonjour DIM VOYAGES, ma demande ${reference}`)} className={`${btnPrimary} mt-5`}>
          Continuer sur WhatsApp
        </a>
      </div>
    );
  }

  const field = "h-12 w-full rounded-2xl border border-line bg-sand px-4 text-sm outline-none focus:border-orange";

  return (
    <form onSubmit={onSubmit} className={`rounded-3xl border border-line bg-white p-5 shadow-sm sm:p-6 ${compact ? "" : ""}`}>
      <p className="text-sm font-semibold text-orange">{requestTypeLabels[kind]}</p>
      <h2 className="mt-1 text-2xl font-bold text-navy">Parlez-nous de votre projet</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">
          Type de demande
          <select value={kind} onChange={(event) => setKind(event.target.value as RequestType)} className={`${field} mt-1.5`}>
            {types.map((item) => (
              <option key={item} value={item}>
                {requestTypeLabels[item]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Nom complet
          <input name="fullName" required minLength={2} className={`${field} mt-1.5`} />
        </label>
        <label className="block text-sm font-medium">
          Téléphone / WhatsApp
          <input name="phone" required minLength={8} className={`${field} mt-1.5`} placeholder="07 00 00 00 00" />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Email
          <input name="email" type="email" className={`${field} mt-1.5`} placeholder="vous@email.com" />
        </label>

        {kind !== "CONTACT" && (
          <>
            <label className="block text-sm font-medium">
              Destination
              <input name="destination" defaultValue={destination} className={`${field} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              Date souhaitée
              <input name="travelDate" type="date" defaultValue={travelDate} className={`${field} mt-1.5`} />
            </label>
          </>
        )}

        {(kind === "VOYAGE" || kind === "DEVIS" || kind === "SPIRITUEL") && (
          <label className="block text-sm font-medium">
            Voyageurs
            <input name="travelers" type="number" min={1} className={`${field} mt-1.5`} />
          </label>
        )}
        {kind === "VOYAGE" && (
          <label className="block text-sm font-medium">
            Type de voyage
            <input name="travelType" className={`${field} mt-1.5`} placeholder="Séjour, circuit, famille…" />
          </label>
        )}
        {kind === "DEVIS" && (
          <div className="block text-sm font-medium sm:col-span-2">
            Budget indicatif
            <div className="mt-1.5 flex gap-2">
              <input name="budget" className={field} placeholder="Montant" inputMode="decimal" />
              <select
                name="currency"
                defaultValue="FCFA"
                aria-label="Monnaie"
                className="h-12 w-28 shrink-0 rounded-2xl border border-line bg-sand px-3 text-sm outline-none focus:border-orange"
              >
                <option value="FCFA">FCFA</option>
                <option value="EURO">EURO</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        )}
        {kind === "JUNIOR" && (
          <>
            <label className="block text-sm font-medium">
              Nom de l&apos;enfant ou du groupe
              <input name="childName" className={`${field} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              Âge
              <input name="childAge" className={`${field} mt-1.5`} />
            </label>
          </>
        )}
        {kind === "CORPORATE" && (
          <>
            <label className="block text-sm font-medium">
              Société
              <input name="company" className={`${field} mt-1.5`} />
            </label>
            <label className="block text-sm font-medium">
              Participants
              <input name="participants" className={`${field} mt-1.5`} />
            </label>
          </>
        )}
        {kind === "CONTACT" && (
          <label className="block text-sm font-medium sm:col-span-2">
            Sujet
            <input name="subject" className={`${field} mt-1.5`} />
          </label>
        )}

        <label className="block text-sm font-medium sm:col-span-2">
          Message
          <textarea name="message" required minLength={3} rows={4} className="mt-1.5 w-full rounded-2xl border border-line bg-sand px-4 py-3 text-sm outline-none focus:border-orange" />
        </label>
      </div>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {status === "error" && <p className="mt-3 text-sm text-orange-600">{message}</p>}
      <button type="submit" disabled={status === "loading"} className={`${btnPrimary} mt-5 w-full sm:w-auto`}>
        {status === "loading" ? "Envoi…" : "Envoyer la demande"}
      </button>
      <p className="mt-3 text-xs leading-5 text-muted">
        Aucun paiement en ligne. DIM VOYAGES vous contacte ensuite pour la suite.
      </p>
    </form>
  );
}
