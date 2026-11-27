"use client";
import { useLang } from "@/components/LangProvider";

export default function AboutPage() {
  const { t } = useLang();
  return (
    <>
      <h1>{t.aboutTitle}</h1>
      <p style={{ maxWidth: 680, fontSize: 17, margin: 0 }}>{t.aboutP}</p>
    </>
  );
}
