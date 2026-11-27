"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { Logo } from "@/components/Logo";
import { IC } from "@/lib/icons";

const A = {
  fr: {
    title: "Administration", sub: "Validation des boutiques, produits et paiements.",
    tabs: ["Boutiques", "Produits", "Paiements", "Réglages"],
    pendingStores: "Boutiques en attente", pendingProducts: "Produits en attente", pendingPay: "Paiements à confirmer",
    none: "Rien en attente pour le moment.", settings: "Comptes de réception et prix",
    priceLbl: "Prix de l'abonnement annuel (DZD)", save: "Enregistrer", saved: "Réglages enregistrés.",
    accounts: "Comptes de réception (RIP / CCP / RedotPay)", site: "Voir le site",
  },
  ar: {
    title: "لوحة الإدارة", sub: "مراجعة المتاجر والمنتجات والمدفوعات.",
    tabs: ["المتاجر", "المنتجات", "المدفوعات", "الإعدادات"],
    pendingStores: "متاجر قيد المراجعة", pendingProducts: "منتجات قيد المراجعة", pendingPay: "مدفوعات للتأكيد",
    none: "لا شيء قيد الانتظار حاليًا.", settings: "حسابات الاستلام والسعر",
    priceLbl: "سعر الاشتراك السنوي (د.ج)", save: "حفظ", saved: "تم حفظ الإعدادات.",
    accounts: "حسابات الاستلام (RIP / CCP / RedotPay)", site: "عرض الموقع",
  },
};

export default function Admin() {
  const { lang, setLang } = useLang();
  const t = A[lang];
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState("");
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2400); };
  const I = (k: string) => <svg className="i" viewBox="0 0 24 24"><path d={IC[k]} /></svg>;

  const empty = (h: string) => <div className="card"><div className="empty">{I("check")}<b>{h}</b><span>{t.none}</span></div></div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
      <div className="dtop" style={{ marginBottom: 20 }}>
        <Link className="brand" href="/"><Logo /><span><b>Dizy<em>.</em></b><small>ADMIN</small></span></Link>
        <div className="tools" style={{ display: "flex", gap: 10 }}>
          <Link className="btn o s" href="/">{I("store")}{t.site}</Link>
          <div className="seg" role="group" aria-label="Langue / اللغة">
            <button aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
            <button aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>AR</button>
          </div>
        </div>
      </div>
      <h1 style={{ fontSize: 24 }}>{t.title}</h1>
      <p className="k" style={{ marginTop: 4 }}>{t.sub}</p>
      <div className="pills" style={{ margin: "16px 0" }}>
        {t.tabs.map((x, i) => <button key={i} aria-pressed={tab === i} onClick={() => setTab(i)}>{x}</button>)}
      </div>
      {tab === 0 && empty(t.pendingStores)}
      {tab === 1 && empty(t.pendingProducts)}
      {tab === 2 && empty(t.pendingPay)}
      {tab === 3 && (
        <form className="card col" style={{ maxWidth: 640 }} onSubmit={(e) => { e.preventDefault(); flash(t.saved); }}>
          <h2 style={{ fontSize: 17 }}>{t.settings}</h2>
          <label>{t.priceLbl}<input name="price" type="number" defaultValue={4000} inputMode="numeric" /></label>
          <label>{t.accounts}<textarea name="acc" placeholder="RIP: …&#10;CCP: …&#10;RedotPay: …" style={{ minHeight: 100 }} /></label>
          <button className="btn" type="submit" style={{ justifySelf: "start" }}>{t.save}</button>
        </form>
      )}
      {toast ? <div id="toast" className="on">{toast}</div> : null}
    </div>
  );
}
