import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, roles } from "@/db/schema";
import { can } from "./permissions";

const COOKIE = "src_session";
const key = () => new TextEncoder().encode(process.env.AUTH_SECRET!);
export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const verifyPassword = (p: string, h: string) => bcrypt.compare(p, h);

export async function createSession(userId: string) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" })
    .setSubject(userId).setIssuedAt().setExpirationTime("7d").sign(key());
  (await cookies()).set(COOKIE, token, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
}
export async function destroySession() { (await cookies()).delete(COOKIE); }

/** Re-reads user + role from DB on every request, so role changes/deactivation apply immediately. */
export const getSession = cache(async () => {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    const [row] = await db.select({ userId: users.id, name: users.name, email: users.email,
      active: users.isActive, role: roles.key, permissions: roles.permissions })
      .from(users).innerJoin(roles, eq(users.roleId, roles.id)).where(eq(users.id, payload.sub!));
    return row?.active ? row : null;
  } catch { return null; }
});

export async function requireAdmin(permission?: string) {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  if (permission && !can(s.permissions, permission)) throw new Error("FORBIDDEN");
  return s;
}
