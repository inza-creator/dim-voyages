import { getLocale } from "@/lib/locale";
import { requestSchema } from "@/lib/validators";
import { apiError, clientIp, isRateLimited } from "@/server/guards";
import { createTravelRequest } from "@/server/requests";

export async function POST(request: Request) {
  if (isRateLimited(`demande:${clientIp(request)}`, 5, 15 * 60 * 1000)) {
    const locale = await getLocale();
    return apiError(
      locale === "en"
        ? "Too many requests sent. Please try again in a few minutes or contact us on WhatsApp."
        : "Trop de demandes envoyées. Réessayez dans quelques minutes ou contactez-nous sur WhatsApp.",
      429,
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Formulaire incomplet.");
  }

  if (parsed.data.website) {
    return Response.json({ ok: true, reference: "DV-0000-0000" });
  }

  const saved = await createTravelRequest({
    type: parsed.data.type,
    fullName: parsed.data.fullName,
    email: parsed.data.email ?? "",
    phone: parsed.data.phone,
    destination: parsed.data.destination ?? "",
    travelDate: parsed.data.travelDate ?? "",
    travelers: parsed.data.travelers ?? null,
    message: parsed.data.message,
    details: parsed.data.details,
  });

  return Response.json({ ok: true, reference: saved.reference });
}
