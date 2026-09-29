import { db } from "@/db";
import { pageHeroes } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import type { Img } from "@/db/schema";

import { Photo, ParallaxPhoto } from "./photo";
export { Photo };
export function Section({ n, title, href, children, dark }: { n: string; title: string; href?: string; children: React.ReactNode; dark?: boolean }) {
  return (<section className={`${dark ? "bg-pitch text-chalk" : ""} py-14 md:py-20`}><div className="mx-auto max-w-6xl px-4">
    <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-xs tracking-[.3em] text-turf">{n}</p><h2 className="display text-4xl md:text-6xl">{title}</h2></div>
      {href && <Link href={href} className="shrink-0 text-sm font-semibold underline-offset-4 hover:underline">See all →</Link>}</div>{children}</div></section>);
}
export async function PageHeader({ title, sub }: { title: string; sub?: string }) {
  let h: any; try { [h] = await db.select().from(pageHeroes).where(eq(pageHeroes.pageKey, title.toLowerCase())).limit(1); } catch {}
  return (<header className={`relative flex items-end overflow-hidden bg-pitch pb-14 pt-32 text-chalk ${h?.image ? "min-h-[75svh]" : "min-h-[300px]"}`}>
    {h?.image && <><ParallaxPhoto img={h.image} priority /><div className="absolute inset-0 bg-gradient-to-t from-pitch/85 via-pitch/25 to-black/30" /></>}
    <div className="relative mx-auto w-full max-w-6xl px-4"><h1 className="display break-words text-5xl sm:text-6xl md:text-8xl">{h?.title ?? title}</h1>{(h?.subtitle ?? sub) && <p className="mt-3 max-w-xl text-lg opacity-90">{h?.subtitle ?? sub}</p>}</div></header>);
}
export const Empty = ({ children }: { children: React.ReactNode }) => <p className="rounded-xl border border-dashed border-black/20 p-8 text-center text-black/50">{children}</p>;

export type FRow = { id: string; at: Date; venue: string | null; sport: string; comp: string; home: string; away: string; hs: number | null; as: number | null };
export function FixtureCard({ f, result }: { f: FRow; result?: boolean }) {
  return (<Link href={`/${result ? "results" : "fixtures"}/${f.id}`} className="group block rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
    <p className="text-xs uppercase tracking-widest text-turf">{f.sport} · {f.comp}</p>
    <div className="my-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-semibold [&>span:first-child]:break-words [&>span:last-child]:break-words"><span>{f.home}</span>
      <span className="display rounded bg-pitch px-3 py-1 text-xl text-floodlight">{result ? `${f.hs} - ${f.as}` : "VS"}</span><span className="text-right">{f.away}</span></div>
    <p className="text-sm text-black/60">{new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Accra" }).format(f.at)}{f.venue && ` · ${f.venue}`}</p></Link>);
}

export function Card({ href, img, title, meta, text }: { href: string; img?: Img | null; title: string; meta?: string; text?: string | null }) {
  return (<Link href={href} className="group block"><Photo img={img} alt={title} className="aspect-[16/10] rounded-2xl" />{meta && <p className="mt-3 text-xs text-black/50">{meta}</p>}
    <h2 className="text-lg font-bold group-hover:text-turf">{title}</h2>{text && <p className="text-sm text-black/60 line-clamp-2">{text}</p>}</Link>);
}
export const Grid = ({ children }: { children: React.ReactNode }) => <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-3">{children}</div>;
export const Wrap = ({ children }: { children: React.ReactNode }) => <div className="mx-auto max-w-6xl space-y-12 px-4 py-12">{children}</div>;
export function MatchView({ f, summary, result }: { f: FRow & { notes: string | null; status: string; round: string | null }; summary?: string | null; result?: boolean }) {
  return (<><PageHeader title={`${f.home} v ${f.away}`} sub={`${f.sport} · ${f.comp}${f.round ? ` · ${f.round}` : ""}`} /><Wrap>
    <div className="rounded-2xl bg-pitch p-8 text-center text-chalk"><p className="display text-4xl md:text-6xl">{result && f.hs != null ? `${f.hs} - ${f.as}` : "VS"}</p>
      <p className="mt-2 uppercase tracking-widest text-floodlight">{f.status}</p></div>
    <p>{new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short", timeZone: "Africa/Accra" }).format(f.at)}{f.venue && ` · ${f.venue}`}</p>
    {f.notes && <p className="whitespace-pre-line">{f.notes}</p>}{summary && <p className="whitespace-pre-line text-lg">{summary}</p>}</Wrap></>);
}
