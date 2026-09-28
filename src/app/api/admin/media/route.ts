import { apiError, requireSession } from "@/server/guards";
import { listMedia, saveUpload } from "@/server/media";

export async function GET() {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const items = await listMedia();
  return Response.json({ items });
}

export async function POST(request: Request) {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return apiError("Choisissez une image.");
  const alt = String(form?.get("alt") ?? "");
  const saved = await saveUpload(file, alt);
  if ("error" in saved && typeof saved.error === "string") return apiError(saved.error);
  return Response.json(saved);
}
