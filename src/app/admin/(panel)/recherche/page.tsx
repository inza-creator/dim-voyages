import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [requests, offers, destinations, articles] = query.length < 2
    ? [[], [], [], []]
    : await Promise.all([
        prisma.travelRequest.findMany({
          where: { OR: [{ fullName: { contains: query, mode: "insensitive" } }, { reference: { contains: query, mode: "insensitive" } }, { phone: { contains: query } }] },
          take: 8,
        }),
        prisma.offer.findMany({ where: { title: { contains: query, mode: "insensitive" } }, take: 8 }),
        prisma.destination.findMany({ where: { name: { contains: query, mode: "insensitive" } }, take: 8 }),
        prisma.article.findMany({ where: { title: { contains: query, mode: "insensitive" } }, take: 8 }),
      ]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-navy">Recherche</h1>
      <form>
        <input name="q" defaultValue={query} className="h-12 w-full max-w-xl rounded-2xl border border-line bg-white px-4" placeholder="Demande, destination, offre…" />
      </form>
      {query.length >= 2 && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Group title="Demandes" empty={requests.length === 0}>
            {requests.map((item) => <Link key={item.id} href={`/admin/demandes/${item.id}`} className="block rounded-2xl bg-white px-4 py-3">{item.reference} — {item.fullName}</Link>)}
          </Group>
          <Group title="Offres" empty={offers.length === 0}>
            {offers.map((item) => <Link key={item.id} href="/admin/offres" className="block rounded-2xl bg-white px-4 py-3">{item.title}</Link>)}
          </Group>
          <Group title="Destinations" empty={destinations.length === 0}>
            {destinations.map((item) => <Link key={item.id} href="/admin/destinations" className="block rounded-2xl bg-white px-4 py-3">{item.name}</Link>)}
          </Group>
          <Group title="Actualités" empty={articles.length === 0}>
            {articles.map((item) => <Link key={item.id} href="/admin/actualites" className="block rounded-2xl bg-white px-4 py-3">{item.title}</Link>)}
          </Group>
        </div>
      )}
    </div>
  );
}

function Group({ title, empty, children }: { title: string; empty: boolean; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 font-bold text-navy">{title}</h2>
      <div className="space-y-2">{empty ? <p className="text-sm text-muted">Aucun résultat.</p> : children}</div>
    </section>
  );
}
