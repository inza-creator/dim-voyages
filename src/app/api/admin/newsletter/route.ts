import { requireSession } from "@/server/guards";
import { listSubscribers } from "@/server/requests";

export async function GET() {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const items = await listSubscribers();
  return Response.json({ items });
}
