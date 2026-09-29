import * as q from "@/lib/queries";
import { PageHeader, Card, Grid, Empty } from "@/components/public/ui";
export const metadata = { title: "Teams" };
export default async function Page() { const list = await q.teamsList();
  return (<><PageHeader title="Teams" /><Grid>{list.length ? list.map(({ team: t, sport }) => <Card key={t.id} href={`/teams/${t.slug}`} img={t.coverImage ?? t.logo} title={t.name} meta={`${sport}${t.gender ? ` · ${t.gender}` : ""}`} />) : <div className="md:col-span-3"><Empty>No teams yet.</Empty></div>}</Grid></>); }
