import Link from "next/link";
import * as q from "@/lib/queries";
import { PageHeader, Wrap, Empty } from "@/components/public/ui";
export const metadata = { title: "Announcements" };
export default async function Page() { const list = await q.announcementsList(); const now = Date.now();
  return (<><PageHeader title="Announcements" /><Wrap>{list.length ? <ul className="space-y-3">{list.map((a) => { const gone = a.expiresAt && +a.expiresAt < now;
    return (<li key={a.id}><Link href={`/announcements/${a.slug}`} className={`block rounded-xl bg-white p-5 shadow-sm ${gone ? "opacity-50" : ""}`}>
      <p className="text-xs uppercase tracking-widest text-turf">{a.priority}{gone && " · expired"} · {q.fmtDay(a.publishedAt)}</p><h2 className="text-lg font-bold">{a.title}</h2></Link></li>); })}</ul> : <Empty>No announcements.</Empty>}</Wrap></>); }
