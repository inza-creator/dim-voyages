export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatPrice(value?: number | null) {
  if (value == null) return "";
  return `${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
}

export function formatDate(value: Date | string, locale: "fr" | "en" = "fr") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatLongDate(value = new Date()) {
  const label = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function whatsappHref(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    text ?? "Bonjour DIM VOYAGES, je souhaite des informations pour organiser un voyage.",
  );
  return `https://wa.me/${digits}?text=${message}`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-orange px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20";

export const btnNavy =
  "inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-800";

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
