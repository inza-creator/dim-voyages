import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { userSchema } from "@/lib/validators";
import { apiError, requireAdmin } from "@/server/guards";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const items = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return Response.json({ items });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.issues[0]?.message ?? "Utilisateur invalide.");

  const email = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return apiError("Cet email est déjà utilisé.");

  const item = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      role: parsed.data.role,
      passwordHash: await bcrypt.hash(parsed.data.password, 12),
    },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  return Response.json({ item });
}
