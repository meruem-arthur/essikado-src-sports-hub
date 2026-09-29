import Image from "next/image";
import type { Img } from "@/db/schema";

export function Photo({ img, alt = "", sizes = "(min-width:1024px) 33vw, 100vw", priority = false, className = "" }:
  { img?: Img | null; alt?: string; sizes?: string; priority?: boolean; className?: string }) {
  return (<div className={`relative overflow-hidden bg-gradient-to-br from-turf to-pitch ${className}`}>
    {img && <Image src={img.url} alt={img.alt ?? alt} fill sizes={sizes} priority={priority} className="object-cover transition duration-500 group-hover:scale-105" />}</div>);
}
