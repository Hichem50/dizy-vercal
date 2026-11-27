"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { routeForRole } from "@/lib/auth/redirect";

function msgFor(lang: string, code: string | undefined, serverMsg: string | undefined, fallback: string) {
  const ar = lang === "ar";
  if (code === "SERVER_NOT_CONFIGURED")
    return ar
      ? "الخادم غير مهيّأ: مفاتيح Supabase ناقصة في Vercel. أضف المتغيّرات وأعد النشر."
      : "Serveur non configuré : variables Supabase manquantes sur Vercel.";
  if (code === "DB_WRITE_FAILED")
    return (ar ? "فشل الحفظ في قاعدة البيانات: " : "Échec d'écriture en base : ") + (serverMsg ?? "");
  if (code === "SIGNUP_FAILED")
    return (ar ? "تعذّر إنشاء الحساب: " : "Création impossible : ") + (serverMsg ?? fallback);
  if (code === "SERVER_ERROR")
    return (ar ? "خطأ في الخادم: " : "Erreur serveur : ") + (serverMsg ?? "");
  return serverMsg ? `${fallback} (${serverMsg})` : fallback;
}

export default function RegisterPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
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
      let d: any = null;
      try { d = await res.json(); } catch {}
      setBusy(false);
      if (!res.ok) {
        setErr(msgFor(lang, d?.error, d?.message, t.regFail));
        return;
      }
      if (d.needsEmailConfirmation) { setMsg(t.needConfirm); return; }
      router.push(routeForRole(d.role));
      router.refresh();
    } catch {
      setBusy(false);
      setErr(lang === "ar" ? "تعذّر الاتصال بالخادم. حاول مجدداً." : "Connexion au serveur impossible. Réessayez.");
    }
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
