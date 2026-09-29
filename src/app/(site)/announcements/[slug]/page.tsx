import { notFound } from "next/navigation";
import * as q from "@/lib/queries";
import { meta, SlugP } from "@/lib/seo";
import { PageHeader, Photo, Wrap } from "@/components/public/ui";
export async function generateMetadata({ params }: SlugP) { const a = await q.announcementBySlug((await params).slug); return a ? meta(a.title, a.description, a.flyer) : {}; }
export default async function Page({ params }: SlugP) {
  const a = await q.announcementBySlug((await params).slug); if (!a) notFound(); const gone = a.expiresAt && +a.expiresAt < Date.now();
  return (<><PageHeader title={a.title} sub={gone ? "This announcement has expired." : undefined} /><Wrap>{a.flyer && <Photo img={a.flyer} alt={a.title} sizes="800px" className="aspect-[4/5] max-w-lg rounded-2xl" />}<p className="whitespace-pre-line text-lg">{a.description}</p></Wrap></>); }
