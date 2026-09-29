"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ParallaxPhoto } from "./photo";
import type { Img } from "@/db/schema";
type Slide = { id: string; heading: string; description: string | null; image: Img; ctaLabel: string | null; ctaHref: string | null; secondaryCtaLabel: string | null; secondaryCtaHref: string | null };
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  useEffect(() => { if (slides.length < 2) return; const t = setInterval(() => setI((x) => (x + 1) % slides.length), 6000); return () => clearInterval(t); }, [slides.length]);
  return (<section className="relative h-[88svh] min-h-[520px] md:h-[100svh] overflow-hidden bg-pitch text-chalk">
    {slides.map((s, k) => (<div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
      <ParallaxPhoto img={s.image} priority={k === 0} /><div className="absolute inset-0 bg-gradient-to-t from-pitch via-pitch/50 to-transparent" />
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16"><h1 className="display max-w-3xl break-words text-4xl sm:text-5xl md:text-8xl">{s.heading}</h1>
        {s.description && <p className="mt-4 max-w-xl text-lg opacity-90">{s.description}</p>}
        <div className="mt-6 flex flex-wrap gap-3">{s.ctaLabel && s.ctaHref && <Link href={s.ctaHref} className="rounded-full bg-floodlight px-6 py-3 font-semibold text-ink">{s.ctaLabel}</Link>}
          {s.secondaryCtaLabel && s.secondaryCtaHref && <Link href={s.secondaryCtaHref} className="rounded-full border border-white/50 px-6 py-3 font-semibold">{s.secondaryCtaLabel}</Link>}</div></div></div>))}</section>);
}
