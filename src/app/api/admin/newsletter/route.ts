import { requireSession } from "@/server/guards";
import { listSubscribers } from "@/server/requests";

export async function GET(request: Request) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const items = await listSubscribers();
  const format = new URL(request.url).searchParams.get("format");
  if (format === "csv") {
    const lines = ["email,actif,inscrit_le", ...items.map((item) => `${item.email},${item.active ? "oui" : "non"},${item.createdAt.toISOString()}`)];
    return new Response(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=newsletter-dim-voyages.csv",
      },
    });
  }
  return Response.json({ items });
}
