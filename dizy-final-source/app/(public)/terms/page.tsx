"use client";
import { useLang } from "@/components/LangProvider";

export default function TermsPage() {
  const { t } = useLang();
  return (
    <>
      <h1>{t.termsTitle}</h1>
      {t.termsList.map((n, i) => (
        <div className="card" key={i}><h2>{n}</h2><span className="k">{t.termsBody}</span></div>
      ))}
    </>
  );
}
