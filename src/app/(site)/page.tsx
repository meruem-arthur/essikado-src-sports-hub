import Link from "next/link";
import * as q from "@/lib/queries";
import HeroSlider from "@/components/public/HeroSlider";
import { Photo, Section, FixtureCard, Empty } from "@/components/public/ui";

export default async function Home() {
  const [slides, ev, up, res, news, ann, sports, albums, crew, sponsors] = await Promise.all([q.heroSlides(), q.nextEvent(), q.upcomingFixtures(4), q.latestResults(4),
    q.publishedNews(3), q.latestAnnouncement(), q.activeSports(), q.featuredAlbums(4), q.committee(4), q.activeSponsors()]);
  return (<>
    {slides.length ? <HeroSlider slides={slides as any} /> : <section className="bg-pitch py-28 text-chalk"><div className="mx-auto max-w-6xl px-4"><h1 className="display text-6xl md:text-9xl">UMaT SRC Sports</h1><p className="mt-4 opacity-80">Hero slides are managed from the admin dashboard.</p></div></section>}
    {(ev || ann) && <div className="bg-floodlight"><div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-1 px-4 py-3 text-sm font-semibold text-ink">
      {ev && <Link href={`/events/${ev.slug}`}>NEXT EVENT: {ev.title} · {q.fmt(ev.startsAt)}</Link>}
      {ann && <Link href={`/announcements/${ann.slug}`}>NOTICE: {ann.title}</Link>}</div></div>}
    <Section n="01 / FIXTURES" title="Up next" href="/fixtures">{up.length ? <div className="grid gap-4 md:grid-cols-2">{up.map((f) => <FixtureCard key={f.id} f={f} />)}</div> : <Empty>No upcoming fixtures yet.</Empty>}</Section>
    <Section n="02 / RESULTS" title="Full time" href="/results" dark>{res.length ? <div className="grid gap-4 md:grid-cols-2 text-ink">{res.map((f) => <FixtureCard key={f.id} f={f} result />)}</div> : <p className="opacity-60">No results yet.</p>}</Section>
    <Section n="03 / NEWS" title="Latest news" href="/news">{news.length ? <div className="grid gap-6 md:grid-cols-3">{news.map((n) => (
      <Link key={n.id} href={`/news/${n.slug}`} className="group"><Photo img={n.coverImage} alt={n.title} className="aspect-[16/10] rounded-2xl" />
        <p className="mt-3 text-xs text-black/50">{q.fmtDay(n.publishedAt)}</p><h3 className="text-lg font-bold group-hover:text-turf">{n.title}</h3><p className="text-sm text-black/60 line-clamp-2">{n.excerpt}</p></Link>))}</div> : <Empty>No news published yet.</Empty>}</Section>
    <Section n="04 / SPORTS" title="Our sports" href="/sports" dark>{sports.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{sports.map((s) => (
      <Link key={s.id} href={`/sports/${s.slug}`} className="group relative aspect-square overflow-hidden rounded-2xl"><Photo img={s.coverImage} sizes="25vw" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-pitch/90 to-transparent" /><span className="display absolute bottom-3 left-3 text-2xl">{s.name}</span></Link>))}</div> : <p className="opacity-60">Sports will appear here.</p>}</Section>
    {albums.length > 0 && <Section n="05 / GALLERY" title="In pictures" href="/gallery"><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{albums.map((a) => (
      <Link key={a.id} href={`/gallery/${a.slug}`} className="group"><Photo img={a.coverImage} sizes="25vw" className="aspect-square rounded-2xl" /><p className="mt-2 text-sm font-semibold">{a.title}</p></Link>))}</div></Section>}
    {crew.length > 0 && <Section n="06 / COMMITTEE" title="Meet the committee" href="/committee"><div className="grid grid-cols-2 gap-4 md:grid-cols-4">{crew.map((m) => (
      <div key={m.id}><Photo img={m.profileImage} alt={m.fullName} sizes="25vw" className="aspect-[4/5] rounded-2xl" /><p className="mt-2 font-bold">{m.fullName}</p><p className="text-sm text-turf">{m.position}</p></div>))}</div></Section>}
    {sponsors.length > 0 && <Section n="07 / PARTNERS" title="Backed by">
      <div className="flex flex-wrap items-center gap-8">{sponsors.map((p) => <span key={p.id} className="font-semibold">{p.name}</span>)}</div></Section>}
  </>);
}
