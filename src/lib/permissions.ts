// Add a role = insert a row in `roles`; no code change needed.
export const DEFAULT_ROLES = {
  super_admin: { name: "Super Admin", permissions: ["*"] },
  sports_admin: { name: "Sports Admin", permissions: [
    "sports:write","teams:write","players:write","competitions:write","fixtures:write",
    "results:write","standings:write","news:write","announcements:write","events:write","gallery:write"] },
  editor: { name: "Editor", permissions: ["news:write","announcements:write","events:write","gallery:write"] },
} as const;

export const can = (perms: readonly string[], needed: string) => perms.includes("*") || perms.includes(needed);

/** Call at the top of EVERY server action / route handler. Never rely on middleware alone. */
export async function requirePermission(
  getSession: () => Promise<{ userId: string; permissions: string[] } | null>, needed: string) {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHENTICATED");
  if (!can(s.permissions, needed)) throw new Error("FORBIDDEN");
  return s;
}
