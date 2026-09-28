import { requireSession } from "@/server/guards";
import { listRequests } from "@/server/requests";

export async function GET() {
  const auth = await requireSession();
  if (auth.response) return auth.response;
  const items = await listRequests();
  return Response.json({ items });
}
