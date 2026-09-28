import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { passwordSchema } from "@/lib/validators";
import { apiError, requireSession } from "@/server/guards";

export async function PATCH(request: Request) {
  const auth = await requireSession();
  if (auth.response || !auth.user) return auth.response;
  const body = await request.json().catch(() => null);
  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success) return apiError("8 caractères minimum.");

  await prisma.user.update({
    where: { id: auth.user.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) },
  });
  return Response.json({ ok: true });
}
