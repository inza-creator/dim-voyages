import { getLocale } from "@/lib/locale";
import { newsletterSchema } from "@/lib/validators";
import { apiError, clientIp, isRateLimited } from "@/server/guards";
import { subscribeNewsletter } from "@/server/requests";

export async function POST(request: Request) {
  if (isRateLimited(`newsletter:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    const locale = await getLocale();
    return apiError(
      locale === "en"
        ? "Too many attempts. Please try again in a few minutes."
        : "Trop de tentatives. Réessayez dans quelques minutes.",
      429,
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Email invalide.");
  }
  if (parsed.data.website) return Response.json({ ok: true });

  await subscribeNewsletter(parsed.data.email.toLowerCase());
  return Response.json({ ok: true });
}
