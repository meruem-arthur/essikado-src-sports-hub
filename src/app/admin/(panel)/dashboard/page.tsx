import { count, eq, gte, and, or, isNull } from "drizzle-orm";
import { db } from "@/db";
import * as s from "@/db/schema";

export default async function Dashboard() {
  const c = async (t: any, w?: any) => (await db.select({ n: count() }).from(t).where(w))[0].n, now = new Date();
  const stats: [string, number][] = [["Sports", await c(s.sports)], ["Teams", await c(s.teams)],
    ["Upcoming fixtures", await c(s.fixtures, and(eq(s.fixtures.status, "scheduled"), gte(s.fixtures.kickoffAt, now)))], ["Completed results", await c(s.results)],
    ["Published news", await c(s.news, eq(s.news.status, "published"))],
    ["Active announcements", await c(s.announcements, and(eq(s.announcements.status, "published"), or(isNull(s.announcements.expiresAt), gte(s.announcements.expiresAt, now))))],
    ["Gallery albums", await c(s.galleryAlbums)], ["Active committee", await c(s.committeeMembers, eq(s.committeeMembers.isActive, true))], ["Active sponsors", await c(s.sponsors, eq(s.sponsors.isActive, true))]];
  return (<div className="grid grid-cols-2 gap-4 md:grid-cols-3">{stats.map(([l, n]) => (<div key={l} className="rounded-xl bg-white p-5 shadow-sm"><p className="display text-5xl text-turf">{n}</p><p className="text-sm text-black/60">{l}</p></div>))}</div>);
}
