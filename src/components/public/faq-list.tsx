"use client";

import { useState } from "react";

export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <div key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : item.id)}
            >
              {item.question}
              <span className="text-orange">{expanded ? "–" : "+"}</span>
            </button>
            {expanded && <p className="px-5 pb-5 text-sm leading-6 text-muted">{item.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
