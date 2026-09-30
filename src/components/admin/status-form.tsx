"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { requestStatusLabels } from "@/lib/constants";

export function StatusForm({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState("");

  async function save() {
    const response = await fetch(`/api/admin/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    const data = await response.json().catch(() => ({}));
    setMessage(response.ok ? "Statut mis à jour." : data.error ?? "Mise à jour impossible.");
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <StatusBadge status={value} />
      <label className="mt-3 block text-sm font-medium">
        Statut
        <select value={value} onChange={(event) => setValue(event.target.value)} className="mt-1.5 h-11 w-full rounded-2xl border border-line px-3">
          {Object.entries(requestStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <button type="button" onClick={save} className="mt-3 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white">Enregistrer</button>
      {message && <p className="mt-2 text-sm text-muted">{message}</p>}
    </div>
  );
}
