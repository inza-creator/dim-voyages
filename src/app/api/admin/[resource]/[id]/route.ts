import { isResourceKey } from "@/lib/admin-resources";
import { apiError, requireSession } from "@/server/guards";
import { deleteResource, updateResource } from "@/server/resources";

type Context = { params: Promise<{ resource: string; id: string }> };

export async function PATCH(request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const { resource, id } = await context.params;
  if (!isResourceKey(resource)) return apiError("Ressource inconnue.", 404);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") return apiError("Données invalides.");

  try {
    const saved = await updateResource(resource, id, body as Record<string, unknown>);
    if (saved && "error" in saved && typeof saved.error === "string") return apiError(saved.error);
    return Response.json({ item: saved });
  } catch {
    return apiError("Élément introuvable.", 404);
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const { resource, id } = await context.params;
  if (!isResourceKey(resource)) return apiError("Ressource inconnue.", 404);
  try {
    await deleteResource(resource, id);
    return Response.json({ ok: true });
  } catch {
    return apiError("Élément introuvable.", 404);
  }
}
