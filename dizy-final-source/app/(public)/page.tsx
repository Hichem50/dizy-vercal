"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { HeroArt } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { CATS, PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

export default function Home() {
  const { lang, t } = useLang();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(-1);
  const trending = lang === "ar"
    ? ["قوالب Notion", "لوحات تحكم", "خطوط عربية", "حزم أيقونات"]
    : ["Templates Notion", "Dashboards", "Polices arabes", "Packs d'icônes"];

  function search(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (cat >= 0) params.set("cat", String(cat));
    if (q.trim()) params.set("q", q.trim());
    const qs = params.toString();
    router.push("/catalogue" + (qs ? "?" + qs : ""));
  }

  return (
    <>
      <section className="hero">
        <div className="txt">
          <h1>{t.heroH}</h1>
          <p>{t.heroP}</p>
          <form className="hsearch" onSubmit={search}>
            <select value={cat} onChange={(e) => setCat(Number(e.target.value))} aria-label={lang === "ar" ? "الفئة" : "Catégorie"}>
              <option value={-1}>{lang === "ar" ? "الكل" : "Toutes"}</option>
              {CATS.map((c, i) => <option key={c.key} value={i}>{lang === "ar" ? c.ar : c.fr}</option>)}
            </select>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={lang === "ar" ? "ابحث عن منتج أو متجر…" : "Chercher un produit, une boutique…"} />
            <button className="btn" type="submit">{lang === "ar" ? "بحث" : "Chercher"}</button>
          </form>
          <div className="htags">
            {trending.map((tg, i) => <Link key={i} href={`/catalogue?q=${encodeURIComponent(tg)}`}>{tg}</Link>)}
          </div>
          <ul className="trust">
            {t.trust.map((s, i) => (
              <li key={i}><svg className="i" viewBox="0 0 24 24"><path d={IC.check} /></svg>{s}</li>
            ))}
          </ul>
        </div>
        <HeroArt />
      </section>

      <section>
        <div className="sec-h"><h2>{t.cats}</h2></div>
        <div className="catg">
          {CATS.map((c, i) => (
            <Link key={c.key} href={`/catalogue?cat=${i}`}>
              <i style={{ background: c.color }}>
                <svg className="i" viewBox="0 0 24 24"><path d={IC[c.icon]} /></svg>
              </i>
              {lang === "ar" ? c.ar : c.fr}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="sec-h"><h2>{t.feat}</h2><Link className="lk" href="/catalogue">{t.seeAll} →</Link></div>
        <div className="grid">
          {["p1", "p5", "p4", "p6"].map((id) => <ProductCard key={id} id={id} />)}
        </div>
        <p className="note" style={{ marginTop: 10 }}>{t.sample}</p>
      </section>

      <section>
        <div className="sec-h"><h2>{t.how}</h2></div>
        <div className="g4">
          {t.hw.map((s, i) => (
            <div className="card" key={i}>
              <span className="chip">{i + 1}</span>
              <h3>{s[0]}</h3>
              <span className="k">{s[1]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div><h2>{t.ctaT}</h2><p>{t.ctaP}</p></div>
        <Link className="btn" href="/register">{t.c2}</Link>
      </section>
    </>
  );
}
