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
