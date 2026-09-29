import Image from "next/image";
import type { Img } from "@/db/schema";

export function Photo({ img, alt = "", sizes = "(min-width:1024px) 33vw, 100vw", priority = false, className = "", pos = "object-center" }:
  { img?: Img | null; alt?: string; sizes?: string; priority?: boolean; className?: string; pos?: string }) {
  return (<div className={`${className.includes("absolute") ? "" : "relative"} overflow-hidden bg-gradient-to-br from-turf to-pitch ${className}`}>
    {img && <Image src={img.url} alt={img.alt ?? alt} fill sizes={sizes} priority={priority} className={`object-cover ${pos} transition duration-500 group-hover:scale-105`} />}</div>);
}

/** Image stays fixed while the section scrolls over it (works on iOS: clip-path trick, no JS). */
export function ParallaxPhoto({ img, priority = false }: { img: Img; priority?: boolean }) {
  return (<div className="absolute inset-0 [clip-path:inset(0)]"><div className="absolute inset-0 md:fixed">
    <Image src={img.url} alt="" fill sizes="100vw" priority={priority} className="object-cover" /></div></div>);
}
