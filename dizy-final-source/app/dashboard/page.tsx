"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LangProvider";
import { DASH } from "@/lib/i18n/dash";
import { Logo } from "@/components/Logo";
import { IC } from "@/lib/icons";
import { CATS } from "@/lib/data";

type DProd = { id: string; title: string; catIndex: number; price: number; status: string };
const catIndexOf = (key: string | null) => {
  const i = CATS.findIndex((c) => c.key === key);
  return i < 0 ? 0 : i;
};

const PAGES = ["overview", "products", "orders", "customers", "earnings", "analytics", "reviews", "store"];
const ICN = ["grid", "box", "cart", "user", "wallet", "clock", "star", "store"];
const LOCK = ["products", "orders", "customers", "earnings", "analytics", "reviews"];

type Sub = "none" | "pending" | "active" | "expiring";
const I = (k: string) => <svg className="i" viewBox="0 0 24 24"><path d={IC[k]} /></svg>;

export default function Dashboard() {
  const { lang, setLang, money } = useLang();
  const router = useRouter();
  const t = DASH[lang];
  const cur = lang === "ar" ? "د.ج" : "DZD";

  const [page, setPage] = useState("overview");
  const [adding, setAdding] = useState(false);
  const [prods, setProds] = useState<DProd[]>([]);

  // Charge les produits réels de la boutique du vendeur.
  useEffect(() => {
    let on = true;
    fetch("/api/products?mine=1")
      .then((r) => r.json())
      .then((d) => {
        if (!on) return;
        const list: DProd[] = (d.products ?? []).map((p: any) => ({
          id: p.id,
          title: p.title,
          catIndex: catIndexOf(p.catKey),
          price: p.price,
          status: p.status,
        }));
        setProds(list);
      })
      .catch(() => {});
    return () => {
      on = false;
    };
  }, []);
  const [sub, setSub] = useState<Sub>("none");
  const [exp, setExp] = useState(0);
  const [rnp, setRnp] = useState(false);
  const [store, setStore] = useState({ name: "Dizy Store", user: "dizy", desc: "", m: 0, acct: "1234" });
  const [toast, setToast] = useState("");

  const live = sub === "active" || sub === "expiring";
  const days = () => Math.max(0, Math.ceil((exp - Date.now()) / 864e5));
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); };
  const fdate = (ms: number) => new Date(ms).toLocaleDateString(lang === "ar" ? "ar-DZ-u-nu-latn" : "fr-FR", { day: "numeric", month: "long", year: "numeric" });

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  }

  function subChip() {
    const c = { none: "mu", pending: "wa", active: "ok", expiring: "er" }[sub];
    return <span className={"chip " + c}>{t.subStatus[sub]}</span>;
  }

  function StatCard({ k, v, u }: { k: string; v: string; u?: string }) {
    return <div className="card"><span className="k">{k}</span><span className="v">{v}{u ? <small style={{ fontSize: 14, color: "var(--mut)" }}> {u}</small> : null}</span></div>;
  }
  function Empty({ h, p }: { h: string; p?: string }) {
    return <div className="empty">{I("box")}<b>{h}</b>{p ? <span>{p}</span> : null}</div>;
  }

  function SubCard() {
    return (
      <div className="card">
        <div className="row"><h2 style={{ fontSize: 17 }}>{t.sub}</h2>{subChip()}</div>
        {live ? (
          <>
            <span className="k">{t.exp} <b style={{ color: "var(--ink)" }}>{fdate(exp)}</b></span>
            <div className="meter" aria-hidden="true"><i style={{ width: Math.min(100, Math.round(days() / 365 * 100)) + "%" }} /></div>
            <span className="k">{days()} {t.left}</span>
            {rnp ? <span className="chip wa">{t.pendingPay}</span> : <button className={"btn" + (sub === "expiring" ? "" : " o")} onClick={() => setPage("activate")}>{t.renew}</button>}
          </>
        ) : sub === "pending" ? (
          <span className="k">{t.pendingPayD}</span>
        ) : (
          <><span className="k">{t.price}</span><button className="btn" onClick={() => setPage("activate")}>{t.activate}</button></>
        )}
      </div>
    );
  }

  function PayCard() {
    return (
      <div className="card">
        <h2 style={{ fontSize: 17 }}>{t.sMethod}</h2>
        <span className="k">{t.methods[store.m]} •••• {store.acct.slice(-4)}</span>
        <span className="k">{t.e1}</span>
        <span className="v">0 <small style={{ fontSize: 14, color: "var(--mut)" }}>{cur}</small></span>
        <button className="btn" onClick={() => flash(t.eMin)}>{lang === "ar" ? "سحب" : "Retirer"}</button>
      </div>
    );
  }

  function Paywall() {
    return (
      <div className="card" style={{ alignItems: "flex-start", padding: 28 }}>
        <span className="chip">{I("lock")}{t.sub}</span>
        <h1 style={{ fontSize: 22 }}>{t.lockTitle}</h1>
        <p className="k" style={{ margin: 0, maxWidth: 620 }}>{t.lockDesc}</p>
        {sub === "pending"
          ? <><b>{t.pendingPay}</b><span className="k">{t.pendingPayD}</span></>
          : <button className="btn" onClick={() => setPage("activate")}>{t.bannerAct}</button>}
      </div>
    );
  }

  function Banner() {
    if (sub === "active") return null;
    if (sub === "expiring")
      return <div className="card bar"><div><b>{t.subStatus.expiring}</b><div className="k">{t.remind.replace("{d}", String(days()))}</div></div>{rnp ? <span className="chip wa">{t.pendingPay}</span> : <button className="btn" onClick={() => setPage("activate")}>{t.renew}</button>}</div>;
    const p = sub === "pending";
    return <div className="card bar"><div><b>{p ? t.pendingPay : t.bannerAct}</b><div className="k">{p ? t.pendingPayD : t.bannerActD}</div></div>{p ? null : <button className="btn" onClick={() => setPage("activate")}>{t.bannerAct}</button>}</div>;
  }

  function Head({ title, sub: s, btn }: { title: string; sub?: string; btn?: React.ReactNode }) {
    return <div className="dtop"><div><h1 style={{ fontSize: 24 }}>{title}</h1>{s ? <p className="k" style={{ marginTop: 4 }}>{s}</p> : null}</div>{btn}</div>;
  }

  const addBtn = <button className="btn" onClick={() => { setAdding(true); setPage("products"); }}>{I("box")}{t.addProduct}</button>;

  function content() {
    if (page === "activate") return <Activate />;
    if (LOCK.includes(page) && !live) return <Paywall />;
    switch (page) {
      case "overview":
        return (<>
          <Head title={t.hi + ", Ada"} sub={t.hs} btn={live ? addBtn : undefined} />
          <section className="g4">
            <StatCard k={t.s1} v="0" u={cur} /><StatCard k={t.s2} v="0" /><StatCard k={t.s3} v="0" /><StatCard k={t.s4} v="0 %" />
          </section>
          <section className="two">
            <div className="card"><div className="row"><h2 style={{ fontSize: 17 }}>{t.salesOverview}</h2><span className="k">{t.l30}</span></div><div className="chart">{t.noSale}</div></div>
            <SubCard />
          </section>
          <section className="two">
            <div className="card"><div className="row"><h2 style={{ fontSize: 17 }}>{t.recent}</h2></div><Empty h={t.noOrders} p={t.noOrdersT} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}><PayCard /></div>
          </section>
        </>);
      case "products":
        if (adding)
          return (<>
            <Head title={t.nav[1]} />
            <form className="card dform" onSubmit={async (e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const title = String(f.get("n") || "").trim();
              const categoryKey = String(f.get("c") || "");
              const price = Number(f.get("p"));
              const description = String(f.get("d") || "");
              const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, categoryKey, price, description }),
              });
              const d = await res.json().catch(() => null);
              if (res.ok && d?.product) {
                const p = d.product;
                setProds((x) => [{ id: p.id, title: p.title, catIndex: catIndexOf(p.catKey), price: p.price, status: p.status }, ...x]);
                setAdding(false);
                flash(t.pOk);
              } else {
                flash(d?.error ? String(d.error).slice(0, 90) : "Erreur");
              }
            }}>
              <label className="full">{t.pName}<input name="n" required maxLength={120} /></label>
              <label>{t.pCat}<select name="c">{CATS.map((c) => <option key={c.key} value={c.key}>{lang === "ar" ? c.ar : c.fr}</option>)}</select></label>
              <label>{t.pPrice}<input name="p" type="number" min="0" required inputMode="numeric" /></label>
              <label className="full">{t.pDesc}<textarea name="d" style={{ minHeight: 100 }} /></label>
              <label className="full">{t.pFile}<span className="drop"><input type="file" name="f" /><small>{I("lock")} {t.pFileH}</small></span></label>
              <div className="full row" style={{ justifyContent: "flex-start" }}><button className="btn" type="submit">{t.submit}</button><button className="btn o" type="button" onClick={() => setAdding(false)}>{t.cancel}</button></div>
            </form>
          </>);
        return (<>
          <Head title={t.nav[1]} btn={addBtn} />
          <div className="card">
            {prods.length ? (
              <div className="tw"><table><thead><tr>{t.colP.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>
                {prods.map((p) => <tr key={p.id}><td>{p.title}</td><td>{CATS[p.catIndex] ? (lang === "ar" ? CATS[p.catIndex].ar : CATS[p.catIndex].fr) : "—"}</td><td className="n">{money(p.price)}</td><td><span className={"chip " + (p.status === "APPROVED" ? "ok" : p.status === "REJECTED" ? "er" : "wa")}>{p.status === "APPROVED" ? (lang === "ar" ? "منشور" : "Publié") : p.status === "REJECTED" ? (lang === "ar" ? "مرفوض" : "Refusé") : t.pending}</span></td></tr>)}
              </tbody></table></div>
            ) : <Empty h={t.noProd} p={t.noProdT} />}
          </div>
        </>);
      case "orders": return <><Head title={t.nav[2]} /><div className="card"><Empty h={t.noOrders} p={t.noOrdersT} /></div></>;
      case "customers": return <><Head title={t.nav[3]} /><div className="card"><Empty h={t.noCustomers} p={t.noCustomersT} /></div></>;
      case "earnings":
        return <><Head title={t.nav[4]} /><section className="g4"><StatCard k={t.e1} v="0" u={cur} /><StatCard k={t.e2} v="0" u={cur} /><StatCard k={t.e3} v="0" u={cur} /></section><section className="two"><div className="card"><h2 style={{ fontSize: 17 }}>{t.wHist}</h2><Empty h={t.noWithdraw} p={t.eMin} /></div><PayCard /></section></>;
      case "analytics": return <><Head title={t.nav[5]} /><section className="g4"><StatCard k={t.aViews} v="0" /><StatCard k={t.aConv} v="0 %" /></section><div className="card"><h2 style={{ fontSize: 17 }}>{t.aTop}</h2><Empty h={t.aTop} p={t.aNone} /></div></>;
      case "reviews": return <><Head title={t.nav[6]} /><section className="g4"><StatCard k={t.rAvg} v="—" /></section><div className="card"><Empty h={t.noRev} p={t.noRevT} /></div></>;
      case "store":
        return (<>
          <Head title={t.nav[7]} btn={<Link className="btn o" href="/shop">{I("store")}{t.shopView}</Link>} />
          <div className="two">
            <form className="card dform" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); setStore({ name: String(f.get("name")), user: String(f.get("user")), desc: String(f.get("desc")), m: Number(f.get("m")), acct: String(f.get("acct")) }); flash(t.saved); }}>
              <label className="full">{t.sName}<input name="name" required maxLength={60} defaultValue={store.name} /></label>
              <label>{t.sUser}<span className="sfx" dir="ltr"><span>dizy.store/</span><input name="user" required pattern="[a-z0-9-]{3,30}" defaultValue={store.user} /></span></label>
              <label className="full">{t.sDesc}<textarea name="desc" defaultValue={store.desc} style={{ minHeight: 90 }} /></label>
              <label>{t.sMethod}<select name="m" defaultValue={store.m}>{t.methods.map((m, i) => <option key={i} value={i}>{m}</option>)}</select></label>
              <label>{t.sAcct}<input name="acct" required inputMode="numeric" pattern="[0-9]{4,}" dir="ltr" defaultValue={store.acct} /><small>{t.sAcctH}</small></label>
              <div className="full"><button className="btn" type="submit">{t.save}</button></div>
            </form>
            <SubCard />
          </div>
        </>);
      default: return null;
    }
  }

  function Activate() {
    const info = (
      <div className="card"><span className="chip">{t.price}</span>
        <ul style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>{t.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
        <span className="k">{t.free}</span>
      </div>
    );
    const payPanel = (
      <div className="card" style={{ gap: 10, background: "var(--bg)" }}>
        <div className="row"><b>{t.payTitle}</b><span className="chip">4000 {cur}</span></div>
        <span className="k">{t.payHint}</span>
        {t.payRows.map((r, i) => <div className="row" key={i} style={{ borderTop: "1px solid var(--bd)", paddingTop: 8 }}><span className="k">{r[0]}</span><b dir="ltr" style={{ fontSize: 13 }}>{r[1]}</b></div>)}
        <span className="note">{t.payNote}</span>
      </div>
    );
    const ren = live;
    if (sub === "pending" || (ren && rnp))
      return <><Head title={ren ? t.renewTitle : t.activate} />
        <div className="two">{info}<div className="card"><b>{t.pendingPay}</b><span className="k">{t.pendingPayD}</span>
          <button className="btn o" style={{ alignSelf: "flex-start" }} onClick={() => { setExp(Date.now() + 365 * 864e5); setSub("active"); setRnp(false); flash(t.activated); setPage("overview"); }}>{t.demoConfirm}</button>
        </div></div></>;
    return <><Head title={ren ? t.renewTitle : t.activate} sub={ren ? t.exp + " " + fdate(exp) : undefined} />
      <div className="two">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{info}{payPanel}</div>
        <form className="card" style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => { e.preventDefault(); if (live) setRnp(true); else setSub("pending"); flash(t.sentReceipt); setPage("overview"); }}>
          <label>{t.ref}<input name="r" required /></label>
          <label>{t.receipt}<input type="file" accept="image/*" /></label>
          <button className="btn" type="submit">{t.payBtn}</button>
        </form>
      </div></>;
  }

  return (
    <div className="app">
      <aside className="sb">
        <Link className="brand" href="/" style={{ padding: "0 6px" }}><Logo /><span><b>Dizy<em>.</em></b></span></Link>
        <nav>
          {PAGES.map((p, i) => (
            <button key={p} aria-current={page === p ? "page" : undefined} onClick={() => { setPage(p); if (p !== "products") setAdding(false); }}>
              {I(ICN[i])}{t.nav[i]}{LOCK.includes(p) && !live ? <span className="lk2">{I("lock")}</span> : null}
            </button>
          ))}
        </nav>
        <div className="sub-side">
          <div className="row"><b>{t.sub}</b>{subChip()}</div>
          {live ? <span className="k">{t.exp} {fdate(exp)}</span> : <button className="btn s" onClick={() => setPage("activate")}>{sub === "pending" ? t.pendingPay : t.activate}</button>}
        </div>
      </aside>
      <div style={{ minWidth: 0 }}>
        <div className="dhead">
          <div className="tools">
            <Link className="btn o s" href="/">{I("store")}{t.site}</Link>
            <div className="seg" role="group" aria-label="Langue / اللغة">
              <button aria-pressed={lang === "fr"} onClick={() => setLang("fr")}>FR</button>
              <button aria-pressed={lang === "ar"} onClick={() => setLang("ar")}>AR</button>
            </div>
            <button className="btn o s" onClick={logout}>{t.logout}</button>
          </div>
        </div>
        <main className="dmain">{page === "activate" ? null : <Banner />}{content()}</main>
      </div>
      {toast ? <div id="toast" className="on">{toast}</div> : null}
    </div>
  );
}
