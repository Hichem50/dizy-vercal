"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { IC } from "@/lib/icons";

type Order = { id: string; status: string; title: string | null; price: number; token: string | null };

export default function LibraryPage() {
  const { t, lang, money } = useLang();
  const [user, setUser] = useState<null | { email: string }>(null);
  const [checked, setChecked] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => {
        setUser(d.user);
        if (d.user) return fetch("/api/orders?mine=1").then((r) => r.json()).then((o) => setOrders(o.orders ?? []));
      })
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  async function download(token: string) {
    setMsg("");
    const res = await fetch("/api/download/" + token);
    const d = await res.json().catch(() => null);
    if (res.ok && d?.url) window.open(d.url, "_blank");
    else setMsg(lang === "ar" ? "تعذّر التحميل." : "Téléchargement indisponible.");
  }

  const statusLabel = (s: string) =>
    s === "PAID" ? (lang === "ar" ? "مدفوع" : "Payé")
      : s === "REFUNDED" ? (lang === "ar" ? "ملغى" : "Annulé")
        : (lang === "ar" ? "في انتظار تأكيد الإدارة" : "En attente de confirmation");

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
      {msg ? <p className="err">{msg}</p> : null}
      {orders.length === 0 ? (
        <div className="card">
          <div className="empty">
            <svg className="i" viewBox="0 0 24 24"><path d={IC.lib} /></svg>
            <b>{t.libEmpty}</b>
            <Link className="btn" href="/catalogue">{t.c1}</Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="tw"><table>
            <thead><tr>
              <th>{lang === "ar" ? "المنتج" : "Produit"}</th>
              <th>{lang === "ar" ? "السعر" : "Prix"}</th>
              <th>{lang === "ar" ? "الحالة" : "Statut"}</th>
              <th></th>
            </tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.title ?? "—"}</td>
                  <td className="n">{money(o.price)}</td>
                  <td><span className={"chip " + (o.status === "PAID" ? "ok" : o.status === "REFUNDED" ? "er" : "wa")}>{statusLabel(o.status)}</span></td>
                  <td className="n">
                    {o.status === "PAID" && o.token
                      ? <button className="btn s" onClick={() => download(o.token!)}>{lang === "ar" ? "تحميل" : "Télécharger"}</button>
                      : <span className="k">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      )}
    </>
  );
}
