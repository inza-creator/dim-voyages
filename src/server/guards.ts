import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "@/lib/auth";

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

const hits = new Map<string, number[]>();

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [entry, times] of hits) {
      if (times.every((time) => now - time > windowMs)) hits.delete(entry);
    }
  }
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function requireSession(): Promise<
  { user: SessionUser; response?: undefined } | { user?: undefined; response: NextResponse }
> {
  const user = await getSession();
  if (!user) return { response: apiError("Non autorisé", 401) };
  return { user };
}

export async function requireAdmin(): Promise<
  { user: SessionUser; response?: undefined } | { user?: undefined; response: NextResponse }
> {
  const result = await requireSession();
  if (result.response || !result.user) return result;
  if (result.user.role !== "ADMIN") {
    return { response: apiError("Accès réservé à l'administrateur", 403) };
  }
  return result;
}
