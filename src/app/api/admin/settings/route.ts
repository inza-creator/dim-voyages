import { prisma } from "@/lib/prisma";
import { defaultSettings } from "@/lib/constants";
import { settingsSchema } from "@/lib/validators";
import { apiError, requireSession } from "@/server/guards";
import { refreshPublic } from "@/server/resources";

export async function GET() {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const rows = await prisma.siteSetting.findMany();
  const settings = { ...defaultSettings };
  rows.forEach((row) => {
    if (row.key in settings) {
      settings[row.key as keyof typeof settings] = row.value;
    }
  });
  return Response.json({ settings });
}

export async function PUT(request: Request) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const body = await request.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) return apiError("Paramètres invalides.");

  const entries = Object.entries(parsed.data.settings).filter(([key]) => key in defaultSettings);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
  refreshPublic();
  return Response.json({ ok: true });
}
