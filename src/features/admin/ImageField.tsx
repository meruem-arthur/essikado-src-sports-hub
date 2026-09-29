"use client";
import { useState } from "react";
type I = { publicId: string; url: string } | null;
export default function ImageField({ name, folder, initial }: { name: string; folder: string; initial: I }) {
  const [img, setImg] = useState<I>(initial); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(f.type) || f.size > 10 * 1024 * 1024) return setErr("Use JPG/PNG/WebP/AVIF under 10MB");
    setBusy(true); setErr("");
    try {
      const sig = await (await fetch(`/api/admin/upload-sign?folder=${folder}`)).json();
      if (sig.error) throw new Error(sig.error);
      const fd = new FormData(); fd.append("file", f);
      for (const k of ["apiKey:api_key", "timestamp:timestamp", "signature:signature", "folder:folder"]) { const [a, b] = k.split(":"); fd.append(b, sig[a]); }
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: fd });
      const j = await res.json(); if (!res.ok) throw new Error(j.error?.message);
      setImg({ publicId: j.public_id, url: j.secure_url });
    } catch (x: any) { setErr(x.message || "Upload failed"); }
    setBusy(false);
  }
  return (
    <div className="space-y-2">
      {img && <img src={img.url.replace("/upload/", "/upload/f_auto,q_auto,w_300/")} alt="" className="h-28 rounded-lg object-cover" />}
      <input type="file" accept="image/*" onChange={pick} disabled={busy} className="text-sm" />
      {busy && <p className="text-sm">Uploading…</p>}{err && <p className="text-sm text-red-600">{err}</p>}
      {img && <button type="button" onClick={() => setImg(null)} className="text-sm text-red-600">Remove</button>}
      <input type="hidden" name={name} value={img ? JSON.stringify(img) : ""} />
    </div>
  );
}
