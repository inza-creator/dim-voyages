import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validators";
import { apiError, requireAdmin } from "@/server/guards";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => ({}));
  const { id } = await context.params;
  const data: { active?: boolean; role?: "ADMIN" | "EDITOR"; passwordHash?: string; name?: string } = {};

  if (typeof body?.active === "boolean") data.active = body.active;
  if (body?.role === "ADMIN" || body?.role === "EDITOR") data.role = body.role;
  if (typeof body?.name === "string" && body.name.trim().length >= 2) data.name = body.name.trim();
  if (typeof body?.password === "string" && body.password.length > 0) {
    const parsed = passwordSchema.safeParse({ password: body.password });
    if (!parsed.success) return apiError("8 caractères minimum.");
    data.passwordHash = await bcrypt.hash(parsed.data.password, 12);
  }

  if (data.active === false && auth.user && auth.user.id === id) {
    return apiError("Vous ne pouvez pas désactiver votre propre compte.");
  }

  try {
    const item = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });
    return Response.json({ item });
  } catch {
    return apiError("Utilisateur introuvable.", 404);
  }
}

export async function DELETE(_request: Request, context: Context) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const { id } = await context.params;
  if (auth.user && auth.user.id === id) return apiError("Vous ne pouvez pas supprimer votre propre compte.");
  try {
    await prisma.user.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return apiError("Utilisateur introuvable.", 404);
  }
}
