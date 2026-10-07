"use client";

import { useState } from "react";

export function CallButton({ name, phone }: { name: string; phone: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  function close() {
    setOpen(false);
    setCopied(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(phone);
    setCopied(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center rounded-full bg-white font-semibold text-navy"
      >
        Appeler
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="presentation" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="call-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="call-title" className="text-lg font-bold text-[#0e4f7c]">
              Appeler
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink">
              {name}
              <br />
              <span className="text-base font-semibold text-[#0e4f7c]">{phone}</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-ink">Copiez le numéro, puis appelez depuis votre téléphone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={close} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-[#0e4f7c]">
                Fermer
              </button>
              <button type="button" onClick={copy} className="rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white">
                {copied ? "Numéro copié" : "Copier le numéro"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
