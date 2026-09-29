"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function SiteHeader({ name, logo, nav }: { name: string; logo: string; nav: string[][] }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { const f = () => setSolid(window.scrollY > 40); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 text-chalk transition-colors duration-300 ${solid || open ? "bg-pitch/95 shadow-lg backdrop-blur" : "bg-gradient-to-b from-black/60 to-transparent"}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <Image src="/umat-logo.jpg" alt="UMaT" width={36} height={44} className="h-9 w-auto shrink-0 rounded bg-white p-0.5" />
          <Image src={logo} alt="SRC" width={40} height={40} className="hidden h-10 w-10 shrink-0 rounded-full bg-white sm:block" />
          <Image src="/src-sports-logo.png" alt="SRC Sports" width={44} height={44} className="h-11 w-auto shrink-0" />
          <span className="display hidden truncate text-lg min-[430px]:inline md:text-2xl">{name}</span></Link>
        <nav className="hidden gap-5 text-sm font-medium xl:flex">{nav.map(([l, h]) => <Link key={h} href={h} className="opacity-90 hover:text-floodlight hover:opacity-100">{l}</Link>)}</nav>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu" className="rounded border border-white/40 px-4 py-2 text-sm xl:hidden">{open ? "Close" : "Menu"}</button>
      </div>
      {open && <nav className="grid gap-1 border-t border-white/10 px-4 pb-4 pt-2 sm:grid-cols-2 xl:hidden">{nav.map(([l, h]) => <Link key={h} href={h} className="rounded px-3 py-3 hover:bg-white/10">{l}</Link>)}</nav>}
    </header>);
}
