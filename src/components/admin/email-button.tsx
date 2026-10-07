"use client";

import { useState } from "react";

export function EmailButton({ name, email }: { name: string; email: string }) {
  const [open, setOpen] = useState(false);
  const subject = "DIM VOYAGES — votre demande";
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}`;
  const outlook = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center rounded-full bg-white font-semibold text-navy"
      >
        Envoyer un email
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4" role="presentation" onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="email-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="email-title" className="text-lg font-bold text-[#0e4f7c]">
              Envoyer un email
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink">
              {name}
              <br />
              <span className="text-base font-semibold text-[#0e4f7c]">{email}</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-ink">Choisissez où écrire. L&apos;adresse du client est déjà inscrite.</p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-[#0e4f7c]">
                Fermer
              </button>
              <a href={gmail} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#0e4f7c] px-4 py-2.5 text-sm font-semibold text-white">
                Gmail
              </a>
              <a href={outlook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white">
                Outlook
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
