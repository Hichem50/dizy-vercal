"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { D, type Locale, type Dict } from "@/lib/i18n/dict";

type Ctx = { lang: Locale; setLang: (l: Locale) => void; t: Dict; money: (n: number) => string };
const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("fr");

  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem("dizy-lang"); } catch {}
    if (saved === "ar" || saved === "fr") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  function setLang(l: Locale) {
    setLangState(l);
    try { localStorage.setItem("dizy-lang", l); } catch {}
  }

  const t = D[lang];
  const money = (n: number) =>
    Number(n).toLocaleString(lang === "ar" ? "ar-DZ-u-nu-latn" : "fr-FR") + " " + (lang === "ar" ? "د.ج" : "DZD");

  return <LangCtx.Provider value={{ lang, setLang, t, money }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang must be used within LangProvider");
  return c;
}
