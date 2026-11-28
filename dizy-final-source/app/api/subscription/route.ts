import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

const METHODS = ["CCP", "BARIDIMOB", "RIP", "REDOTPAY"];

async function getStore(admin: any, userId: string) {
  const { data } = await admin.from("stores").select("id").eq("owner_id", userId).maybeSingle();
  return data;
}

// GET /api/subscription → état de l'abonnement du vendeur connecté.
export async function GET() {
  const e = envError();
  if (e) return e;
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const admin = createAdminClient();
    const store = await getStore(admin, user.id);
    if (!store) return NextResponse.json({ status: "NONE", amount: 4000, expiresAt: null });
    const { data: sub } = await admin
      .from("subscriptions")
      .select("status,amount,expires_at")
      .eq("store_id", store.id)
      .maybeSingle();
    if (!sub) return NextResponse.json({ status: "NONE", amount: 4000, expiresAt: null });
    return NextResponse.json({ status: sub.status, amount: sub.amount, expiresAt: sub.expires_at });
  } catch (err) {
    return serverError(err);
  }
}

// POST /api/subscription → le vendeur déclare un paiement { method, reference } → PENDING.
export async function POST(req: Request) {
  const e = envError();
  if (e) return e;
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }
    const body = await req.json().catch(() => null);
    const method = String(body?.method ?? "");
    const reference = String(body?.reference ?? "").trim();
    if (!METHODS.includes(method) || !reference) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const admin = createAdminClient();

    let store = await getStore(admin, user.id);
    if (!store) {
      const slug = "store-" + user.id.slice(0, 8);
      const name = user.fullName || user.email.split("@")[0] || "Ma boutique";
      const { data: created, error: se } = await admin
        .from("stores")
        .insert({ owner_id: user.id, name, slug, status: "PENDING" })
        .select("id")
        .single();
      if (se) return NextResponse.json({ error: "STORE_CREATE_FAILED", message: se.message }, { status: 500 });
      store = created;
    }

    let { data: sub } = await admin.from("subscriptions").select("id").eq("store_id", store.id).maybeSingle();
    if (!sub) {
      const { data: cs, error: ce } = await admin
        .from("subscriptions")
        .insert({ store_id: store.id, amount: 4000, status: "PENDING" })
        .select("id")
        .single();
      if (ce) return NextResponse.json({ error: "SUB_CREATE_FAILED", message: ce.message }, { status: 500 });
      sub = cs;
    } else {
      await admin.from("subscriptions").update({ status: "PENDING", updated_at: new Date().toISOString() }).eq("id", sub.id);
    }

    const { error: pe } = await admin
      .from("subscription_payments")
      .insert({ subscription_id: sub.id, method, reference, status: "PENDING" });
    if (pe) return NextResponse.json({ error: "PAYMENT_CREATE_FAILED", message: pe.message }, { status: 500 });

    return NextResponse.json({ ok: true, status: "PENDING" });
  } catch (err) {
    return serverError(err);
  }
}
