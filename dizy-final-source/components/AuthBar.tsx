"use client";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { Logo } from "@/components/Logo";

export function AuthBar() {
  const { lang, setLang, t } = useLang();
  return (
    <div className="ph">
      <div className="wrap" style={{ justifyContent: "space-between" }}>
        <Link className="brand" href="/"><Logo /><span><b>Dizy<em>.</em></b><small>{t.tagline}</small></span></Link>
        <div className="seg" role="group" aria-label="Langue / اللغة">
          <button aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
          <button aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>AR</button>
        </div>
      </div>
    </div>
  );
}
