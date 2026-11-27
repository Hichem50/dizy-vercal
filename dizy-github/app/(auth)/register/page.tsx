"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { routeForRole } from "@/lib/auth/redirect";

export default function RegisterPage() {
  const { t } = useLang();
  const router = useRouter();
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    const f = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: f.get("fullName"),
        email: f.get("email"),
        password: f.get("password"),
        phone: f.get("phone"),
        accountType: f.get("accountType"),
      }),
    });
    const d = await res.json();
    setBusy(false);
    if (!res.ok) { setErr(d.error ? `${t.regFail} (${d.error})` : t.regFail); return; }
    if (d.needsEmailConfirmation) { setMsg(t.needConfirm); return; }
    router.push(routeForRole(d.role));
    router.refresh();
  }

  return (
    <>
      <h1>{t.regTitle}</h1>
      <form className="col" onSubmit={onSubmit}>
        <fieldset className="rdo">
          <legend className="muted" style={{ marginBottom: 6 }}>{t.accountType}</legend>
          <label><input type="radio" name="accountType" value="seller" defaultChecked /><span><b>{t.seller}</b><small>{t.sellerHint}</small></span></label>
          <label><input type="radio" name="accountType" value="buyer" /><span><b>{t.buyer}</b><small>{t.buyerHint}</small></span></label>
        </fieldset>
        <label>{t.fullName}<input name="fullName" required autoComplete="name" /></label>
        <label>{t.email}<input name="email" type="email" required autoComplete="email" /></label>
        <label>{t.phone}<input name="phone" inputMode="tel" autoComplete="tel" /></label>
        <label>{t.password}<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label>
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button className="btn" disabled={busy}>{busy ? "…" : t.createBtn}</button>
        <p className="muted">{t.haveAccount} <Link href="/login">{t.loginTitle}</Link></p>
      </form>
    </>
  );
}
