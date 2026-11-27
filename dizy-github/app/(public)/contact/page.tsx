"use client";
import { useState } from "react";
import { useLang } from "@/components/LangProvider";

export default function ContactPage() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  return (
    <>
      <h1>{t.contactTitle}</h1>
      <form
        className="card col"
        style={{ maxWidth: 640 }}
        onSubmit={(e) => { e.preventDefault(); setSent(true); (e.currentTarget as HTMLFormElement).reset(); }}
      >
        <label>{t.fullName}<input name="n" required /></label>
        <label>{t.email}<input name="e" type="email" required /></label>
        <label>{t.msg}<textarea name="m" required style={{ minHeight: 110 }} /></label>
        {sent && <p className="ok">{t.sent}</p>}
        <button className="btn" type="submit" style={{ justifySelf: "start" }}>{t.send}</button>
      </form>
    </>
  );
}
