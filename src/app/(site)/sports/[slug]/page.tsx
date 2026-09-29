import { notFound } from "next/navigation";
import * as q from "@/lib/queries";
import { meta, SlugP } from "@/lib/seo";
import { PageHeader, Wrap, Card } from "@/components/public/ui";
export async function generateMetadata({ params }: SlugP) { const x = await q.sportBySlug((await params).slug); return x ? meta(x.name, x.description, x.coverImage) : {}; }
export default async function Page({ params }: SlugP) {
  const sp = await q.sportBySlug((await params).slug); if (!sp) notFound(); const teams = await q.teamsOfSport(sp.id);
  return (<><PageHeader title={sp.name} sub={sp.description ?? undefined} /><Wrap><h2 className="display text-3xl">Teams</h2>
    {teams.length ? <div className="grid gap-6 md:grid-cols-3">{teams.map((t) => <Card key={t.id} href={`/teams/${t.slug}`} img={t.coverImage ?? t.logo} title={t.name} meta={t.gender ?? undefined} />)}</div> : <p className="text-black/50">No teams yet.</p>}</Wrap></>);
}
