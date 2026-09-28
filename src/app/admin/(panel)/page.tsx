import Link from "next/link";
import { CheckCircle2, Clock3, Inbox, Sparkles } from "lucide-react";
import { requestStatusLabels, requestTypeLabels } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { getDashboard } from "@/server/dashboard";

const typeColors: Record<string, string> = {
  VOYAGE: "#1f6fe5",
  DEVIS: "#f47a1a",
  JUNIOR: "#14b8a6",
  CORPORATE: "#7c3aed",
  SPIRITUEL: "#e6b325",
  CONTACT: "#64748b",
};

export default async function DashboardPage() {
  const data = await getDashboard();
  const max = Math.max(...data.days.map((day) => day.count), 1);
  const points = data.days
    .map((day, index) => {
      const x = (index / 29) * 320;
      const y = 120 - (day.count / max) * 90;
      return `${x},${y}`;
    })
    .join(" ");
  const totalTypes = data.byType.reduce((sum, item) => sum + item._count.type, 0);
  const circumference = 2 * Math.PI * 42;
  let offset = 0;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const requestDays = new Set(data.latestRequests.map((item) => item.createdAt.toISOString().slice(0, 10)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Tableau de bord</h1>
        <p className="text-sm text-muted">Vue d&apos;ensemble de l&apos;activité DIM VOYAGES.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={<Inbox className="h-5 w-5" />} label="Demandes reçues" value={data.total} tone="text-sea" />
        <Stat icon={<Sparkles className="h-5 w-5" />} label="Nouvelles demandes" value={data.newCount} tone="text-orange" />
        <Stat icon={<Clock3 className="h-5 w-5" />} label="En cours de traitement" value={data.inProgress} tone="text-sea" />
        <Stat icon={<CheckCircle2 className="h-5 w-5" />} label="Terminées" value={data.doneCount} tone="text-whatsapp" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-navy">Évolution des demandes (30 jours)</h2>
          <svg viewBox="0 0 320 140" className="mt-4 h-48 w-full">
            <polyline fill="none" stroke="#1f6fe5" strokeWidth="3" points={points} />
          </svg>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-navy">Répartition des demandes</h2>
          {totalTypes === 0 ? (
            <p className="mt-8 text-sm text-muted">Les demandes apparaîtront ici dès qu&apos;un formulaire sera envoyé.</p>
          ) : (
            <div className="mt-4 flex items-center gap-4">
              <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
                {data.byType.map((item) => {
                  const length = (item._count.type / totalTypes) * circumference;
                  const dash = `${length} ${circumference - length}`;
                  const circle = (
                    <circle key={item.type} cx="60" cy="60" r="42" fill="none" stroke={typeColors[item.type]} strokeWidth="14" strokeDasharray={dash} strokeDashoffset={-offset} />
                  );
                  offset += length;
                  return circle;
                })}
              </svg>
              <ul className="space-y-1 text-sm">
                {data.byType.map((item) => (
                  <li key={item.type} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: typeColors[item.type] }} />
                    {requestTypeLabels[item.type]} · {item._count.type}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-bold text-navy">Dernières demandes</h2>
            <Link href="/admin/demandes" className="text-sm font-semibold text-orange">Voir tout</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs text-muted">
                <tr>
                  <th className="px-5 py-2 font-medium">Référence</th>
                  <th className="px-3 py-2 font-medium">Client</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.latestRequests.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-8 text-muted">Aucune demande pour le moment.</td></tr>
                )}
                {data.latestRequests.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="px-5 py-3 font-semibold"><Link href={`/admin/demandes/${item.id}`}>{item.reference}</Link></td>
                    <td className="px-3 py-3">{item.fullName}</td>
                    <td className="px-3 py-3">{requestTypeLabels[item.type]}</td>
                    <td className="px-3 py-3">{requestStatusLabels[item.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="font-bold text-navy">Gestion du contenu</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {[
                ["/admin/experiences", "Expériences", data.counts.experiences],
                ["/admin/services", "Services", data.counts.services],
                ["/admin/destinations", "Destinations", data.counts.destinations],
                ["/admin/offres", "Offres", data.counts.offers],
                ["/admin/actualites", "Actualités", data.counts.articles],
                ["/admin/temoignages", "Témoignages", data.counts.testimonials],
                ["/admin/faq", "FAQ", data.counts.faqs],
                ["/admin/galerie", "Galerie", data.counts.gallery],
                ["/admin/newsletter", "Newsletter", data.counts.subscribers],
              ].map(([href, label, count]) => (
                <Link key={String(href)} href={String(href)} className="rounded-2xl bg-sand px-3 py-3 hover:bg-orange/10">
                  <span className="block text-lg font-bold text-navy">{count}</span>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="font-bold text-navy">{now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</h2>
            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
              {["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}${index}`} className="text-muted">{day}</span>)}
              {Array.from({ length: firstWeekday }, (_, index) => <span key={`e${index}`} />)}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const key = new Date(year, month, day).toISOString().slice(0, 10);
                const today = day === now.getDate();
                return (
                  <span key={day} className={`rounded-full py-1 ${today ? "bg-orange text-white" : ""} ${requestDays.has(key) ? "font-bold text-sea" : ""}`}>{day}</span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <h2 className="font-bold text-navy">Dernières actions</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {data.activity.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="font-semibold text-navy">{item.label}</Link>
                <p className="text-xs text-muted">{item.meta} · {formatDateTime(item.at)}</p>
              </li>
            ))}
          </ul>
        </div>
        {data.latestTestimonial && (
          <div className="rounded-3xl bg-navy p-5 text-white">
            <p className="text-sm text-white/60">Dernier témoignage publié</p>
            <p className="mt-3 leading-7">{data.latestTestimonial.content}</p>
            <p className="mt-4 font-semibold">{data.latestTestimonial.authorName}</p>
            <p className="text-sm text-white/60">{data.latestTestimonial.location}</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-sand ${tone}`}>{icon}</span>
      <p className="mt-4 text-3xl font-bold text-navy">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </article>
  );
}
