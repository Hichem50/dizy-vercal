"use client";

import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { Cover } from "@/components/Cover";
import { CATS, PRODUCTS } from "@/lib/data";

// Un produit prêt à afficher (réel, venu de l'API) ou, à défaut, un exemple via `id`.
export type CardProduct = {
  id: string;
  title: string;
  price: number;
  catIndex: number;
  storeName?: string | null;
};

export function ProductCard({ id, product }: { id?: string; product?: CardProduct }) {
  const { lang, t, money } = useLang();

  let pid: string;
  let name: string;
  let catIndex: number;
  let price: number;
  let storeName: string | null | undefined;

  if (product) {
    pid = product.id;
    name = product.title;
    catIndex = product.catIndex;
    price = product.price;
    storeName = product.storeName;
  } else {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return null;
    pid = p.id;
    name = lang === "ar" ? p.ar : p.fr;
    catIndex = p.cat;
    price = p.price;
    storeName = undefined;
  }

  const catLabel = CATS[catIndex] ? (lang === "ar" ? CATS[catIndex].ar : CATS[catIndex].fr) : "";
  const shop = storeName ?? (lang === "ar" ? "متجر تجريبي" : "Boutique exemple");

  return (
    <article className="card pc">
      <Cover cat={catIndex} h={150} />
      <span className="k">{catLabel}</span>
      <h3>{name}</h3>
      <span className="k">{t.by} {shop}</span>
      <div className="row">
        <span className="pr">{money(price)}</span>
        <Link className="btn o s" href={`/product/${pid}`}>{t.view}</Link>
      </div>
    </article>
  );
}
