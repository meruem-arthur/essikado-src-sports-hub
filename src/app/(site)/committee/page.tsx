import * as q from "@/lib/queries";
import { PageHeader, Photo, Empty } from "@/components/public/ui";
export const metadata = { title: "Committee" };
export default async function Page() { const list = await q.committee();
  return (<><PageHeader title="Committee" sub="The people running SRC Sports." /><div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">{list.length ? list.map((m) => (
    <div key={m.id}><Photo img={m.profileImage} alt={m.fullName} sizes="25vw" className="aspect-[4/5] rounded-2xl" /><p className="mt-2 font-bold">{m.fullName}</p><p className="text-sm text-turf">{m.position}</p>
      {m.email && <a href={`mailto:${m.email}`} className="text-xs underline">{m.email}</a>}{m.bio && <p className="mt-1 text-sm text-black/60">{m.bio}</p>}</div>)) : <div className="col-span-full"><Empty>Committee coming soon.</Empty></div>}</div></>); }
