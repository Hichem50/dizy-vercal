"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { useCart } from "@/components/CartProvider";
import { Cover } from "@/components/Cover";
import { ProductCard } from "@/components/ProductCard";
import { CATS, PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, t, money } = useLang();
  const { items, add } = useCart();
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return <div className="empty"><b>404</b><Link className="btn" href="/catalogue">{t.nav[1]}</Link></div>;
  const name = lang === "ar" ? p.ar : p.fr;
  const inCart = items.includes(p.id);
  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <>
      <nav className="crumb" aria-label="breadcrumb">
        <Link href="/">{t.home}</Link><span>/</span>
        <Link href="/catalogue">{t.nav[1]}</Link><span>/</span>
        <span>{lang === "ar" ? CATS[p.cat].ar : CATS[p.cat].fr}</span>
      </nav>
      <div className="two">
        <div className="card" style={{ padding: 12 }}><Cover cat={p.cat} h={340} /></div>
        <div className="card">
          <span className="chip">{t.ex}</span>
          <h1>{name}</h1>
          <Link className="k" href="/shop">{t.by} {lang === "ar" ? "متجر تجريبي" : "Boutique exemple"}</Link>
          <span className="v">{money(p.price)}</span>
          {inCart ? (
            <Link className="btn d" href="/checkout">{t.cart} →</Link>
          ) : (
            <button className="btn" onClick={() => add(p.id)}>
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
