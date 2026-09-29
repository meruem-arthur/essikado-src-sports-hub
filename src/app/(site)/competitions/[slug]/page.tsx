import { notFound } from "next/navigation";
import Link from "next/link";
import * as q from "@/lib/queries";
import * as s from "@/db/schema";
import { meta, SlugP } from "@/lib/seo";
import { PageHeader, Wrap, FixtureCard, Card } from "@/components/public/ui";
export async function generateMetadata({ params }: SlugP) { const r = await q.compBySlug((await params).slug); return r ? meta(r.c.name, r.c.description, r.c.coverImage) : {}; }
export default async function Page({ params }: SlugP) {
  const r = await q.compBySlug((await params).slug); if (!r) notFound(); const c = r.c;
  const [table, fx, news, albums] = await Promise.all([q.standingsFor(c.id), q.compFixtures(c.id), q.newsFor(s.news.competitionId, c.id), q.albumsFor(s.galleryAlbums.competitionId, c.id)]);
  const up = fx.filter((f) => f.status === "scheduled"), res = fx.filter((f) => f.status === "completed" && f.hs != null).reverse();
  return (<><PageHeader title={c.name} sub={`${r.sport} · ${c.season}`} /><Wrap>
    {c.description && <p className="whitespace-pre-line text-lg">{c.description}</p>}
    <section><h2 className="display mb-4 text-3xl">Standings</h2>{table.length ? <div className="overflow-x-auto rounded-xl bg-white shadow-sm"><table className="w-full text-left text-sm">
      <thead className="bg-pitch text-chalk"><tr>{["#", "Team", "P", "W", "D", "L", "F", "A", "GD", "Pts"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
      <tbody>{table.map(({ st, team, slug }, i) => (<tr key={st.id} className="border-t border-black/5"><td className="p-3">{i + 1}</td><td className="p-3 font-semibold"><Link href={`/teams/${slug}`}>{team}</Link></td>
        <td className="p-3">{st.played}</td><td className="p-3">{st.won}</td><td className="p-3">{st.drawn}</td><td className="p-3">{st.lost}</td><td className="p-3">{st.scoreFor}</td><td className="p-3">{st.scoreAgainst}</td>
        <td className="p-3">{st.scoreFor - st.scoreAgainst}</td><td className="p-3 font-bold">{st.points}</td></tr>))}</tbody></table></div> : <p className="text-black/50">Standings not published yet.</p>}</section>
    {up.length > 0 && <section><h2 className="display mb-4 text-3xl">Fixtures</h2><div className="grid gap-4 md:grid-cols-2">{up.map((f) => <FixtureCard key={f.id} f={f} />)}</div></section>}
    {res.length > 0 && <section><h2 className="display mb-4 text-3xl">Results</h2><div className="grid gap-4 md:grid-cols-2">{res.map((f) => <FixtureCard key={f.id} f={f} result />)}</div></section>}
    {news.length > 0 && <section><h2 className="display mb-4 text-3xl">News</h2><div className="grid gap-6 md:grid-cols-3">{news.map((n) => <Card key={n.id} href={`/news/${n.slug}`} img={n.coverImage} title={n.title} />)}</div></section>}
    {albums.length > 0 && <section><h2 className="display mb-4 text-3xl">Gallery</h2><div className="grid gap-6 md:grid-cols-3">{albums.map((a) => <Card key={a.id} href={`/gallery/${a.slug}`} img={a.coverImage} title={a.title} />)}</div></section>}</Wrap></>);
}
