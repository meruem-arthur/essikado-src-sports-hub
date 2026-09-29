import type { MetadataRoute } from "next";
import * as q from "@/lib/queries";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const b = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const [news, sports, teams, comps, events, albums] = await Promise.all([q.publishedNews(500), q.activeSports(), q.teamsList(), q.compList(), q.eventsList(), q.albumsFiltered({})]);
  const u = (p: string, d?: Date) => ({ url: b + p, lastModified: d });
  return [...["", "/sports", "/teams", "/competitions", "/fixtures", "/results", "/news", "/events", "/announcements", "/gallery", "/committee", "/contact"].map((p) => u(p)),
    ...news.map((n) => u(`/news/${n.slug}`, n.updatedAt)), ...sports.map((x) => u(`/sports/${x.slug}`, x.updatedAt)), ...teams.map(({ team }) => u(`/teams/${team.slug}`, team.updatedAt)),
    ...comps.map(({ c }) => u(`/competitions/${c.slug}`, c.updatedAt)), ...events.map((e) => u(`/events/${e.slug}`, e.updatedAt)), ...albums.map(({ a }) => u(`/gallery/${a.slug}`, a.updatedAt))];
}
