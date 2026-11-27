"use client";

import { useLang } from "@/components/LangProvider";
import { Cover } from "@/components/Cover";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/data";

export default function ShopPage() {
  const { lang, t } = useLang();
  const shopName = lang === "ar" ? "متجر تجريبي" : "Boutique exemple";
  return (
    <>
      <div className="card" style={{ padding: 0, overflow: "hidden", gap: 0 }}>
        <Cover cat={0} h={160} />
        <div style={{ padding: "16px 20px" }}>
          <h1>{shopName}</h1>
          <span className="k" dir="ltr">dizy.store/boutique</span>
          <p className="note" style={{ marginTop: 10 }}>{t.shopDesc}</p>
        </div>
      </div>
      <div className="grid">{PRODUCTS.map((p) => <ProductCard key={p.id} id={p.id} />)}</div>
      <p className="note">{t.sample}</p>
    </>
  );
}
