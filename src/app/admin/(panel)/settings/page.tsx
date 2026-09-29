import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/queries";
import { saveSettings } from "@/features/admin/more-actions";
import ImageField from "@/features/admin/ImageField";

export default async function Page() {
  await requireAdmin("settings:write"); const st = await getSettings();
  const c = "w-full rounded-lg border border-black/15 px-3 py-2", L = "block space-y-1 text-sm font-medium";
  return (<div className="space-y-4"><h1 className="display text-4xl">Settings</h1>
    <form action={saveSettings} className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <label className={L}>Site name<input name="site_name" defaultValue={st.siteName} required className={c} /></label>
      <label className={L}>Contact email<input name="contact_email" type="email" defaultValue={st.email ?? ""} className={c} /></label>
      <label className={L}>Footer text<input name="footer_text" defaultValue={st.footer ?? ""} className={c} /></label>
      {(["facebook", "instagram", "x", "youtube", "tiktok"] as const).map((k) => <label key={k} className={L}><span className="capitalize">{k} URL</span><input name={k} type="url" defaultValue={st.socials[k] ?? ""} className={c} /></label>)}
      <div className={L}>Logo<ImageField name="logo" folder="site" initial={st.logo ?? null} /></div>
      <button className="rounded-lg bg-turf px-5 py-2.5 font-semibold text-white">Save settings</button></form></div>);
}
