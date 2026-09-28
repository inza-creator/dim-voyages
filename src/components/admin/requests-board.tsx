"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { requestStatusLabels, requestTypeLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

type RequestItem = {
  id: string;
  reference: string;
  type: string;
  status: string;
  fullName: string;
  phone: string;
  destination: string;
  createdAt: string;
};

export function RequestsBoard({ initialItems }: { initialItems: RequestItem[] }) {
  const [status, setStatus] = useState("TOUS");
  const [type, setType] = useState("TOUS");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesStatus = status === "TOUS" || item.status === status;
      const matchesType = type === "TOUS" || item.type === type;
      const haystack = `${item.reference} ${item.fullName} ${item.phone} ${item.destination}`.toLowerCase();
      return matchesStatus && matchesType && haystack.includes(query.trim().toLowerCase());
    });
  }, [initialItems, query, status, type]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Demandes</h1>
        <p className="text-sm text-muted">Les formulaires du site arrivent ici. DIM contacte ensuite le client.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nom, téléphone, référence…" className="h-11 rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-orange" />
        <select value={type} onChange={(event) => setType(event.target.value)} className="h-11 rounded-2xl border border-line bg-white px-3 text-sm">
          <option value="TOUS">Tous les types</option>
          {Object.entries(requestTypeLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="h-11 rounded-2xl border border-line bg-white px-3 text-sm">
          <option value="TOUS">Tous les statuts</option>
          {Object.entries(requestStatusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Référence</th>
              <th className="px-3 py-3 font-medium">Client</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 font-medium">Destination</th>
              <th className="px-3 py-3 font-medium">Statut</th>
              <th className="px-3 py-3 font-medium">Reçue</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-muted">Aucune demande.</td></tr>}
            {visible.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3 font-semibold"><Link href={`/admin/demandes/${item.id}`} className="text-sea">{item.reference}</Link></td>
                <td className="px-3 py-3">{item.fullName}<br /><span className="text-xs text-muted">{item.phone}</span></td>
                <td className="px-3 py-3">{requestTypeLabels[item.type]}</td>
                <td className="px-3 py-3">{item.destination || "—"}</td>
                <td className="px-3 py-3">{requestStatusLabels[item.status]}</td>
                <td className="px-3 py-3">{formatDateTime(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
