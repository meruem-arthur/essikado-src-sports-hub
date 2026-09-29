import { notFound } from "next/navigation";
import type { Metadata } from "next";
import * as q from "@/lib/queries";
import { Photo } from "@/components/public/ui";
type P = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const n = await q.newsBySlug((await params).slug); if (!n) return {};
  const images = n.coverImage ? [n.coverImage.url] : undefined;
  return { title: n.title, description: n.excerpt ?? undefined, openGraph: { title: n.title, description: n.excerpt ?? undefined, images, type: "article" }, twitter: { card: "summary_large_image", images } };
}
export default async function Page({ params }: P) {
  const n = await q.newsBySlug((await params).slug); if (!n) notFound();
  return (<article className="mx-auto max-w-3xl px-4 py-12"><p className="text-sm text-turf">{q.fmtDay(n.publishedAt)}{n.author && ` · ${n.author}`}</p>
    <h1 className="display my-3 text-4xl md:text-6xl">{n.title}</h1><Photo img={n.coverImage} alt={n.title} sizes="768px" className="my-6 aspect-[16/9] rounded-2xl" />
    <div className="whitespace-pre-line text-lg leading-relaxed">{n.content}</div></article>);
}
