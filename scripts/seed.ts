import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import { roles, users } from "../src/db/schema";
import { DEFAULT_ROLES } from "../src/lib/permissions";

const db = drizzle(neon(process.env.DATABASE_URL!));
async function main() {
  const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: pw } = process.env;
  if (!email || !pw || pw.length < 12) throw new Error("Set SEED_ADMIN_EMAIL and a 12+ char SEED_ADMIN_PASSWORD");
  for (const [key, r] of Object.entries(DEFAULT_ROLES))
    await db.insert(roles).values({ key, name: r.name, permissions: [...r.permissions] })
      .onConflictDoUpdate({ target: roles.key, set: { permissions: [...r.permissions], name: r.name } });
  const [sa] = await db.select().from(roles).where((await import("drizzle-orm")).eq(roles.key, "super_admin"));
  await db.insert(users).values({ email: email.toLowerCase(), name: "Super Admin", passwordHash: await bcrypt.hash(pw, 12), roleId: sa.id })
    .onConflictDoNothing();
  console.log("Seeded roles and Super Admin:", email);
}
main();
