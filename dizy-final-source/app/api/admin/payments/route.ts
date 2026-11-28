import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/server/admin-auth";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

// GET /api/admin/payments → paiements d'abonnement en attente de confirmation.
export async function GET() {
  const e = envError();
  if (e) return e;
  try {
    if (!isAdmin()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const db = createAdminClient();
    const { data, error } = await db
      .from("subscription_payments")
      .select("id,method,reference,status,created_at,subscriptions(amount,stores(name))")
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const payments = (data ?? []).map((p: any) => {
      const sub = Array.isArray(p.subscriptions) ? p.subscriptions[0] : p.subscriptions;
      const store = sub ? (Array.isArray(sub.stores) ? sub.stores[0] : sub.stores) : null;
      return { id: p.id, method: p.method, reference: p.reference, amount: sub?.amount ?? 4000, storeName: store?.name ?? null };
    });
    return NextResponse.json({ payments });
  } catch (err) {
    return serverError(err);
  }
}

// POST /api/admin/payments → { id, action: "confirm" | "reject" }
// confirm → paiement CONFIRMED + abonnement ACTIVE pour 1 an (ouvre l'espace vendeur).
export async function POST(req: Request) {
  const e = envError();
  if (e) return e;
  try {
    if (!isAdmin()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const body = await req.json().catch(() => null);
    const id = String(body?.id ?? "");
    const action = String(body?.action ?? "");
    if (!id || (action !== "confirm" && action !== "reject")) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }
    const db = createAdminClient();
    const { data: pay } = await db
      .from("subscription_payments")
      .select("id,subscription_id")
      .eq("id", id)
      .maybeSingle();
    if (!pay) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    if (action === "confirm") {
      await db.from("subscription_payments").update({ status: "CONFIRMED" }).eq("id", id);
      const now = Date.now();
      await db
        .from("subscriptions")
        .update({
          status: "ACTIVE",
          started_at: new Date(now).toISOString(),
          expires_at: new Date(now + YEAR_MS).toISOString(),
          updated_at: new Date(now).toISOString(),
        })
        .eq("id", pay.subscription_id);
      return NextResponse.json({ ok: true, status: "ACTIVE" });
    }

    await db.from("subscription_payments").update({ status: "REJECTED" }).eq("id", id);
    await db.from("subscriptions").update({ status: "NONE", updated_at: new Date().toISOString() }).eq("id", pay.subscription_id);
    return NextResponse.json({ ok: true, status: "REJECTED" });
  } catch (err) {
    return serverError(err);
  }
}
