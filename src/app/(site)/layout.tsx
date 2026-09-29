import Link from "next/link";
import Image from "next/image";
import { getSettings, activeSponsors } from "@/lib/queries";
import { Photo } from "@/components/public/ui";

export const revalidate = 60;
const NAV = [["Sports", "/sports"], ["Teams", "/teams"], ["Competitions", "/competitions"], ["Fixtures", "/fixtures"], ["Results", "/results"], ["News", "/news"], ["Events", "/events"], ["Gallery", "/gallery"], ["Committee", "/committee"], ["Contact", "/contact"]];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [st, sponsors] = await Promise.all([getSettings(), activeSponsors()]);
  return (<>
    <header className="sticky top-0 z-40 bg-pitch/95 text-chalk backdrop-blur"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-3"><span className="flex items-center gap-2"><Image src="/umat-logo.jpg" alt="UMaT" width={36} height={44} className="h-9 w-auto rounded bg-white p-0.5" />
        <Image src={st.logo?.url ?? "/src-logo.png"} alt="SRC" width={40} height={40} className="h-10 w-10 rounded-full bg-white" /></span><span className="display text-xl md:text-2xl">{st.siteName}</span></Link>
      <nav className="hidden gap-5 text-sm lg:flex">{NAV.map(([l, h]) => <Link key={h} href={h} className="opacity-80 hover:text-floodlight hover:opacity-100">{l}</Link>)}</nav>
      <details className="relative lg:hidden"><summary className="cursor-pointer list-none rounded border border-white/30 px-3 py-1 text-sm">Menu</summary>
        <nav className="absolute right-0 mt-2 grid w-48 gap-1 rounded-xl bg-pitch p-3 shadow-xl">{NAV.map(([l, h]) => <Link key={h} href={h} className="rounded px-2 py-1.5 hover:bg-white/10">{l}</Link>)}</nav></details></div></header>
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
