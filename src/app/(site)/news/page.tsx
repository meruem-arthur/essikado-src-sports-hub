import Link from "next/link";
import * as q from "@/lib/queries";
import { PageHeader, Photo, Empty } from "@/components/public/ui";
export const metadata = { title: "News" };
export default async function Page() { const items = await q.publishedNews();
  return (<><PageHeader title="News" /><div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">{items.length ? items.map((n) => (
    <Link key={n.id} href={`/news/${n.slug}`} className="group"><Photo img={n.coverImage} alt={n.title} className="aspect-[16/10] rounded-2xl" /><p className="mt-3 text-xs text-black/50">{q.fmtDay(n.publishedAt)}</p>
      <h2 className="text-lg font-bold group-hover:text-turf">{n.title}</h2></Link>)) : <div className="md:col-span-3"><Empty>No news yet.</Empty></div>}</div></>); }
