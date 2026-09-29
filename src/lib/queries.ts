import "server-only";
import { and, asc, desc, eq, gte, isNull, lte, or, isNotNull, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/db";
import * as s from "@/db/schema";

export const fmt = (d: Date | string | null) => d ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Accra" }).format(new Date(d)) : "";
export const fmtDay = (d: Date | string | null) => d ? new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "Africa/Accra" }).format(new Date(d)) : "";

export async function getSettings() {
  const rows = await db.select().from(s.siteSettings);
  const m = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, any>;
  return { siteName: m.site_name ?? "UMaT SRC Sports", email: m.contact_email as string | undefined, footer: m.footer_text as string | undefined,
    socials: (m.socials ?? {}) as Record<string, string>, logo: m.logo as s.Img | undefined };
}
const home = alias(s.teams, "home"), away = alias(s.teams, "away");
export function fixtureQuery() {
  return db.select({ id: s.fixtures.id, at: s.fixtures.kickoffAt, venue: s.fixtures.venue, notes: s.fixtures.notes, round: s.fixtures.round, status: s.fixtures.status, sport: s.sports.name,
    comp: s.competitions.name, home: home.name, away: away.name, hs: s.results.homeScore, as: s.results.awayScore })
    .from(s.fixtures).innerJoin(s.competitions, eq(s.fixtures.competitionId, s.competitions.id)).innerJoin(s.sports, eq(s.competitions.sportId, s.sports.id))
    .innerJoin(home, eq(s.fixtures.homeTeamId, home.id)).innerJoin(away, eq(s.fixtures.awayTeamId, away.id)).leftJoin(s.results, eq(s.results.fixtureId, s.fixtures.id));
}
export const upcomingFixtures = (limit = 50) => fixtureQuery().where(and(eq(s.fixtures.status, "scheduled"), gte(s.fixtures.kickoffAt, new Date()))).orderBy(asc(s.fixtures.kickoffAt)).limit(limit);
export const latestResults = (limit = 50) => fixtureQuery().where(and(eq(s.fixtures.status, "completed"), isNotNull(s.results.id))).orderBy(desc(s.fixtures.kickoffAt)).limit(limit);
export const heroSlides = () => db.select().from(s.heroSlides).where(eq(s.heroSlides.isActive, true)).orderBy(asc(s.heroSlides.displayOrder));
export const activeSports = () => db.select().from(s.sports).where(eq(s.sports.isActive, true)).orderBy(asc(s.sports.displayOrder));
export const publishedNews = (limit = 50) => db.select().from(s.news).where(and(eq(s.news.status, "published"), lte(s.news.publishedAt, new Date()))).orderBy(desc(s.news.publishedAt)).limit(limit);
export const newsBySlug = async (slug: string) => (await db.select().from(s.news).where(and(eq(s.news.slug, slug), eq(s.news.status, "published"))))[0];
export const nextEvent = async () => (await db.select().from(s.events).where(and(eq(s.events.status, "published"), gte(s.events.startsAt, new Date()))).orderBy(asc(s.events.startsAt)).limit(1))[0];
export const latestAnnouncement = async () => (await db.select().from(s.announcements).where(and(eq(s.announcements.status, "published"),
  or(isNull(s.announcements.expiresAt), gte(s.announcements.expiresAt, new Date())))).orderBy(desc(s.announcements.priority), desc(s.announcements.publishedAt)).limit(1))[0];
export const featuredAlbums = (limit = 4) => db.select().from(s.galleryAlbums).where(eq(s.galleryAlbums.status, "published")).orderBy(desc(s.galleryAlbums.isFeatured), desc(s.galleryAlbums.createdAt)).limit(limit);
export const committee = (limit?: number) => { const q = db.select().from(s.committeeMembers).where(eq(s.committeeMembers.isActive, true)).orderBy(asc(s.committeeMembers.displayOrder)); return limit ? q.limit(limit) : q; };
export const activeSponsors = () => db.select().from(s.sponsors).where(eq(s.sponsors.isActive, true)).orderBy(asc(s.sponsors.displayOrder));

// ---- Remaining public queries ----
const uuidOk = (x: string) => /^[0-9a-f-]{36}$/i.test(x);
const one = async <T,>(p: PromiseLike<T[]>) => (await p)[0];
export const sportBySlug = (slug: string) => one(db.select().from(s.sports).where(and(eq(s.sports.slug, slug), eq(s.sports.isActive, true))));
const teamSel = () => db.select({ team: s.teams, sport: s.sports.name }).from(s.teams).innerJoin(s.sports, eq(s.teams.sportId, s.sports.id));
export const teamsList = () => teamSel().where(eq(s.teams.isActive, true)).orderBy(asc(s.sports.name), asc(s.teams.name));
export const teamBySlug = (slug: string) => one(teamSel().where(and(eq(s.teams.slug, slug), eq(s.teams.isActive, true))));
export const teamsOfSport = (sportId: string) => db.select().from(s.teams).where(and(eq(s.teams.sportId, sportId), eq(s.teams.isActive, true))).orderBy(asc(s.teams.name));
export const playersOf = (teamId: string) => db.select().from(s.players).where(and(eq(s.players.teamId, teamId), eq(s.players.isActive, true))).orderBy(asc(s.players.jerseyNumber));
export const coachesOf = (teamId: string) => db.select().from(s.coaches).where(and(eq(s.coaches.teamId, teamId), eq(s.coaches.isActive, true)));
export const teamFixtures = (id: string) => fixtureQuery().where(or(eq(s.fixtures.homeTeamId, id), eq(s.fixtures.awayTeamId, id))).orderBy(desc(s.fixtures.kickoffAt));
export const compFixtures = (id: string) => fixtureQuery().where(eq(s.fixtures.competitionId, id)).orderBy(asc(s.fixtures.kickoffAt));
export const newsFor = (col: any, id: string) => db.select().from(s.news).where(and(eq(col, id), eq(s.news.status, "published"))).orderBy(desc(s.news.publishedAt)).limit(3);
export const albumsFor = (col: any, id: string) => db.select().from(s.galleryAlbums).where(and(eq(col, id), eq(s.galleryAlbums.status, "published"))).limit(4);
const compSel = () => db.select({ c: s.competitions, sport: s.sports.name }).from(s.competitions).innerJoin(s.sports, eq(s.competitions.sportId, s.sports.id));
export const compList = () => compSel().orderBy(desc(s.competitions.startDate));
export const compBySlug = (slug: string) => one(compSel().where(eq(s.competitions.slug, slug)));
export const standingsFor = (id: string) => db.select({ st: s.standings, team: s.teams.name, slug: s.teams.slug }).from(s.standings).innerJoin(s.teams, eq(s.standings.teamId, s.teams.id))
  .where(eq(s.standings.competitionId, id)).orderBy(desc(s.standings.points), desc(sql`${s.standings.scoreFor} - ${s.standings.scoreAgainst}`));
export const eventsList = () => db.select().from(s.events).where(eq(s.events.status, "published")).orderBy(desc(s.events.startsAt));
export const eventBySlug = (slug: string) => one(db.select().from(s.events).where(and(eq(s.events.slug, slug), eq(s.events.status, "published"))));
export const announcementsList = () => db.select().from(s.announcements).where(eq(s.announcements.status, "published")).orderBy(desc(s.announcements.publishedAt));
export const announcementBySlug = (slug: string) => one(db.select().from(s.announcements).where(and(eq(s.announcements.slug, slug), eq(s.announcements.status, "published"))));
export const albumsFiltered = (f: { sport?: string; year?: number; comp?: string }) => db.select({ a: s.galleryAlbums }).from(s.galleryAlbums)
  .leftJoin(s.sports, eq(s.galleryAlbums.sportId, s.sports.id)).leftJoin(s.competitions, eq(s.galleryAlbums.competitionId, s.competitions.id))
  .where(and(eq(s.galleryAlbums.status, "published"), f.sport ? eq(s.sports.slug, f.sport) : undefined, f.year ? eq(s.galleryAlbums.year, f.year) : undefined, f.comp ? eq(s.competitions.slug, f.comp) : undefined))
  .orderBy(desc(s.galleryAlbums.albumDate), desc(s.galleryAlbums.createdAt));
export const albumYears = () => db.selectDistinct({ y: s.galleryAlbums.year }).from(s.galleryAlbums).where(and(eq(s.galleryAlbums.status, "published"), isNotNull(s.galleryAlbums.year))).orderBy(desc(s.galleryAlbums.year));
export const albumBySlug = (slug: string) => one(db.select().from(s.galleryAlbums).where(and(eq(s.galleryAlbums.slug, slug), eq(s.galleryAlbums.status, "published"))));
export const albumImages = (id: string) => db.select().from(s.galleryImages).where(eq(s.galleryImages.albumId, id)).orderBy(asc(s.galleryImages.displayOrder));
export const fixtureById = async (id: string) => uuidOk(id) ? one(fixtureQuery().where(eq(s.fixtures.id, id))) : undefined;
export const resultFor = (id: string) => one(db.select().from(s.results).where(eq(s.results.fixtureId, id)));
