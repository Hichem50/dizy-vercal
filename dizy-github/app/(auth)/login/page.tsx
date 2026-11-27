"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { routeForRole } from "@/lib/auth/redirect";

export default function LoginPage() {
  const { t } = useLang();
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(t.loginFail); return; }
    router.push(routeForRole(d.role));
    router.refresh();
  }

  return (
    <>
      <h1>{t.loginTitle}</h1>
      <p className="muted">{t.loginSub}</p>
      <form className="col" onSubmit={onSubmit}>
        <label>{t.email}<input name="email" type="email" required autoComplete="email" /></label>
        <label>{t.password}
          <span style={{ display: "flex", gap: 8 }}>
            <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" />
            <button type="button" className="btn o" onClick={() => setShow((s) => !s)}>{show ? t.hide : t.show}</button>
          </span>
        </label>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? "…" : t.loginTitle}</button>
        <p className="muted">{t.noAccount} <Link href="/register">{t.createLink}</Link></p>
      </form>
    </>
  );
}
