import Link from "next/link";
import * as q from "@/lib/queries";
import { PageHeader, Photo, Empty } from "@/components/public/ui";
import { sportHref } from "@/lib/network";
export const metadata = { title: "Sports" };
export default async function Page() { const list = await q.activeSports();
  return (<><PageHeader title="Sports" /><div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">{list.length ? list.map((s) => (
    <Link key={s.id} href={sportHref(s)} className="group"><Photo img={s.coverImage} alt={s.name} className="aspect-[4/3] rounded-2xl" /><h2 className="display mt-3 text-3xl">{s.name}{s.externalUrl && <span className="ml-2 align-middle text-xs font-sans tracking-widest text-turf">OFFICIAL SITE ↗</span>}</h2>
      <p className="text-sm text-black/60 line-clamp-2">{s.description}</p></Link>)) : <div className="md:col-span-3"><Empty>No sports yet.</Empty></div>}</div></>); }
