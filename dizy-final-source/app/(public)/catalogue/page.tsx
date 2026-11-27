"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { ProductCard } from "@/components/ProductCard";
import { CATS, PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

function CatalogueInner() {
  const { lang, t } = useLang();
  const sp = useSearchParams();
  const initCat = sp.get("cat");
  const [cat, setCat] = useState<number>(initCat !== null ? Number(initCat) : -1);
  const [q, setQ] = useState("");

  const list = PRODUCTS.filter((p) => {
    const name = (lang === "ar" ? p.ar : p.fr).toLowerCase();
    return (cat < 0 || p.cat === cat) && name.includes(q.toLowerCase());
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
          list.map((p) => <ProductCard key={p.id} id={p.id} />)
        ) : (
          <div style={{ gridColumn: "1/-1" }} className="empty">
            <svg className="i" viewBox="0 0 24 24"><path d={IC.box} /></svg>
            <b>{t.none}</b>
          </div>
        )}
      </div>
      <p className="note" style={{ marginTop: 10 }}>{t.sample}</p>
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
