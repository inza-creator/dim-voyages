"use client";

import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitch({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();

  function choose(next: Locale) {
    if (next === locale) return;
    document.cookie = `locale=${next};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full bg-[#f5f3ee] p-0.5" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => choose("fr")}
        aria-pressed={locale === "fr"}
        aria-label="Français"
        className={`grid h-7 w-10 place-items-center rounded-full ${locale === "fr" ? "bg-[#0e4f7c]" : "bg-transparent"}`}
      >
        <FlagFr />
      </button>
      <button
        type="button"
        onClick={() => choose("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
        className={`grid h-7 w-10 place-items-center rounded-full ${locale === "en" ? "bg-[#0e4f7c]" : "bg-transparent"}`}
      >
        <FlagGb />
      </button>
    </div>
  );
}

function FlagFr() {
  return (
    <svg viewBox="0 0 3 2" className="h-3.5 w-5 overflow-hidden rounded-sm" aria-hidden>
      <rect width="1" height="2" fill="#0055A4" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#EF4135" />
    </svg>
  );
}

function FlagGb() {
  return (
    <svg viewBox="0 0 60 30" className="h-3.5 w-5 overflow-hidden rounded-sm" aria-hidden>
      <path d="M0 0h60v30H0z" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
