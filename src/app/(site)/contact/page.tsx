import * as q from "@/lib/queries";
import { PageHeader, Wrap } from "@/components/public/ui";
export const metadata = { title: "Contact" };
export default async function Page() {
  const st = await q.getSettings();
  const cards = [["Address", st.address], ["Office hours", st.hours], ["Phone & email", [st.phone, st.email].filter(Boolean).join("\n") || undefined]] as const;
  return (<><PageHeader title="Contact" sub="Reach the SRC Sports Department." /><Wrap>
    <div className="grid gap-4 md:grid-cols-3">{cards.map(([t, v]) => (<div key={t} className="rounded-xl bg-turf p-8 text-center text-white shadow-lg">
      <h2 className="display text-2xl text-floodlight">{t}</h2><p className="mt-3 whitespace-pre-line">{v ?? "Will appear here once added in the admin dashboard."}</p></div>))}</div>
    {st.email && <p className="text-center text-xl">Email us at <a className="font-bold text-turf underline" href={`mailto:${st.email}`}>{st.email}</a></p>}
    <div className="flex flex-wrap justify-center gap-4">{Object.entries(st.socials).filter(([, u]) => u).map(([k, u]) => <a key={k} href={u} target="_blank" rel="noopener noreferrer" className="rounded-full border border-turf px-5 py-2 capitalize text-turf">{k}</a>)}</div></Wrap></>);
}
