import { notFound } from "next/navigation";
import Image from "next/image";
import * as q from "@/lib/queries";
import { meta, SlugP } from "@/lib/seo";
import { PageHeader, Wrap, Empty } from "@/components/public/ui";
export async function generateMetadata({ params }: SlugP) { const a = await q.albumBySlug((await params).slug); return a ? meta(a.title, a.description, a.coverImage) : {}; }
export default async function Page({ params }: SlugP) {
  const a = await q.albumBySlug((await params).slug); if (!a) notFound(); const imgs = await q.albumImages(a.id);
  return (<><PageHeader title={a.title} sub={a.description ?? undefined} /><Wrap>{imgs.length ? <div className="columns-2 gap-4 md:columns-3">{imgs.map((i) => (
    <figure key={i.id} className="mb-4 break-inside-avoid"><Image src={i.url} alt={i.altText ?? i.caption ?? a.title} width={i.width ?? 1200} height={i.height ?? 800} sizes="(min-width:768px) 33vw, 50vw" loading="lazy" className="w-full rounded-xl" />
      {i.caption && <figcaption className="mt-1 text-sm text-black/60">{i.caption}</figcaption>}</figure>))}</div> : <Empty>No photos in this album yet.</Empty>}</Wrap></>); }
