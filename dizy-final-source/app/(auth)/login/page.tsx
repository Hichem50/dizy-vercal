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
  if (code === "EMAIL_NOT_CONFIRMED")
    return ar
      ? "البريد غير مؤكَّد. أكّد الإيميل، أو عطّل «Confirm email» في Supabase للتجربة."
      : "E-mail non confirmé. Confirmez-le ou désactivez « Confirm email » dans Supabase.";
  if (code === "INVALID_CREDENTIALS") return fallback;
  if (code === "SERVER_ERROR")
    return (ar ? "خطأ في الخادم: " : "Erreur serveur : ") + (serverMsg ?? "");
  return serverMsg || fallback;
}

export default function LoginPage() {
  const { t, lang } = useLang();
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: f.get("email"), password: f.get("password") }),
      });
      let d: any = null;
      try { d = await res.json(); } catch {}
      setBusy(false);
      if (!res.ok) {
        setErr(msgFor(lang, d?.error, d?.message, t.loginFail));
        return;
      }
      router.push(routeForRole(d.role));
      router.refresh();
    } catch {
      setBusy(false);
      setErr(lang === "ar" ? "تعذّر الاتصال بالخادم. حاول مجدداً." : "Connexion au serveur impossible. Réessayez.");
    }
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
