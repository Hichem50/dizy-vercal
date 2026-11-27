"use client";

import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { HeroArt } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { CATS, PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

export default function Home() {
  const { lang, t } = useLang();
  return (
    <>
      <section className="hero">
        <div className="txt">
          <h1>{t.heroH}</h1>
          <p>{t.heroP}</p>
          <div className="pills">
            <Link className="btn" href="/catalogue">{t.c1}</Link>
            <Link className="btn o" href="/register">{t.c2}</Link>
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
