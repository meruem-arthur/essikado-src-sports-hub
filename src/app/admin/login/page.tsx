"use client";
import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <main className="min-h-screen grid place-items-center bg-pitch p-4">
      <form action={action} className="w-full max-w-sm space-y-4 rounded-2xl bg-chalk p-8 shadow-2xl">
        <img src="/src-logo.png" alt="SRC" className="mx-auto h-20 w-20" />
        <p className="text-xs tracking-[.3em] text-turf">UMaT ESSIKADO · SRC SPORTS</p>
        <h1 className="display text-4xl">Admin Login</h1>
        <input name="email" type="email" required autoComplete="username" placeholder="Email"
          className="w-full rounded-lg border border-black/15 px-3 py-2.5" />
        <input name="password" type="password" required autoComplete="current-password" placeholder="Password"
          className="w-full rounded-lg border border-black/15 px-3 py-2.5" />
        {state?.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending} className="w-full rounded-lg bg-turf py-2.5 font-semibold text-white disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
