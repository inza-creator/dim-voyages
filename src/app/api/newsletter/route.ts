import { newsletterSchema } from "@/lib/validators";
import { apiError } from "@/server/guards";
import { subscribeNewsletter } from "@/server/requests";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Email invalide.");
  }
  if (parsed.data.website) return Response.json({ ok: true });

  await subscribeNewsletter(parsed.data.email.toLowerCase());
  return Response.json({ ok: true });
}
