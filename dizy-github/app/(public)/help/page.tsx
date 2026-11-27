"use client";
import { useLang } from "@/components/LangProvider";

export default function HelpPage() {
  const { t } = useLang();
  return (
    <>
      <h1>{t.helpTitle}</h1>
      <div style={{ display: "grid", gap: 10, maxWidth: 800 }}>
        {t.faq.map((q, i) => (
          <details key={i} className="card" style={{ padding: "14px 16px" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>{q[0]}</summary>
            <p className="k" style={{ margin: "8px 0 0" }}>{q[1]}</p>
          </details>
        ))}
      </div>
    </>
  );
}
