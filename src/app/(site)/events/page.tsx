import * as q from "@/lib/queries";
import { PageHeader, Card, Grid, Empty } from "@/components/public/ui";
export const metadata = { title: "Events" };
export default async function Page() { const list = await q.eventsList();
  return (<><PageHeader title="Events" /><Grid>{list.length ? list.map((e) => <Card key={e.id} href={`/events/${e.slug}`} img={e.coverImage} title={e.title} meta={`${q.fmt(e.startsAt)}${e.venue ? ` · ${e.venue}` : ""}`} />) : <div className="md:col-span-3"><Empty>No events yet.</Empty></div>}</Grid></>); }
