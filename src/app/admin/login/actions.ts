"use server";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, verifyPassword, destroySession } from "@/lib/auth";

const schema = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(1) });
const DUMMY = "$2b$12$C6UzMDM.H6dfI/f/IKcEeO5H3EoQXtM0uRk0b3qkMUXBGeSk3KZ9G"; // constant-time-ish miss

export async function login(_: { error?: string } | undefined, form: FormData) {
  const p = schema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!p.success) return { error: "Enter a valid email and password." };
  const [u] = await db.select().from(users).where(eq(users.email, p.data.email));
  const ok = await verifyPassword(p.data.password, u?.passwordHash ?? DUMMY);
  if (!u || !u.isActive || !ok) return { error: "Invalid credentials." };
  await createSession(u.id);
  redirect("/admin/dashboard");
}
export async function logout() { await destroySession(); redirect("/admin/login"); }
