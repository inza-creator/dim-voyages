import { newsletterSendSchema } from "@/lib/validators";
import { apiError, requireSession } from "@/server/guards";
import { sendNewsletter } from "@/server/newsletter-mail";

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.response) return auth.response;

  const body = await request.json().catch(() => null);
  const parsed = newsletterSendSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message ?? "Message incomplet.");
  }

  const result = await sendNewsletter(parsed.data.subject, parsed.data.message);
  if ("error" in result) return apiError(result.error);
  return Response.json({ sent: result.sent });
}
