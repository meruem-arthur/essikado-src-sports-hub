import * as q from "@/lib/queries";
import { PageHeader, Wrap } from "@/components/public/ui";
export const metadata = { title: "Contact" };
export default async function Page() { const st = await q.getSettings();
  return (<><PageHeader title="Contact" sub="Reach the SRC Sports Department." /><Wrap>
    {st.email ? <p className="text-xl">Email us at <a className="font-bold text-turf underline" href={`mailto:${st.email}`}>{st.email}</a></p> : <p className="text-black/50">Contact email will appear here once set in the admin dashboard.</p>}
    <div className="flex flex-wrap gap-4">{Object.entries(st.socials).filter(([, u]) => u).map(([k, u]) => <a key={k} href={u} target="_blank" rel="noopener noreferrer" className="rounded-full border border-turf px-5 py-2 capitalize text-turf">{k}</a>)}</div></Wrap></>); }
