import { desc } from "drizzle-orm";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { competitions } from "@/db/schema";
import { recalcStandings } from "@/features/admin/more-actions";

export default async function Page() {
  await requireAdmin("standings:write");
  const list = await db.select().from(competitions).orderBy(desc(competitions.createdAt));
  return (<div className="space-y-4"><h1 className="display text-4xl">Standings</h1>
    <p className="text-sm text-black/60">Rebuilds the table from completed results and the teams added under Competition Teams. Scoring is 3/1/0 unless the sport's config sets pointsWin / pointsDraw / pointsLoss. This replaces the current table.</p>
    {list.length === 0 ? <p className="rounded-xl bg-white p-10 text-center text-black/60">No competitions yet.</p> : list.map((c) => (
      <form key={c.id} action={recalcStandings.bind(null, c.id)} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <span className="font-semibold">{c.name} <span className="text-sm font-normal text-black/50">{c.season}</span></span>
        <button className="rounded bg-turf px-4 py-1.5 text-sm font-semibold text-white">Recalculate</button></form>))}</div>);
}
