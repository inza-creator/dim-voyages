"use client";

import { FormEvent, useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { formatDateTime } from "@/lib/utils";

type Subscriber = { id: string; email: string; active: boolean; createdAt: string };

export function NewsletterBoard({ initialItems }: { initialItems: Subscriber[] }) {
  const [items, setItems] = useState(initialItems);
  const [pendingEmail, setPendingEmail] = useState<Subscriber | null>(null);
  const [composing, setComposing] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeError, setNoticeError] = useState(false);

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
    await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setNotice("");
    const response = await fetch("/api/admin/newsletter/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message }),
    });
    const data = await response.json().catch(() => ({}));
    setSending(false);
    if (!response.ok) {
      setNoticeError(true);
      setNotice(data.error ?? "Envoi impossible.");
      return;
    }
    setNoticeError(false);
    setNotice(`Message envoyé à ${data.sent} adresse(s).`);
    setSubject("");
    setMessage("");
    setComposing(false);
  }

  const activeCount = items.filter((item) => item.active).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Newsletter</h1>
          <p className="text-sm text-muted">{activeCount} adresse(s) active(s).</p>
        </div>
        <button type="button" onClick={() => { setComposing((open) => !open); setNotice(""); }} className="rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white">
          Écrire un message
        </button>
      </div>
      {notice && !composing && <p className={`text-sm ${noticeError ? "text-orange-600" : "text-sea"}`}>{notice}</p>}
      {composing && (
        <form onSubmit={sendMessage} className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium text-navy">
            Objet
            <input value={subject} onChange={(event) => setSubject(event.target.value)} required maxLength={150} className="mt-1.5 h-12 w-full rounded-2xl border border-line px-4 text-sm font-normal outline-none focus:border-orange" />
          </label>
          <label className="block text-sm font-medium text-navy">
            Message
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} required minLength={3} maxLength={5000} rows={8} className="mt-1.5 w-full rounded-2xl border border-line px-4 py-3 text-sm font-normal outline-none focus:border-orange" />
          </label>
          <p className="text-sm text-muted">Ce message part vers les {activeCount} adresse(s) active(s). Les adresses désactivées ne le reçoivent pas.</p>
          {notice && <p className={`text-sm ${noticeError ? "text-orange-600" : "text-sea"}`}>{notice}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setComposing(false)} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-[#0e4f7c]">Fermer</button>
            <button type="submit" disabled={sending || activeCount === 0} className="rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">
              {sending ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </form>
      )}
      <ConfirmDialog
        open={pendingEmail !== null}
        message={pendingEmail ? `Voulez-vous vraiment retirer ${pendingEmail.email} de la newsletter ?` : ""}
        onCancel={() => setPendingEmail(null)}
        onConfirm={() => {
          const id = pendingEmail?.id;
          setPendingEmail(null);
          if (id) void remove(id);
        }}
      />
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
                <td className="px-4 text-right"><button type="button" onClick={() => setPendingEmail(item)} className="font-semibold text-orange">Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
