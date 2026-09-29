import { notFound } from "next/navigation";
import * as q from "@/lib/queries";
import * as s from "@/db/schema";
import { meta, SlugP } from "@/lib/seo";
import { PageHeader, Photo, Wrap, FixtureCard, Card } from "@/components/public/ui";
export async function generateMetadata({ params }: SlugP) { const r = await q.teamBySlug((await params).slug); return r ? meta(r.team.name, r.team.description, r.team.coverImage) : {}; }
export default async function Page({ params }: SlugP) {
  const r = await q.teamBySlug((await params).slug); if (!r) notFound(); const t = r.team;
  const [players, coaches, fx, news, albums] = await Promise.all([q.playersOf(t.id), q.coachesOf(t.id), q.teamFixtures(t.id), q.newsFor(s.news.teamId, t.id), q.albumsFor(s.galleryAlbums.teamId, t.id)]);
  const now = Date.now(), up = fx.filter((f) => f.status === "scheduled" && +f.at >= now).reverse().slice(0, 4), res = fx.filter((f) => f.status === "completed" && f.hs != null).slice(0, 4);
  return (<><PageHeader title={t.name} sub={`${r.sport}${t.gender ? ` · ${t.gender}` : ""}`} /><Wrap>
    {t.description && <p className="whitespace-pre-line text-lg">{t.description}</p>}
    {coaches.length > 0 && <section><h2 className="display mb-4 text-3xl">Coaches</h2><ul className="grid gap-2 md:grid-cols-3">{coaches.map((c) => <li key={c.id} className="rounded-xl bg-white p-4"><b>{c.fullName}</b><br /><span className="text-sm text-turf">{c.role}</span></li>)}</ul></section>}
    <section><h2 className="display mb-4 text-3xl">Squad</h2>{players.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{players.map((p) => (
      <div key={p.id}><Photo img={p.profileImage} alt={p.fullName} sizes="25vw" pos="object-top" className="aspect-[4/5] rounded-2xl" /><p className="mt-2 font-bold">{p.jerseyNumber != null && `#${p.jerseyNumber} `}{p.fullName}</p><p className="text-sm text-turf">{p.position}</p></div>))}</div> : <p className="text-black/50">Squad to be announced.</p>}</section>
    {up.length > 0 && <section><h2 className="display mb-4 text-3xl">Fixtures</h2><div className="grid gap-4 md:grid-cols-2">{up.map((f) => <FixtureCard key={f.id} f={f} />)}</div></section>}
    {res.length > 0 && <section><h2 className="display mb-4 text-3xl">Results</h2><div className="grid gap-4 md:grid-cols-2">{res.map((f) => <FixtureCard key={f.id} f={f} result />)}</div></section>}
    {news.length > 0 && <section><h2 className="display mb-4 text-3xl">News</h2><div className="grid gap-6 md:grid-cols-3">{news.map((n) => <Card key={n.id} href={`/news/${n.slug}`} img={n.coverImage} title={n.title} />)}</div></section>}
    {albums.length > 0 && <section><h2 className="display mb-4 text-3xl">Gallery</h2><div className="grid gap-6 md:grid-cols-3">{albums.map((a) => <Card key={a.id} href={`/gallery/${a.slug}`} img={a.coverImage} title={a.title} />)}</div></section>}</Wrap></>);
}
