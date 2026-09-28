import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionCookieOptions, signToken, SESSION_COOKIE } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import { apiError } from "@/server/guards";

const attempts = new Map<string, { count: number; at: number }>();

function tooMany(ip: string) {
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || now - current.at > 15 * 60 * 1000) {
    attempts.set(ip, { count: 1, at: now });
    return false;
  }
  current.count += 1;
  return current.count > 8;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (tooMany(ip)) {
    return apiError("Trop de tentatives. Réessayez dans quelques minutes.", 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Email ou mot de passe invalide.");
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: parsed.data.email, mode: "insensitive" } },
  });
  if (!user || !user.active) {
    return apiError("Email ou mot de passe incorrect.", 401);
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) return apiError("Email ou mot de passe incorrect.", 401);

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const response = NextResponse.json({
    user: { name: user.name, email: user.email, role: user.role },
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
