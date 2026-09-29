import * as q from "@/lib/queries";
import { PageHeader, Card, Grid, Empty } from "@/components/public/ui";
export const metadata = { title: "Competitions" };
export default async function Page() { const list = await q.compList();
  return (<><PageHeader title="Competitions" /><Grid>{list.length ? list.map(({ c, sport }) => <Card key={c.id} href={`/competitions/${c.slug}`} img={c.coverImage} title={c.name} meta={`${sport} · ${c.season} · ${c.status}`} />) : <div className="md:col-span-3"><Empty>No competitions yet.</Empty></div>}</Grid></>); }
