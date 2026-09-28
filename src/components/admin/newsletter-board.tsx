"use client";

import { useState } from "react";
import { formatDateTime } from "@/lib/utils";

type Subscriber = { id: string; email: string; active: boolean; createdAt: string };

export function NewsletterBoard({ initialItems }: { initialItems: Subscriber[] }) {
  const [items, setItems] = useState(initialItems);

  async function refresh() {
    const response = await fetch("/api/admin/newsletter");
    const data = await response.json();
    setItems(data.items ?? []);
  }

  async function toggle(item: Subscriber) {
    await fetch(`/api/admin/newsletter/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    await refresh();
  }

  async function remove(id: string) {
    if (!confirm("Retirer cette adresse ?")) return;
    await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Newsletter</h1>
          <p className="text-sm text-muted">{items.filter((item) => item.active).length} adresse(s) active(s).</p>
        </div>
        <a href="/api/admin/newsletter?format=csv" className="rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white">Exporter CSV</a>
      </div>
      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-muted"><tr><th className="px-4 py-3">Email</th><th>Inscrit le</th><th>Actif</th><th /></tr></thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-muted">Aucune inscription.</td></tr>}
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3">{item.email}</td>
                <td>{formatDateTime(item.createdAt)}</td>
                <td><button type="button" onClick={() => toggle(item)} className="font-semibold text-sea">{item.active ? "Oui" : "Non"}</button></td>
                <td className="px-4 text-right"><button type="button" onClick={() => remove(item.id)} className="font-semibold text-orange">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
