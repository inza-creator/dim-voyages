"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/public/logo";
import { LanguageSwitch } from "@/components/public/language-switch";
import { copy, type Locale } from "@/lib/i18n";

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = copy(locale);
  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/experiences", label: t.nav.experiences },
    { href: "/services", label: t.nav.services },
    { href: "/destinations", label: t.nav.destinations },
    { href: "/offres", label: t.nav.offers },
    { href: "/a-propos", label: t.nav.about },
    { href: "/galerie", label: t.nav.gallery },
    { href: "/actualites", label: t.nav.news },
    { href: "/faq", label: t.nav.faq },
    { href: "/contact", label: t.nav.contact },
  ];
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#c5dff0] bg-[#e7f3fb] text-[#0e4f7c] shadow-sm">
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
                  active ? "text-orange" : "hover:text-orange"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitch locale={locale} label={t.header.language} />
          <Link
            href="/demande?type=DEVIS"
            className="hidden rounded-full bg-orange px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 lg:inline-flex"
          >
            {t.header.quote}
          </Link>
          <button
            type="button"
            className="relative z-20 grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-[#0e4f7c]/10 xl:hidden"
            aria-label={open ? t.header.closeMenu : t.header.openMenu}
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
              <button type="button" className="absolute inset-0 bg-black/25" aria-label={t.header.closeMenu} onClick={() => setOpen(false)} />
              <div id="mobile-menu" className="menu-drawer absolute inset-y-0 right-0 w-[65%] overflow-y-auto bg-[#e7f3fb] px-5 pb-28 pt-4 text-[#0e4f7c] shadow-2xl lg:w-[72%]">
                <div className="mb-6 flex items-center justify-between gap-3">
                  <Logo className="h-14" />
                  <button type="button" onClick={() => setOpen(false)} aria-label={t.header.closeMenu} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0e4f7c]/10">
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
                        className={`border-b border-[#0e4f7c]/15 px-1 py-3.5 text-lg font-semibold ${active ? "text-orange" : "hover:text-orange"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
                <Link
                  href="/demande?type=DEVIS"
                  onClick={() => setOpen(false)}
                  className="mt-6 flex h-12 items-center justify-center rounded-full bg-orange font-semibold text-white"
                >
                  {t.header.quote}
                </Link>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
