"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  HelpCircle,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Menu,
  Newspaper,
  Settings,
  Sparkles,
  Tags,
  Users,
  X,
} from "lucide-react";
import type { SessionUser } from "@/lib/auth";
import { Logo } from "@/components/public/logo";

const links = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/demandes", label: "Demandes", icon: Inbox },
  { href: "/admin/experiences", label: "Expériences", icon: Sparkles },
  { href: "/admin/services", label: "Services", icon: Tags },
  { href: "/admin/destinations", label: "Destinations", icon: Map },
  { href: "/admin/offres", label: "Offres", icon: CalendarDays },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/temoignages", label: "Témoignages", icon: BookOpen },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/galerie", label: "Galerie", icon: Images },
  { href: "/admin/medias", label: "Médias", icon: Images },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users, admin: true },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminShell({
  user,
  today,
  newCount,
  children,
}: {
  user: SessionUser;
  today: string;
  newCount: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visible = links.filter((link) => !link.admin || user.role === "ADMIN");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  const nav = (
    <div className="flex h-full flex-col bg-navy text-white">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/admin" onClick={() => setOpen(false)}>
          <Logo className="h-12" />
        </Link>
        <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Fermer le menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <p className="px-5 pb-2 text-xs font-semibold tracking-wide text-white/45 uppercase">Back-office</p>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {visible.map((link) => {
          const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold ${
                active ? "bg-orange text-white" : "text-white/75 hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{link.label}</span>
              {link.href === "/admin/demandes" && newCount > 0 && (
                <span className="rounded-full bg-white/20 px-2 text-xs">{newCount}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={logout} className="m-3 flex items-center gap-2 rounded-2xl px-3 py-3 text-sm text-white/70 hover:bg-white/10">
        <LogOut className="h-4 w-4" />
        Se déconnecter
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-navy/50" aria-label="Fermer" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">{nav}</div>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur">
          <button type="button" className="grid h-10 w-10 place-items-center rounded-xl lg:hidden" onClick={() => setOpen(true)} aria-label="Ouvrir le menu">
            <Menu className="h-5 w-5" />
          </button>
          <form action="/admin/recherche" className="hidden flex-1 md:block">
            <input name="q" placeholder="Rechercher une demande, une destination, un contenu…" className="h-11 w-full rounded-2xl border border-line bg-sand px-4 text-sm outline-none focus:border-orange" />
          </form>
          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-sm text-muted xl:block">{today}</p>
            <Link href="/admin/demandes" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-sand" aria-label="Nouvelles demandes">
              <Bell className="h-5 w-5" />
              {newCount > 0 && <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-orange px-1 text-[10px] font-bold text-white">{newCount}</span>}
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-navy">{user.name}</p>
              <p className="text-xs text-muted">{user.role === "ADMIN" ? "Administrateur" : "Éditeur"}</p>
            </div>
          </div>
        </header>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
