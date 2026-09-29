import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { fixtureQuery, fmt } from "@/lib/queries";
import { fixtures } from "@/db/schema";
import { saveResult } from "@/features/admin/more-actions";

export default async function Page() {
  await requireAdmin("results:write");
  const rows = await fixtureQuery().orderBy(desc(fixtures.kickoffAt)).limit(50);
  const inp = "w-16 rounded border border-black/15 px-2 py-1";
  return (<div className="space-y-4"><h1 className="display text-4xl">Results</h1><p className="text-sm text-black/60">Saving a score marks the fixture completed. Then recalculate the table on the Standings page.</p>
    {rows.length === 0 ? <p className="rounded-xl bg-white p-10 text-center text-black/60">Create fixtures first.</p> : rows.map((f) => (
      <form key={f.id} action={saveResult.bind(null, f.id)} className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div className="min-w-56 flex-1"><p className="font-semibold">{f.home} v {f.away}</p><p className="text-xs text-black/50">{f.comp} · {fmt(f.at)} · {f.status}</p></div>
        <input name="home" type="number" min={0} defaultValue={f.hs ?? ""} required className={inp} aria-label="Home score" /><span>-</span>
        <input name="away" type="number" min={0} defaultValue={f.as ?? ""} required className={inp} aria-label="Away score" />
        <input name="summary" placeholder="Match summary (optional)" className="min-w-48 flex-1 rounded border border-black/15 px-2 py-1" />
        <button className="rounded bg-turf px-4 py-1.5 text-sm font-semibold text-white">Save</button></form>))}</div>);
}
