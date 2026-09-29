import { notFound } from "next/navigation";
import * as q from "@/lib/queries";
import { MatchView } from "@/components/public/ui";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const f = await q.fixtureById((await params).id); if (!f) notFound(); return <MatchView f={f} result={f.status === "completed"} />; }
