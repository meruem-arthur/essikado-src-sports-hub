"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ParallaxPhoto } from "./photo";
import type { Img } from "@/db/schema";

type Slide = { id: string; heading: string; description: string | null; image: Img; ctaLabel: string | null; ctaHref: string | null; secondaryCtaLabel: string | null; secondaryCtaHref: string | null };
const AUTOPLAY_MS = 6000;

/**
 * Home slideshow. Admin adds slides (Admin → Hero Slides); with 2+ it autoplays, with arrows, dots, swipe and a pause button.
 * The outgoing photo stays opaque under the incoming one so nothing (and no background colour) shows through mid-fade,
 * and only the visible slide receives clicks.
 */
export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const n = slides.length;
  const [st, setSt] = useState<{ i: number; prev: number | null }>({ i: 0, prev: null });
  const [playing, setPlaying] = useState(true);
  const startX = useRef<number | null>(null);
  const go = useCallback((d: number) => setSt((x) => ({ i: (x.i + d + n) % n, prev: x.i })), [n]);
  const goTo = useCallback((k: number) => setSt((x) => (k === x.i ? x : { i: k, prev: x.i })), []);

  useEffect(() => {
    if (st.prev === null) return;
    const t = setTimeout(() => setSt((x) => ({ ...x, prev: null })), 1500);
    return () => clearTimeout(t);
  }, [st]);
  useEffect(() => {
    if (n < 2 || !playing) return;
    const t = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [n, playing, go, st.i]);

  const arrow = "absolute top-1/2 z-30 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-2xl text-white backdrop-blur-sm transition hover:border-floodlight hover:bg-black/50 hover:text-floodlight sm:flex";
  return (
    <section aria-roledescription="carousel" aria-label="Featured" className="relative h-[88svh] min-h-[520px] overflow-hidden bg-black text-chalk md:h-[100svh]"
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerUp={(e) => { if (startX.current !== null && n > 1) { const dx = e.clientX - startX.current; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); } startX.current = null; }}>
      {slides.map((s, k) => {
        const active = k === st.i, visible = active || k === st.prev;
        return (
          <div key={s.id} aria-hidden={!active} className={`absolute inset-0 transition-opacity duration-[1400ms] ${active ? "" : "pointer-events-none"}`} style={{ opacity: visible ? 1 : 0, zIndex: active ? 2 : k === st.prev ? 1 : 0 }}>
            <ParallaxPhoto img={s.image} priority={k === 0} />
            {/* neutral shades only (no green cast): darker at the bottom for the text, a little at the top for the nav */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-20">
              <h1 className="display max-w-3xl break-words text-4xl [text-shadow:0_2px_18px_rgba(0,0,0,.6)] sm:text-5xl md:text-8xl">{s.heading}</h1>
              {s.description && <p className="mt-4 max-w-xl text-lg opacity-95 [text-shadow:0_1px_10px_rgba(0,0,0,.6)]">{s.description}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                {s.ctaLabel && s.ctaHref && <Link href={s.ctaHref} tabIndex={active ? 0 : -1} className="rounded-full bg-floodlight px-6 py-3 font-semibold text-ink">{s.ctaLabel}</Link>}
                {s.secondaryCtaLabel && s.secondaryCtaHref && <Link href={s.secondaryCtaHref} tabIndex={active ? 0 : -1} className="rounded-full border border-white/50 px-6 py-3 font-semibold">{s.secondaryCtaLabel}</Link>}
              </div>
            </div>
          </div>);
      })}
      {n > 1 && <>
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className={`${arrow} left-4 lg:left-8`}>‹</button>
        <button type="button" onClick={() => go(1)} aria-label="Next slide" className={`${arrow} right-4 lg:right-8`}>›</button>
        <div className="absolute inset-x-0 bottom-6 z-30 flex items-center justify-center gap-2">
          {slides.map((s, k) => <button key={s.id} type="button" aria-label={`Go to slide ${k + 1}`} aria-current={k === st.i} onClick={() => goTo(k)}
            className="h-[3px] transition-all duration-300" style={{ width: k === st.i ? 32 : 14, background: k === st.i ? "var(--color-floodlight)" : "rgba(246,245,239,.45)" }} />)}
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            className="ml-3 grid h-7 w-7 place-items-center rounded-full border border-white/40 text-[10px] text-white hover:border-floodlight hover:text-floodlight">{playing ? "❚❚" : "▶"}</button>
        </div></>}
    </section>
  );
}
