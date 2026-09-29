import Link from "next/link";
import Image from "next/image";
import SiteHeader from "@/components/public/SiteHeader";
import { getSettings, activeSponsors } from "@/lib/queries";
import { Photo } from "@/components/public/ui";

export const revalidate = 60;
const NAV = [["Sports", "/sports"], ["Teams", "/teams"], ["Competitions", "/competitions"], ["Fixtures", "/fixtures"], ["Results", "/results"], ["News", "/news"], ["Events", "/events"], ["Gallery", "/gallery"], ["Committee", "/committee"], ["Contact", "/contact"]];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [st, sponsors] = await Promise.all([getSettings(), activeSponsors()]);
  return (<>
    <SiteHeader name={st.siteName} logo={st.logo?.url ?? "/src-logo.png"} nav={NAV} />
    <main>{children}</main>
    <footer className="bg-pitch py-12 text-chalk"><div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
      <div><div className="mb-3 flex items-center gap-3"><Image src="/umat-logo.jpg" alt="UMaT" width={48} height={58} className="h-12 w-auto rounded bg-white p-1" /><Image src={st.logo?.url ?? "/src-logo.png"} alt="SRC" width={56} height={56} className="h-14 w-14 rounded-full bg-white" /></div><p className="display text-3xl">{st.siteName}</p><p className="mt-2 text-sm opacity-70">{st.footer ?? "UMaT Essikado Campus · SRC Sports Department"}</p></div>
      <div className="grid grid-cols-2 gap-1 text-sm">{NAV.map(([l, h]) => <Link key={h} href={h} className="opacity-70 hover:opacity-100">{l}</Link>)}</div>
      <div className="text-sm">{st.email && <a href={`mailto:${st.email}`} className="block underline">{st.email}</a>}
        <div className="mt-3 flex flex-wrap gap-3">{Object.entries(st.socials).filter(([, u]) => u).map(([k, u]) => <a key={k} href={u} rel="noopener noreferrer" target="_blank" className="capitalize opacity-80 hover:opacity-100">{k}</a>)}</div></div>
      {sponsors.length > 0 && <div className="md:col-span-3 border-t border-white/10 pt-6"><p className="mb-3 text-xs tracking-[.3em] opacity-60">PARTNERS</p>
        <div className="flex flex-wrap items-center gap-6">{sponsors.map((p) => <a key={p.id} href={p.websiteUrl ?? "#"} target="_blank" rel="noopener noreferrer" title={p.name}>
          {p.logo ? <Photo img={p.logo} alt={p.name} sizes="120px" className="h-10 w-24 !bg-none" /> : <span className="text-sm">{p.name}</span>}</a>)}</div></div>}
      <p className="md:col-span-3 text-xs opacity-50">© {new Date().getFullYear()} {st.siteName}. All rights reserved.</p></div></footer></>);
}
