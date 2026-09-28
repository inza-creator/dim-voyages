import { whatsappHref } from "@/lib/utils";

function Glyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 12 23a11 11 0 0 0 8.5-19.5zM12 21a9 9 0 0 1-4.6-1.3l-.3-.2-3.8.6.7-3.7-.2-.3A9 9 0 1 1 12 21zm5-6.7c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.3-.4c.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1.6 1.6 0 0 0-1.1.5 3.3 3.3 0 0 0-1 2.4 5.7 5.7 0 0 0 1.2 3 13 13 0 0 0 5 4.3 11 11 0 0 0 1.6.6 3.8 3.8 0 0 0 1.8.1 2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.2-.3-.2-.6-.3z" />
    </svg>
  );
}

export function WhatsAppButton({ phone }: { phone: string }) {
  return (
    <div className="fixed right-4 bottom-24 z-50 sm:right-6 lg:bottom-6">
      <div className="relative">
        <span className="wa-bubble pointer-events-none absolute right-[4.5rem] bottom-2 hidden max-w-[11rem] rounded-2xl rounded-br-md bg-white px-3 py-2 text-sm font-semibold text-navy shadow-xl sm:block">
          Besoin d&apos;un conseil ?
        </span>
        <span className="wa-ring pointer-events-none absolute inset-0 rounded-full bg-orange/40" />
        <span className="wa-ring wa-ring-delay pointer-events-none absolute inset-0 rounded-full bg-whatsapp/50" />
        <a
          href={whatsappHref(phone)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Écrire à DIM VOYAGES sur WhatsApp"
          className="wa-btn relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_rgba(30,190,93,0.35)] ring-4 ring-orange/80"
        >
          <Glyph />
        </a>
      </div>
    </div>
  );
}
