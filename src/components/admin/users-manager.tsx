"use client";

import { useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";

type UserItem = { id: string; name: string; email: string; role: "ADMIN" | "EDITOR"; active: boolean };

export function UsersManager({ initialItems, currentId }: { initialItems: UserItem[]; currentId: string }) {
  const [items, setItems] = useState(initialItems);
  const [error, setError] = useState("");
  const [pendingUser, setPendingUser] = useState<UserItem | null>(null);

  async function refresh() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();
    setItems(data.items ?? []);
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Création impossible.");
      return;
    }
    setError("");
    event.currentTarget.reset();
    await refresh();
  }

  async function update(id: string, payload: Record<string, unknown>) {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) setError(data.error ?? "Mise à jour impossible.");
    else setError("");
    await refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Suppression impossible.");
      return;
    }
    setError("");
    await refresh();
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-navy">Utilisateurs</h1>
      {error && <p className="text-sm text-orange-600">{error}</p>}
      <ConfirmDialog
        open={pendingUser !== null}
        message={pendingUser ? `Voulez-vous vraiment supprimer l'utilisateur ${pendingUser.name} ? Cette action est définitive.` : ""}
        onCancel={() => setPendingUser(null)}
        onConfirm={() => {
          const id = pendingUser?.id;
          setPendingUser(null);
          if (id) void remove(id);
        }}
      />
      <form onSubmit={create} className="grid gap-3 rounded-3xl bg-white p-5 shadow-sm md:grid-cols-4">
        <input name="name" required placeholder="Nom" className="h-11 rounded-2xl border border-line px-3" />
        <input name="email" type="email" required placeholder="Email" className="h-11 rounded-2xl border border-line px-3" />
        <input name="password" type="password" minLength={8} required placeholder="Mot de passe" className="h-11 rounded-2xl border border-line px-3" />
        <div className="flex gap-2">
          <select name="role" className="h-11 flex-1 rounded-2xl border border-line px-3">
            <option value="EDITOR">Éditeur</option>
            <option value="ADMIN">Administrateur</option>
          </select>
          <button className="rounded-full bg-orange px-4 text-sm font-semibold text-white">Ajouter</button>
        </div>
      </form>
      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-xs text-muted"><tr><th className="px-4 py-3">Nom</th><th>Email</th><th>Rôle</th><th>Actif</th><th /></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-line">
                <td className="px-4 py-3 font-semibold">{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <select value={item.role} onChange={(event) => update(item.id, { role: event.target.value })} className="rounded-xl border border-line px-2 py-1">
                    <option value="EDITOR">Éditeur</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                </td>
                <td>
                  <input type="checkbox" checked={item.active} disabled={item.id === currentId} onChange={(event) => update(item.id, { active: event.target.checked })} />
                </td>
                <td className="px-4 text-right">
                  {item.id !== currentId && (
                    <button
                      type="button"
                      className="font-semibold text-orange"
                      onClick={() => setPendingUser(item)}
                    >
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
