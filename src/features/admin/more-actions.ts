"use server";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";
import { results, fixtures, standings, competitions, competitionTeams, sports, galleryImages, siteSettings } from "@/db/schema";

const uuid = z.string().uuid();
const done = () => revalidatePath("/", "layout");
const CLD = () => `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`;

export async function saveResult(fixtureId: string, fd: FormData) {
  await requireAdmin("results:write"); uuid.parse(fixtureId);
  const n = z.coerce.number().int().min(0).max(999);
  const p = z.object({ home: n, away: n, summary: z.string().max(5000).optional() }).parse({ home: fd.get("home"), away: fd.get("away"), summary: fd.get("summary") || undefined });
  await db.insert(results).values({ fixtureId, homeScore: p.home, awayScore: p.away, summary: p.summary })
    .onConflictDoUpdate({ target: results.fixtureId, set: { homeScore: p.home, awayScore: p.away, summary: p.summary ?? null } });
  await db.update(fixtures).set({ status: "completed" }).where(eq(fixtures.id, fixtureId));
  done();
}

/** Rebuilds a competition's table from completed results. Points come from sports.config {pointsWin,pointsDraw,pointsLoss}, default 3/1/0. NOT atomic (neon-http). Overwrites the table. */
export async function recalcStandings(compId: string) {
  await requireAdmin("standings:write"); uuid.parse(compId);
  const [c] = await db.select({ cfg: sports.config }).from(competitions).innerJoin(sports, eq(competitions.sportId, sports.id)).where(eq(competitions.id, compId));
  const cfg = (c?.cfg ?? {}) as Record<string, number>; const W = cfg.pointsWin ?? 3, D = cfg.pointsDraw ?? 1, L = cfg.pointsLoss ?? 0;
  const ids = (await db.select({ t: competitionTeams.teamId }).from(competitionTeams).where(eq(competitionTeams.competitionId, compId))).map((x) => x.t);
  const rows = await db.select({ h: fixtures.homeTeamId, a: fixtures.awayTeamId, hs: results.homeScore, as: results.awayScore }).from(fixtures)
    .innerJoin(results, eq(results.fixtureId, fixtures.id)).where(and(eq(fixtures.competitionId, compId), eq(fixtures.status, "completed")));
  const m = new Map<string, any>();
  const g = (id: string) => { if (!m.has(id)) m.set(id, { competitionId: compId, teamId: id, played: 0, won: 0, drawn: 0, lost: 0, scoreFor: 0, scoreAgainst: 0, points: 0 }); return m.get(id); };
  ids.forEach(g);
  for (const r of rows) for (const [t, f, a] of [[r.h, r.hs, r.as], [r.a, r.as, r.hs]] as [string, number, number][]) {
    const x = g(t); x.played++; x.scoreFor += f; x.scoreAgainst += a;
    if (f > a) { x.won++; x.points += W; } else if (f === a) { x.drawn++; x.points += D; } else { x.lost++; x.points += L; }
  }
  await db.delete(standings).where(eq(standings.competitionId, compId));
  if (m.size) await db.insert(standings).values([...m.values()]);
  done();
}

export async function addImages(albumId: string, imgs: { publicId: string; url: string; width?: number; height?: number }[]) {
  await requireAdmin("gallery:write"); uuid.parse(albumId);
  const clean = z.array(z.object({ publicId: z.string(), url: z.string().startsWith(CLD()), width: z.number().optional(), height: z.number().optional() })).max(100).parse(imgs);
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(galleryImages).where(eq(galleryImages.albumId, albumId));
  if (clean.length) await db.insert(galleryImages).values(clean.map((i, k) => ({ albumId, ...i, displayOrder: n + k })));
  done();
}
export async function deleteImage(id: string) { await requireAdmin("gallery:write"); await db.delete(galleryImages).where(eq(galleryImages.id, uuid.parse(id))); done(); }

export async function saveSettings(fd: FormData) {
  await requireAdmin("settings:write");
  const url = z.string().url().or(z.literal(""));
  const p = z.object({ site_name: z.string().min(1).max(80), contact_email: z.string().email().or(z.literal("")), footer_text: z.string().max(300),
    facebook: url, instagram: url, x: url, youtube: url, tiktok: url }).parse(Object.fromEntries(fd));
  let logo: unknown = null; const raw = fd.get("logo") as string;
  if (raw) { const o = JSON.parse(raw); if (!String(o.url).startsWith(CLD())) throw new Error("Bad logo"); logo = { publicId: String(o.publicId), url: String(o.url) }; }
  const { facebook, instagram, x, youtube, tiktok, ...rest } = p;
  const entries: Record<string, unknown> = { ...rest, socials: { facebook, instagram, x, youtube, tiktok }, logo };
  for (const [key, value] of Object.entries(entries))
    await db.insert(siteSettings).values({ key, value: value as any }).onConflictDoUpdate({ target: siteSettings.key, set: { value: value as any } });
  done();
}
