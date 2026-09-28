import { apiError, requireSession } from "@/server/guards";
import { deleteMedia, updateMediaAlt } from "@/server/media";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  const alt = typeof body?.alt === "string" ? body.alt : "";
  const { id } = await context.params;
  try {
    const media = await updateMediaAlt(id, alt);
    return Response.json({ media });
  } catch {
    return apiError("Image introuvable.", 404);
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const { id } = await context.params;
  const result = await deleteMedia(id);
  if ("error" in result && typeof result.error === "string") return apiError(result.error, 404);
  return Response.json({ ok: true });
}
