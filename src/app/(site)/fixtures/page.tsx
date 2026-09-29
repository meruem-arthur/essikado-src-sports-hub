import * as q from "@/lib/queries";
import { PageHeader, FixtureCard, Empty } from "@/components/public/ui";
export const metadata = { title: "Fixtures" };
export default async function Page() { const rows = await q.upcomingFixtures();
  return (<><PageHeader title="Fixtures" sub="Upcoming matches across all sports." /><div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-2">
    {rows.length ? rows.map((f) => <FixtureCard key={f.id} f={f} />) : <div className="md:col-span-2"><Empty>No upcoming fixtures.</Empty></div>}</div></>); }
