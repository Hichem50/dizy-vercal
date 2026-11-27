"use client";

import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { Cover } from "@/components/Cover";
import { CATS, PRODUCTS } from "@/lib/data";

export function ProductCard({ id }: { id: string }) {
  const { lang, t, money } = useLang();
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return null;
  const name = lang === "ar" ? p.ar : p.fr;
  const cat = lang === "ar" ? CATS[p.cat].ar : CATS[p.cat].fr;
  return (
    <article className="card pc">
      <Cover cat={p.cat} h={150} />
      <span className="k">{cat}</span>
      <h3>{name}</h3>
      <Link className="k" href="/shop">{t.by} {lang === "ar" ? "متجر تجريبي" : "Boutique exemple"}</Link>
      <div className="row">
        <span className="pr">{money(p.price)}</span>
        <Link className="btn o s" href={`/product/${p.id}`}>{t.view}</Link>
      </div>
    </article>
  );
}
