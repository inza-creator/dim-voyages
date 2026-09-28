import { searchPublic } from "@/server/content";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const results = await searchPublic(query);
  return Response.json({ results });
}
