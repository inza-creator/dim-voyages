"use client";

import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import type { Field, ResourceConfig } from "@/lib/admin-resources";

type Item = Record<string, unknown> & { id: string };

export function ResourceManager({ config, initialItems }: { config: ResourceConfig; initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Item | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }, [items, query]);

  async function refresh() {
    const response = await fetch(`/api/admin/${config.key}`);
    const data = await response.json();
    setItems(data.items ?? []);
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/${config.key}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? "Suppression impossible.");
      return;
    }
    setEditing(null);
    await refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">{config.title}</h1>
          <p className="text-sm text-muted">{config.description}</p>
        </div>
        <button type="button" onClick={() => { setCreating(true); setEditing(null); setError(""); }} className="rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white">
          Ajouter
        </button>
      </div>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrer…" className="h-11 w-full max-w-md rounded-2xl border border-line bg-white px-4 text-sm outline-none focus:border-orange" />
      {error && <p className="text-sm text-orange-600">{error}</p>}
      <ConfirmDialog
        open={pendingDelete !== null}
        message={deletionMessage(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const id = pendingDelete?.id;
          setPendingDelete(null);
          if (id) void remove(id);
        }}
      />
      {(creating || editing) && (
        <Editor
          config={config}
          item={editing}
          onCancel={() => { setCreating(false); setEditing(null); }}
          onSaved={async () => { setCreating(false); setEditing(null); await refresh(); }}
          onError={setError}
        />
      )}
      <div className="overflow-x-auto rounded-3xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs text-muted">
            <tr>
              {config.columns.map((column) => <th key={column.key} className="px-4 py-3 font-medium">{column.label}</th>)}
              <th className="px-4 py-3 font-medium">État</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && <tr><td colSpan={config.columns.length + 2} className="px-4 py-8 text-muted">Aucun élément.</td></tr>}
            {visible.map((item) => (
              <tr key={item.id} className="border-t border-line">
                {config.columns.map((column) => <td key={column.key} className="px-4 py-3">{String(item[column.key] ?? "")}</td>)}
                <td className="px-4 py-3">{item.published === false ? "Brouillon" : "Publié"}</td>
                <td className="px-4 py-3 text-right">
                  <button type="button" className="font-semibold text-sea" onClick={() => { setEditing(item); setCreating(false); }}>Modifier</button>
                  <button type="button" className="ml-3 font-semibold text-orange" onClick={() => setPendingDelete(item)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Editor({
  config,
  item,
  onCancel,
  onSaved,
  onError,
}: {
  config: ResourceConfig;
  item: Item | null;
  onCancel: () => void;
  onSaved: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [state, setState] = useState<Record<string, string | boolean>>(() => initialState(config.fields, item));
  const [loading, setLoading] = useState(false);

  async function upload(file: File) {
    const body = new FormData();
    body.set("file", file);
    const response = await fetch("/api/admin/media", { method: "POST", body });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Envoi impossible.");
    return data.media.url as string;
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    const payload: Record<string, unknown> = {};
    config.fields.forEach((field) => {
      const value = state[field.name];
      if (field.type === "checkbox") payload[field.name] = Boolean(value);
      else if (field.type === "number") payload[field.name] = value === "" || value == null ? null : Number(value);
      else if (field.type === "lines") payload[field.name] = String(value ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
      else payload[field.name] = value ?? "";
    });
    const response = await fetch(item ? `/api/admin/${config.key}/${item.id}` : `/api/admin/${config.key}`, {
      method: item ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) {
      onError(data.error ?? "Enregistrement impossible.");
      return;
    }
    onError("");
    await onSaved();
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-5 shadow-sm">
      <h2 className="font-bold text-navy">{item ? "Modifier" : "Nouveau"} {config.singular}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {config.fields.map((field) => (
          <label key={field.name} className={`block text-sm font-medium ${field.type === "textarea" || field.type === "lines" ? "md:col-span-2" : ""}`}>
            {field.label}
            <FieldControl
              field={field}
              value={state[field.name]}
              onChange={(value) => setState((current) => ({ ...current, [field.name]: value }))}
              onFile={async (file) => {
                const url = await upload(file).catch((error: Error) => {
                  onError(error.message);
                  return "";
                });
                if (url) setState((current) => ({ ...current, [field.name]: url }));
              }}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button disabled={loading} className="rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white">{loading ? "Enregistrement…" : "Enregistrer"}</button>
        <button type="button" onClick={onCancel} className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted">Annuler</button>
      </div>
    </form>
  );
}

function FieldControl({
  field,
  value,
  onChange,
  onFile,
}: {
  field: Field;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
  onFile: (file: File) => void;
}) {
  const klass = "mt-1.5 w-full rounded-2xl border border-line bg-sand px-3 py-2.5 text-sm outline-none focus:border-orange";
  if (field.type === "checkbox") {
    return <input type="checkbox" className="ml-2" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} />;
  }
  if (field.type === "textarea" || field.type === "lines") {
    return (
      <>
        <textarea className={klass} rows={field.type === "lines" ? 4 : 6} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />
        {field.type === "lines" && field.help && <span className="mt-1 block text-xs font-normal text-muted">{field.help}</span>}
      </>
    );
  }
  if (field.type === "select") {
    return (
      <select className={klass} value={String(value ?? field.options[0]?.value ?? "")} onChange={(event) => onChange(event.target.value)}>
        {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    );
  }
  if (field.type === "image") {
    return (
      <div className="mt-1.5 space-y-2">
        {typeof value === "string" && value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-28 w-full rounded-2xl object-cover" />
        )}
        <input className={klass} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} placeholder="URL de l'image" />
        <input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file); }} />
      </div>
    );
  }
  return <input className={klass} type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />;
}

function deletionMessage(item: Item | null) {
  const raw = item?.title ?? item?.name ?? item?.question ?? item?.authorName ?? item?.email;
  const label = typeof raw === "string" ? raw.trim() : "";
  if (label) return `Voulez-vous vraiment supprimer « ${label} » ? Cette action est définitive.`;
  return "Voulez-vous vraiment supprimer cet élément ? Cette action est définitive.";
}

function initialState(fields: Field[], item: Item | null) {
  const state: Record<string, string | boolean> = {};
  fields.forEach((field) => {
    const current = item?.[field.name];
    if (field.type === "checkbox") state[field.name] = item ? Boolean(current) : field.name === "published";
    else if (field.type === "lines" && Array.isArray(current)) state[field.name] = current.join("\n");
    else if (field.type === "date" && typeof current === "string") state[field.name] = current.slice(0, 10);
    else if (current == null) state[field.name] = field.type === "select" ? field.options[0]?.value ?? "" : "";
    else state[field.name] = String(current);
  });
  return state;
}
