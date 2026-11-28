"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { Logo } from "@/components/Logo";
import { IC } from "@/lib/icons";

const A = {
  fr: {
    title: "Administration", sub: "Validation des boutiques, produits et paiements.",
    tabs: ["Boutiques", "Produits", "Paiements", "Commandes", "Réglages"],
    pendingStores: "Boutiques en attente", pendingProducts: "Produits en attente", pendingPay: "Paiements à confirmer",
    none: "Rien en attente pour le moment.", settings: "Comptes de réception et prix",
    priceLbl: "Prix de l'abonnement annuel (DZD)", save: "Enregistrer", saved: "Réglages enregistrés.",
    accounts: "Comptes de réception (RIP / CCP / RedotPay)", site: "Voir le site",
    cProd: "Produit", cStore: "Boutique", cPrice: "Prix",
    approve: "Approuver", reject: "Refuser", approved: "Produit publié.", rejected: "Produit refusé.",
    cMethod: "Méthode", cRef: "Référence", cAmount: "Montant",
    confirmPay: "Confirmer", payConfirmed: "Paiement confirmé — abonnement activé.", payRejected: "Paiement refusé.",
    pendingOrders: "Commandes à confirmer", cBuyer: "Acheteur",
    orderConfirmed: "Commande confirmée — téléchargement débloqué.", orderRejected: "Commande annulée.",
    loading: "Chargement…", logout: "Déconnexion",
    loginTitle: "Espace administrateur", loginSub: "Entrez le mot de passe administrateur.",
    pass: "Mot de passe", enter: "Entrer", badPass: "Mot de passe incorrect.",
    notConfigured: "Mot de passe admin non configuré. Ajoutez la variable ADMIN_PASSWORD dans Vercel (Settings → Environment Variables), puis redéployez.",
  },
  ar: {
    title: "لوحة الإدارة", sub: "مراجعة المتاجر والمنتجات والمدفوعات.",
    tabs: ["المتاجر", "المنتجات", "المدفوعات", "الطلبات", "الإعدادات"],
    pendingStores: "متاجر قيد المراجعة", pendingProducts: "منتجات قيد المراجعة", pendingPay: "مدفوعات للتأكيد",
    none: "لا شيء قيد الانتظار حاليًا.", settings: "حسابات الاستلام والسعر",
    priceLbl: "سعر الاشتراك السنوي (د.ج)", save: "حفظ", saved: "تم حفظ الإعدادات.",
    accounts: "حسابات الاستلام (RIP / CCP / RedotPay)", site: "عرض الموقع",
    cProd: "المنتج", cStore: "المتجر", cPrice: "السعر",
    approve: "موافقة ونشر", reject: "رفض", approved: "تم نشر المنتج.", rejected: "تم رفض المنتج.",
    cMethod: "الطريقة", cRef: "المرجع", cAmount: "المبلغ",
    confirmPay: "تأكيد الدفع", payConfirmed: "تم تأكيد الدفع — فُعّل الاشتراك.", payRejected: "تم رفض الدفع.",
    pendingOrders: "طلبات للتأكيد", cBuyer: "المشتري",
    orderConfirmed: "تم تأكيد الطلب — فُتح التحميل للمشتري.", orderRejected: "تم إلغاء الطلب.",
    loading: "جارٍ التحميل…", logout: "خروج",
    loginTitle: "فضاء الإدارة", loginSub: "أدخل كلمة سرّ المشرف.",
    pass: "كلمة السرّ", enter: "دخول", badPass: "كلمة السرّ غير صحيحة.",
    notConfigured: "كلمة سرّ الأدمن غير مضبوطة. أضف المتغيّر ADMIN_PASSWORD في Vercel (Settings → Environment Variables) ثم أعد النشر.",
  },
};

type P = { id: string; title: string; price: number; storeName: string | null };
type Pay = { id: string; method: string; reference: string; amount: number; storeName: string | null };
type Ord = { id: string; title: string | null; buyerEmail: string | null; method: string; reference: string; amount: number };

export default function Admin() {
  const { lang, setLang, money } = useLang();
  const t = A[lang];
  const [authed, setAuthed] = useState<null | boolean>(null);
  const [configured, setConfigured] = useState(true);
  const [pwd, setPwd] = useState("");
  const [loginErr, setLoginErr] = useState("");

  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState("");
  const [pend, setPend] = useState<P[]>([]);
  const [listStatus, setListStatus] = useState<"idle" | "loading" | "ok">("idle");
  const [pays, setPays] = useState<Pay[]>([]);
  const [payStatus, setPayStatus] = useState<"idle" | "loading" | "ok">("idle");
  const [ords, setOrds] = useState<Ord[]>([]);
  const [ordStatus, setOrdStatus] = useState<"idle" | "loading" | "ok">("idle");
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2400); };
  const I = (k: string) => <svg className="i" viewBox="0 0 24 24"><path d={IC[k]} /></svg>;

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => { setAuthed(Boolean(d.admin)); setConfigured(Boolean(d.configured)); })
      .catch(() => setAuthed(false));
  }, []);

  const load = useCallback(() => {
    setListStatus("loading");
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => {
        setPend((d.products ?? []).map((p: any) => ({ id: p.id, title: p.title, price: p.price, storeName: p.storeName })));
        setListStatus("ok");
      })
      .catch(() => setListStatus("ok"));
  }, []);

  const loadPayments = useCallback(() => {
    setPayStatus("loading");
    fetch("/api/admin/payments")
      .then((r) => (r.ok ? r.json() : { payments: [] }))
      .then((d) => {
        setPays((d.payments ?? []).map((p: any) => ({ id: p.id, method: p.method, reference: p.reference, amount: p.amount, storeName: p.storeName })));
        setPayStatus("ok");
      })
      .catch(() => setPayStatus("ok"));
  }, []);

  const loadOrders = useCallback(() => {
    setOrdStatus("loading");
    fetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => {
        setOrds((d.orders ?? []).map((o: any) => ({ id: o.id, title: o.title, buyerEmail: o.buyerEmail, method: o.method, reference: o.reference, amount: o.amount })));
        setOrdStatus("ok");
      })
      .catch(() => setOrdStatus("ok"));
  }, []);

  useEffect(() => { if (authed && tab === 1) load(); }, [authed, tab, load]);
  useEffect(() => { if (authed && tab === 2) loadPayments(); }, [authed, tab, loadPayments]);
  useEffect(() => { if (authed && tab === 3) loadOrders(); }, [authed, tab, loadOrders]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoginErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd }),
    });
    if (res.ok) { setAuthed(true); setPwd(""); }
    else if (res.status === 500) { setConfigured(false); }
    else { setLoginErr(t.badPass); }
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setAuthed(false);
  }

  async function act(id: string, action: "approve" | "reject") {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) { setPend((x) => x.filter((p) => p.id !== id)); flash(action === "approve" ? t.approved : t.rejected); }
    else { flash("Erreur"); }
  }

  async function actPay(id: string, action: "confirm" | "reject") {
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) { setPays((x) => x.filter((p) => p.id !== id)); flash(action === "confirm" ? t.payConfirmed : t.payRejected); }
    else { flash("Erreur"); }
  }

  async function actOrder(id: string, action: "confirm" | "reject") {
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) { setOrds((x) => x.filter((o) => o.id !== id)); flash(action === "confirm" ? t.orderConfirmed : t.orderRejected); }
    else { flash("Erreur"); }
  }

  const langSeg = (
    <div className="seg" role="group" aria-label="Langue / اللغة">
      <button aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
      <button aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>AR</button>
    </div>
  );

  // ----- Écran de connexion admin -----
  if (authed !== true) {
    return (
      <div className="auth-wrap">
        <div className="dtop" style={{ marginBottom: 20 }}>
          <Link className="brand" href="/"><Logo /><span><b>Dizy<em>.</em></b><small>ADMIN</small></span></Link>
          {langSeg}
        </div>
        <h1 style={{ fontSize: 22 }}>{t.loginTitle}</h1>
        <p className="k" style={{ marginTop: 4 }}>{t.loginSub}</p>
        {!configured ? (
          <p className="err" style={{ marginTop: 16 }}>{t.notConfigured}</p>
        ) : (
          <form className="col" onSubmit={login}>
            {loginErr ? <p className="err">{loginErr}</p> : null}
            <label>{t.pass}<input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required autoFocus /></label>
            <button className="btn" type="submit" disabled={authed === null}>{t.enter}</button>
          </form>
        )}
      </div>
    );
  }

  const empty = (h: string) => <div className="card"><div className="empty">{I("check")}<b>{h}</b><span>{t.none}</span></div></div>;

  function ProductsTab() {
    if (listStatus === "loading") return <div className="card"><div className="empty">{I("clock")}<b>{t.loading}</b></div></div>;
    if (pend.length === 0) return empty(t.pendingProducts);
    return (
      <div className="card">
        <div className="tw"><table>
          <thead><tr><th>{t.cProd}</th><th>{t.cStore}</th><th>{t.cPrice}</th><th></th></tr></thead>
          <tbody>
            {pend.map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.storeName ?? "—"}</td>
                <td className="n">{money(p.price)}</td>
                <td className="n">
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn s" onClick={() => act(p.id, "approve")}>{t.approve}</button>
                    <button className="btn o s" onClick={() => act(p.id, "reject")}>{t.reject}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    );
  }

  function PaymentsTab() {
    if (payStatus === "loading") return <div className="card"><div className="empty">{I("clock")}<b>{t.loading}</b></div></div>;
    if (pays.length === 0) return empty(t.pendingPay);
    return (
      <div className="card">
        <div className="tw"><table>
          <thead><tr><th>{t.cStore}</th><th>{t.cMethod}</th><th>{t.cRef}</th><th>{t.cAmount}</th><th></th></tr></thead>
          <tbody>
            {pays.map((p) => (
              <tr key={p.id}>
                <td>{p.storeName ?? "—"}</td>
                <td>{p.method}</td>
                <td dir="ltr">{p.reference}</td>
                <td className="n">{money(p.amount)}</td>
                <td className="n">
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn s" onClick={() => actPay(p.id, "confirm")}>{t.confirmPay}</button>
                    <button className="btn o s" onClick={() => actPay(p.id, "reject")}>{t.reject}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    );
  }

  function OrdersTab() {
    if (ordStatus === "loading") return <div className="card"><div className="empty">{I("clock")}<b>{t.loading}</b></div></div>;
    if (ords.length === 0) return empty(t.pendingOrders);
    return (
      <div className="card">
        <div className="tw"><table>
          <thead><tr><th>{t.cProd}</th><th>{t.cBuyer}</th><th>{t.cMethod}</th><th>{t.cRef}</th><th>{t.cAmount}</th><th></th></tr></thead>
          <tbody>
            {ords.map((o) => (
              <tr key={o.id}>
                <td>{o.title ?? "—"}</td>
                <td dir="ltr">{o.buyerEmail ?? "—"}</td>
                <td>{o.method}</td>
                <td dir="ltr">{o.reference}</td>
                <td className="n">{money(o.amount)}</td>
                <td className="n">
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <button className="btn s" onClick={() => actOrder(o.id, "confirm")}>{t.confirmPay}</button>
                    <button className="btn o s" onClick={() => actOrder(o.id, "reject")}>{t.reject}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>
    );
  }

  // ----- Panneau admin (connecté) -----
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
      <div className="dtop" style={{ marginBottom: 20 }}>
        <Link className="brand" href="/"><Logo /><span><b>Dizy<em>.</em></b><small>ADMIN</small></span></Link>
        <div className="tools" style={{ display: "flex", gap: 10 }}>
          <Link className="btn o s" href="/">{I("store")}{t.site}</Link>
          {langSeg}
          <button className="btn o s" onClick={logout}>{t.logout}</button>
        </div>
      </div>
      <h1 style={{ fontSize: 24 }}>{t.title}</h1>
      <p className="k" style={{ marginTop: 4 }}>{t.sub}</p>
      <div className="pills" style={{ margin: "16px 0" }}>
        {t.tabs.map((x, i) => <button key={i} aria-pressed={tab === i} onClick={() => setTab(i)}>{x}</button>)}
      </div>
      {tab === 0 && empty(t.pendingStores)}
      {tab === 1 && <ProductsTab />}
      {tab === 2 && <PaymentsTab />}
      {tab === 3 && <OrdersTab />}
      {tab === 4 && (
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
