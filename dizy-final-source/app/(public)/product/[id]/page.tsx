"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { useCart } from "@/components/CartProvider";
import { Cover } from "@/components/Cover";
import { ProductCard, type CardProduct } from "@/components/ProductCard";
import { CATS, PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

function catIndexOf(key: string | null) {
  const i = CATS.findIndex((c) => c.key === key);
  return i < 0 ? 0 : i;
}

type View = { id: string; name: string; catIndex: number; price: number; store: string };

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, t, money } = useLang();
  const { items, add } = useCart();
  const [buying, setBuying] = useState(false);
  const [omsg, setOmsg] = useState("");
  const [oerr, setOerr] = useState("");

  const mock = PRODUCTS.find((x) => x.id === id);
  const [state, setState] = useState<"loading" | "notfound" | CardProduct | null>(mock ? null : "loading");

  useEffect(() => {
    if (mock) return;
    let on = true;
    fetch(`/api/products/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!on) return;
        if (d?.product) {
          const p = d.product;
          setState({ id: p.id, title: p.title, price: p.price, catIndex: catIndexOf(p.catKey), storeName: p.storeName });
        } else {
          setState("notfound");
        }
      })
      .catch(() => setState("notfound"));
    return () => {
      on = false;
    };
  }, [id, mock]);

  let view: View | null = null;
  if (mock) {
    view = {
      id: mock.id,
      name: lang === "ar" ? mock.ar : mock.fr,
      catIndex: mock.cat,
      price: mock.price,
      store: lang === "ar" ? "متجر تجريبي" : "Boutique exemple",
    };
  } else if (state && state !== "loading" && state !== "notfound") {
    view = {
      id: state.id,
      name: state.title,
      catIndex: state.catIndex,
      price: state.price,
      store: state.storeName ?? (lang === "ar" ? "متجر" : "Boutique"),
    };
  }

  if (!mock && state === "loading") return <p className="note">…</p>;
  if (!view) return <div className="empty"><b>404</b><Link className="btn" href="/catalogue">{t.nav[1]}</Link></div>;

  const inCart = items.includes(view.id);
  const related = PRODUCTS.filter((x) => x.id !== view!.id).slice(0, 4);

  return (
    <>
      <nav className="crumb" aria-label="breadcrumb">
        <Link href="/">{t.home}</Link><span>/</span>
        <Link href="/catalogue">{t.nav[1]}</Link><span>/</span>
        <span>{CATS[view.catIndex] ? (lang === "ar" ? CATS[view.catIndex].ar : CATS[view.catIndex].fr) : ""}</span>
      </nav>
      <div className="two">
        <div className="card" style={{ padding: 12 }}><Cover cat={view.catIndex} h={340} /></div>
        <div className="card">
          <span className="chip">{view.store}</span>
          <h1>{view.name}</h1>
          <span className="v">{money(view.price)}</span>
          {inCart ? (
            <Link className="btn d" href="/checkout">{t.cart} →</Link>
          ) : (
            <button className="btn" onClick={() => add(view!.id)}>
              <svg className="i" viewBox="0 0 24 24"><path d={IC.cart} /></svg>{t.add}
            </button>
          )}
          {!buying ? (
            <button className="btn" onClick={() => { setBuying(true); setOmsg(""); setOerr(""); }}>
              {lang === "ar" ? "اشترِ الآن" : "Acheter maintenant"}
            </button>
          ) : (
            <form className="col" onSubmit={async (e) => {
              e.preventDefault();
              setOerr(""); setOmsg("");
              const f = new FormData(e.currentTarget);
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: view!.id, method: f.get("method"), reference: f.get("ref") }),
              });
              const d = await res.json().catch(() => null);
              if (res.ok) { setBuying(false); setOmsg(lang === "ar" ? "تم إرسال طلبك — في انتظار تأكيد الإدارة، ثم يظهر رابط التحميل في مكتبتك." : "Commande envoyée — en attente de confirmation ; le lien de téléchargement apparaîtra dans votre bibliothèque."); }
              else if (res.status === 401) { setOerr(lang === "ar" ? "سجّل الدخول أولاً للشراء." : "Connectez-vous pour acheter."); }
              else { setOerr(d?.message || d?.error || "Erreur"); }
            }}>
              <label>{lang === "ar" ? "طريقة الدفع" : "Méthode de paiement"}
                <select name="method" required defaultValue="CCP">
                  <option value="CCP">CCP</option>
                  <option value="BARIDIMOB">BaridiMob</option>
                  <option value="RIP">RIP</option>
                  <option value="REDOTPAY">RedotPay</option>
                </select>
              </label>
              <label>{lang === "ar" ? "مرجع الدفع" : "Référence du paiement"}<input name="ref" required /></label>
              <div className="row" style={{ justifyContent: "flex-start", gap: 8 }}>
                <button className="btn" type="submit">{lang === "ar" ? "تأكيد الطلب" : "Confirmer la commande"}</button>
                <button className="btn o" type="button" onClick={() => setBuying(false)}>{lang === "ar" ? "إلغاء" : "Annuler"}</button>
              </div>
            </form>
          )}
          {omsg ? <p className="ok">{omsg}</p> : null}
          {oerr ? <p className="err">{oerr}</p> : null}
          <p className="k" style={{ margin: 0, display: "flex", gap: 8 }}>
            <svg className="i" viewBox="0 0 24 24"><path d={IC.shield} /></svg>{t.secure}
          </p>
          <h3>{t.inc}</h3>
          <span className="k">{t.incv}</span>
        </div>
      </div>
      <div className="card"><h2>{t.rev}</h2><span className="k">{t.norev}</span></div>
      <section>
        <div className="sec-h"><h2>{t.rel}</h2></div>
        <div className="grid">{related.map((r) => <ProductCard key={r.id} id={r.id} />)}</div>
      </section>
    </>
  );
}
