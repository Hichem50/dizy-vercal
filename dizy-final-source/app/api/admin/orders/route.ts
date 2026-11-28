import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/server/admin-auth";
import { envError, serverError } from "@/lib/server/http";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// GET /api/admin/orders → commandes en attente de confirmation de paiement.
export async function GET() {
  const e = envError();
  if (e) return e;
  try {
    if (!isAdmin()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const db = createAdminClient();
    const { data: orders, error } = await db
      .from("orders")
      .select("id,buyer_id,payment_method,reference,total,created_at")
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const out: any[] = [];
    for (const o of orders ?? []) {
      const { data: item } = await db.from("order_items").select("product_id").eq("order_id", o.id).maybeSingle();
      let title: string | null = null;
      if (item) {
        const { data: prod } = await db.from("products").select("title").eq("id", item.product_id).maybeSingle();
        title = prod?.title ?? null;
      }
      const { data: buyer } = await db.from("users").select("email").eq("id", o.buyer_id).maybeSingle();
      out.push({ id: o.id, title, buyerEmail: buyer?.email ?? null, method: o.payment_method, reference: o.reference, amount: o.total });
    }
    return NextResponse.json({ orders: out });
  } catch (err) {
    return serverError(err);
  }
}

// POST /api/admin/orders → { id, action: "confirm" | "reject" }
// confirm → commande PAID + émission d'un jeton de téléchargement pour l'acheteur.
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
    const { data: order } = await db.from("orders").select("id,buyer_id").eq("id", id).maybeSingle();
    if (!order) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });

    if (action === "reject") {
      await db.from("orders").update({ status: "REFUNDED", updated_at: new Date().toISOString() }).eq("id", id);
      return NextResponse.json({ ok: true, status: "REFUNDED" });
    }

    await db.from("orders").update({ status: "PAID", updated_at: new Date().toISOString() }).eq("id", id);

    // Émet un jeton de téléchargement par article de la commande (s'il n'existe pas déjà).
    const { data: items } = await db.from("order_items").select("id").eq("order_id", id);
    for (const it of items ?? []) {
      const { data: existing } = await db.from("download_tokens").select("id").eq("order_item_id", it.id).maybeSingle();
      if (!existing) {
        await db.from("download_tokens").insert({
          order_item_id: it.id,
          buyer_id: order.buyer_id,
          token: crypto.randomUUID().replace(/-/g, ""),
          expires_at: new Date(Date.now() + WEEK_MS).toISOString(),
        });
      }
    }
    return NextResponse.json({ ok: true, status: "PAID" });
  } catch (err) {
    return serverError(err);
  }
}
