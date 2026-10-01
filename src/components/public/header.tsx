"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, Search, X } from "lucide-react";
import { navLinks, type PublicSettings } from "@/lib/constants";
import { whatsappHref } from "@/lib/utils";
import { Logo } from "@/components/public/logo";

type Result = { type: string; title: string; href: string };

export function SiteHeader({ settings }: { settings: PublicSettings }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, searchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results ?? []);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    if (results[0]) router.push(results[0].href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white text-navy shadow-sm xl:border-0 xl:bg-navy xl:text-white xl:shadow-lg">
      <div className="mx-auto flex min-h-[4.75rem] w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 py-2" aria-label="DIM VOYAGES, accueil">
          <Logo priority className="h-14 sm:h-16" />
        </Link>

        <nav className="ml-4 hidden flex-1 items-center justify-center gap-x-3 xl:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-[13px] font-semibold transition ${
                  active ? "text-orange" : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-navy hover:bg-navy/10 xl:text-white/90 xl:hover:bg-white/10"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5" />
          </button>
          <a
            href={whatsappHref(settings.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-10 items-center rounded-full bg-whatsapp px-3 text-sm font-semibold text-white sm:inline-flex"
          >
            WhatsApp
          </a>
          <Link
            href="/demande?type=DEVIS"
            className="hidden rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 lg:inline-flex"
          >
            Demander un devis
          </Link>
          <button
            type="button"
            className="relative z-20 grid h-11 w-11 shrink-0 place-items-center rounded-full text-navy hover:bg-navy/10 xl:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[55]">
              <button type="button" className="absolute inset-0 bg-black/25" aria-label="Fermer le menu" onClick={() => setOpen(false)} />
              <div id="mobile-menu" className="menu-drawer absolute inset-y-0 right-0 w-[65%] overflow-y-auto bg-navy px-5 pb-28 pt-4 text-white shadow-2xl lg:w-[72%]">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <Logo className="h-14" />
                  <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="flex flex-col" aria-label="Menu">
                  {navLinks.map((link) => {
                    const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`border-b border-white/10 px-1 py-3.5 text-lg font-semibold ${active ? "text-orange" : "hover:text-white"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <Link
                  href="/demande?type=DEVIS"
                  onClick={() => setOpen(false)}
                  className="mt-6 flex h-12 items-center justify-center rounded-full bg-orange font-semibold"
                >
                  Demander un devis
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted && searchOpen
        ? createPortal(
            <div className="fixed inset-0 z-[80] bg-navy/70 px-4 pt-24 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div className="mx-auto max-w-xl rounded-3xl bg-white p-4 text-ink shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <form onSubmit={submitSearch}>
              <label className="sr-only" htmlFor="site-search">Recherche</label>
              <input
                id="site-search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Destination, offre, expérience…"
                className="h-12 w-full rounded-2xl border border-line px-4 outline-none focus:border-orange"
              />
            </form>
            <ul className="mt-3 max-h-80 overflow-auto">
              {results.map((result) => (
                <li key={result.href}>
                  <Link href={result.href} className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-sand">
                    <span className="font-medium">{result.title}</span>
                    <span className="text-xs font-semibold text-orange">{result.type}</span>
                  </Link>
                </li>
              ))}
              {query.trim().length >= 2 && results.length === 0 && (
                <li className="px-3 py-4 text-sm text-muted">Aucun résultat.</li>
              )}
            </ul>
          </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
