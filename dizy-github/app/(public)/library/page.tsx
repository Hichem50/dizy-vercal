"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { IC } from "@/lib/icons";

export default function LibraryPage() {
  const { t } = useLang();
  const [user, setUser] = useState<null | { email: string }>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/me").then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user)).catch(() => setUser(null)).finally(() => setChecked(true));
  }, []);

  if (!checked) return <p className="note">…</p>;

  if (!user)
    return (
      <>
        <h1>{t.lib}</h1>
        <div className="card">
          <div className="empty">
            <svg className="i" viewBox="0 0 24 24"><path d={IC.lock} /></svg>
            <b>{t.needLogin}</b>
            <Link className="btn" href="/login">{t.goLogin}</Link>
          </div>
        </div>
      </>
    );

  return (
    <>
      <h1>{t.lib}</h1>
      <p className="note">{t.libHint}</p>
      <div className="card">
        <div className="empty">
          <svg className="i" viewBox="0 0 24 24"><path d={IC.lib} /></svg>
          <b>{t.libEmpty}</b>
          <Link className="btn" href="/catalogue">{t.c1}</Link>
        </div>
      </div>
    </>
  );
}
