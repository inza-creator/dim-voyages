import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const requests = query.length < 2
    ? []
    : await prisma.travelRequest.findMany({
        where: {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { reference: { contains: query, mode: "insensitive" } },
            { phone: { contains: query } },
          ],
        },
        take: 8,
      });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-navy">Recherche</h1>
      <form>
        <input name="q" defaultValue={query} className="h-12 w-full max-w-xl rounded-2xl border border-line bg-white px-4" placeholder="Nom, téléphone, référence…" />
      </form>
      {query.length >= 2 && (
        <section>
          <h2 className="mb-2 font-bold text-navy">Demandes</h2>
          <div className="space-y-2">
            {requests.length === 0 ? (
              <p className="text-sm text-muted">Aucun résultat.</p>
            ) : (
              requests.map((item) => (
                <Link key={item.id} href={`/admin/demandes/${item.id}`} className="block rounded-2xl bg-white px-4 py-3">
                  {item.reference} — {item.fullName}
                </Link>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
