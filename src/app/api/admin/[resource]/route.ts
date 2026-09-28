import { isResourceKey } from "@/lib/admin-resources";
import { apiError, requireSession } from "@/server/guards";
import { createResource, listResource } from "@/server/resources";

type Context = { params: Promise<{ resource: string }> };

export async function GET(_request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const { resource } = await context.params;
  if (!isResourceKey(resource)) return apiError("Ressource inconnue.", 404);
  const items = await listResource(resource);
  return Response.json({ items });
}

export async function POST(request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const { resource } = await context.params;
  if (!isResourceKey(resource)) return apiError("Ressource inconnue.", 404);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return apiError("Données invalides.");
  const saved = await createResource(resource, body as Record<string, unknown>);
  if (saved && "error" in saved && typeof saved.error === "string") return apiError(saved.error);
  return Response.json({ item: saved });
}
