import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { RESOURCES } from "@/features/admin/resources";
import { logout } from "../login/actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = await requireAdmin();
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-pitch p-4 text-chalk md:min-h-screen md:w-60">
        <p className="display mb-4 text-2xl">SRC Sports</p>
        <nav className="flex gap-2 overflow-x-auto whitespace-nowrap pb-2 text-sm md:flex-col md:gap-1 md:overflow-visible md:pb-0">
          <Link href="/admin/dashboard" className="rounded px-2 py-1 hover:bg-white/10">Dashboard</Link>
          {Object.values(RESOURCES).filter((r) => can(s.permissions, r.perm)).map((r) => (
            <Link key={r.key} href={`/admin/${r.key}`} className="rounded px-2 py-1 hover:bg-white/10">{r.label}</Link>))}
        {[["Results", "/admin/results", "results:write"], ["Standings", "/admin/standings", "standings:write"], ["Settings", "/admin/settings", "settings:write"]]
            .filter(([, , p]) => can(s.permissions, p)).map(([l, h]) => <Link key={h} href={h} className="rounded px-2 py-1 hover:bg-white/10">{l}</Link>)}
        </nav>
        <form action={logout} className="mt-6"><p className="mb-2 text-xs opacity-60">{s.name} · {s.role}</p>
          <button className="rounded bg-floodlight px-3 py-1 text-sm font-semibold text-ink">Log out</button></form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
