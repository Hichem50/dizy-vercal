"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { useCart } from "@/components/CartProvider";
import { Logo } from "@/components/Logo";

export function PublicHeader() {
  const { lang, setLang, t } = useLang();
  const { items } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const links: [string, string][] = [
    ["/", t.nav[0]], ["/catalogue", t.nav[1]], ["/help", t.nav[2]], ["/contact", t.nav[3]], ["/about", t.nav[4]],
  ];
  return (
    <header className={"ph" + (open ? " open" : "")}>
      <div className="wrap">
        <Link className="brand" href="/">
          <Logo />
          <span><b>Dizy<em>.</em></b><small>{t.tagline}</small></span>
        </Link>
        <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <svg className="i" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <nav className="pn">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? "page" : undefined}>{label}</Link>
          ))}
        </nav>
        <div className="tools">
          <div className="seg" role="group" aria-label="Langue / اللغة">
            <button aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
            <button aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>AR</button>
          </div>
          <Link className="lk" href="/checkout">
            <svg className="i" viewBox="0 0 24 24"><path d="M3 4h2l2.5 11h10L20 8H6M9 20h.01M17 20h.01" /></svg>
            {t.cart}{items.length > 0 ? <span className="badge">{items.length}</span> : null}
          </Link>
          <Link className="lk" href="/login">{t.login}</Link>
          <Link className="btn" href="/dashboard">{t.sell}</Link>
        </div>
      </div>
    </header>
  );
}
