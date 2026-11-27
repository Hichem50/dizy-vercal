"use client";

import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { Logo } from "@/components/Logo";

export function PublicFooter() {
  const { t } = useLang();
  return (
    <footer className="pf">
      <div className="wrap">
        <div className="cols">
          <div>
            <Link className="brand" href="/"><Logo size={32} /><b>Dizy<em>.</em></b></Link>
            <p style={{ marginTop: 10 }}>{t.footD}</p>
          </div>
          <div>
            <h3>{t.fMarket}</h3>
            <Link href="/catalogue">{t.nav[1]}</Link>
            <Link href="/library">{t.lib}</Link>
            <Link href="/help">{t.nav[2]}</Link>
          </div>
          <div>
            <h3>{t.fVendors}</h3>
            <Link href="/register">{t.c2}</Link>
            <Link href="/dashboard">{t.sell}</Link>
          </div>
          <div>
            <h3>Dizy</h3>
            <Link href="/about">{t.nav[4]}</Link>
            <Link href="/contact">{t.nav[3]}</Link>
          </div>
        </div>
        <div className="cp">{t.copy}</div>
      </div>
    </footer>
  );
}
