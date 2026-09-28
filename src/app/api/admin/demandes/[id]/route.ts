import { statusSchema } from "@/lib/validators";
import { apiError, requireSession } from "@/server/guards";
import { updateRequestStatus } from "@/server/requests";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return apiError("Statut invalide.");
  const { id } = await context.params;
  try {
    const item = await updateRequestStatus(id, parsed.data.status);
    return Response.json({ item });
  } catch {
    return apiError("Demande introuvable.", 404);
  }
}
