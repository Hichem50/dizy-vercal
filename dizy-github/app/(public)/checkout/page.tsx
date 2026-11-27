"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/components/LangProvider";
import { useCart } from "@/components/CartProvider";
import { PRODUCTS } from "@/lib/data";
import { IC } from "@/lib/icons";

export default function CheckoutPage() {
  const { lang, t, money } = useLang();
  const { items, remove } = useCart();
  const [user, setUser] = useState<null | { email: string }>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setChecked(true));
  }, []);

  const prods = items.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS;
  const total = prods.reduce((s, p) => s + p.price, 0);

  if (!items.length)
    return (
      <>
        <h1>{t.cartT}</h1>
        <div className="card">
          <div className="empty">
            <svg className="i" viewBox="0 0 24 24"><path d={IC.cart} /></svg>
            <b>{t.ce}</b>
            <Link className="btn" href="/catalogue">{t.c1}</Link>
          </div>
        </div>
      </>
    );

  return (
    <>
      <h1>{t.cartT}</h1>
      <div className="two">
        <div className="card">
          <h2>{t.sum}</h2>
          <div className="tw">
            <table>
              <thead><tr><th>{t.prod}</th><th>{t.total}</th><th></th></tr></thead>
              <tbody>
                {prods.map((p, k) => (
                  <tr key={p.id}>
                    <td><b>{lang === "ar" ? p.ar : p.fr}</b></td>
                    <td className="n">{money(p.price)}</td>
                    <td className="n"><button className="btn o s" onClick={() => remove(k)}>{t.rm}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row"><b>{t.total}</b><span className="v">{money(total)}</span></div>
        </div>
        <div className="card">
          {!checked ? (
            <span className="k">…</span>
          ) : user ? (
            <>
              <span className="chip">{user.email}</span>
              <p className="k" style={{ margin: 0 }}>{t.secure}</p>
              <p className="note">Le paiement (CCP / BaridiMob / RIP / RedotPay) sera branché à la prochaine étape.</p>
            </>
          ) : (
            <>
              <span className="chip"><svg className="i" viewBox="0 0 24 24"><path d={IC.user} /></svg>{t.needLogin}</span>
              <Link className="btn" href="/login">{t.goLogin}</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
