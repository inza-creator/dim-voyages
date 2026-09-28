import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "@/lib/auth";

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
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
