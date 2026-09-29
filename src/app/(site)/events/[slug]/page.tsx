import { notFound } from "next/navigation";
import * as q from "@/lib/queries";
import { meta, SlugP } from "@/lib/seo";
import { PageHeader, Photo, Wrap } from "@/components/public/ui";
export async function generateMetadata({ params }: SlugP) { const e = await q.eventBySlug((await params).slug); return e ? meta(e.title, e.description, e.coverImage) : {}; }
export default async function Page({ params }: SlugP) {
  const e = await q.eventBySlug((await params).slug); if (!e) notFound();
  return (<><PageHeader title={e.title} sub={`${q.fmt(e.startsAt)}${e.venue ? ` · ${e.venue}` : ""}`} /><Wrap><Photo img={e.coverImage} alt={e.title} sizes="1100px" className="aspect-[16/8] rounded-2xl" /><p className="whitespace-pre-line text-lg">{e.description}</p></Wrap></>); }
