import { prisma } from "@/lib/prisma";
import { apiError, requireSession } from "@/server/guards";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  const { id } = await context.params;
  try {
    const item = await prisma.newsletterSubscriber.update({
      where: { id },
      data: { active: Boolean(body?.active) },
    });
    return Response.json({ item });
  } catch {
    return apiError("Contact introuvable.", 404);
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const { id } = await context.params;
  try {
    await prisma.newsletterSubscriber.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return apiError("Contact introuvable.", 404);
  }
}
