"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { ProductCard, type CardProduct } from "@/components/ProductCard";
import { CATS, PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

function catIndexOf(key: string | null) {
  const i = CATS.findIndex((c) => c.key === key);
  return i < 0 ? 0 : i;
}

function CatalogueInner() {
  const { lang, t } = useLang();
  const sp = useSearchParams();
  const initCat = sp.get("cat");
  const [cat, setCat] = useState<number>(initCat !== null ? Number(initCat) : -1);
  const [q, setQ] = useState("");
  const [real, setReal] = useState<CardProduct[] | null>(null);

  useEffect(() => {
    let on = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (!on) return;
        const list: CardProduct[] = (d.products ?? []).map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          catIndex: catIndexOf(p.catKey),
          storeName: p.storeName,
        }));
        setReal(list);
      })
      .catch(() => setReal([]));
    return () => {
      on = false;
    };
  }, []);

  const usingReal = real !== null && real.length > 0;
  const sample: CardProduct[] = PRODUCTS.map((p) => ({
    id: p.id,
    title: lang === "ar" ? p.ar : p.fr,
    price: p.price,
    catIndex: p.cat,
  }));
  const source = usingReal ? (real as CardProduct[]) : sample;

  const list = source.filter((p) => {
    const name = p.title.toLowerCase();
    return (cat < 0 || p.catIndex === cat) && name.includes(q.toLowerCase());
  });

  return (
    <>
      <div className="sec-h">
        <div>
          <h1>{t.nav[1]}</h1>
          <p className="note">{list.length} {t.items}</p>
        </div>
      </div>
      <label style={{ display: "block" }}>
        <input type="search" aria-label={t.find} placeholder={t.find} value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      <div className="pills" style={{ marginTop: 14 }}>
        <button aria-pressed={cat < 0} onClick={() => setCat(-1)}>{t.all}</button>
        {CATS.map((c, i) => (
          <button key={c.key} aria-pressed={cat === i} onClick={() => setCat(i)}>{lang === "ar" ? c.ar : c.fr}</button>
        ))}
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        {list.length ? (
          list.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div style={{ gridColumn: "1/-1" }} className="empty">
            <svg className="i" viewBox="0 0 24 24"><path d={IC.box} /></svg>
            <b>{t.none}</b>
          </div>
        )}
      </div>
      {!usingReal ? <p className="note" style={{ marginTop: 10 }}>{t.sample}</p> : null}
    </>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<p className="note">…</p>}>
      <CatalogueInner />
    </Suspense>
  );
}
