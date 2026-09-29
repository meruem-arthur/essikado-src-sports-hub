import * as q from "@/lib/queries";
import { PageHeader, Card, Grid, Empty } from "@/components/public/ui";
export const metadata = { title: "Gallery" };
export default async function Page({ searchParams }: { searchParams: Promise<{ sport?: string; year?: string; comp?: string }> }) {
  const f = await searchParams; const year = Number(f.year) || undefined;
  const [rows, sports, comps, years] = await Promise.all([q.albumsFiltered({ sport: f.sport, year, comp: f.comp }), q.activeSports(), q.compList(), q.albumYears()]);
  const sel = "rounded-lg border border-black/15 bg-white px-3 py-2 text-sm";
  return (<><PageHeader title="Gallery" /><div className="mx-auto max-w-6xl px-4 pt-8"><form className="flex flex-wrap gap-2">
    <select name="sport" defaultValue={f.sport ?? ""} className={sel}><option value="">All sports</option>{sports.map((x) => <option key={x.id} value={x.slug}>{x.name}</option>)}</select>
    <select name="comp" defaultValue={f.comp ?? ""} className={sel}><option value="">All competitions</option>{comps.map(({ c }) => <option key={c.id} value={c.slug}>{c.name}</option>)}</select>
    <select name="year" defaultValue={f.year ?? ""} className={sel}><option value="">All years</option>{years.map((y) => <option key={y.y}>{y.y}</option>)}</select>
    <button className="rounded-lg bg-turf px-4 py-2 text-sm font-semibold text-white">Filter</button></form></div>
    <Grid>{rows.length ? rows.map(({ a }) => <Card key={a.id} href={`/gallery/${a.slug}`} img={a.coverImage} title={a.title} meta={a.year ? String(a.year) : undefined} />) : <div className="md:col-span-3"><Empty>No albums match.</Empty></div>}</Grid></>); }
