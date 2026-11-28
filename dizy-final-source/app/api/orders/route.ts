import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

const METHODS = ["CCP", "BARIDIMOB", "RIP", "REDOTPAY"];

// GET /api/orders?mine=1 → commandes de l'acheteur connecté (+ jeton de téléchargement si payé).
export async function GET(req: Request) {
  const e = envError();
  if (e) return e;
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const admin = createAdminClient();

    const { data: orders, error } = await admin
      .from("orders")
      .select("id,status,payment_method,reference,total,created_at")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const out: any[] = [];
    for (const o of orders ?? []) {
      const { data: item } = await admin
        .from("order_items")
        .select("id,product_id,price")
        .eq("order_id", o.id)
        .maybeSingle();
      let title: string | null = null;
      if (item) {
        const { data: prod } = await admin.from("products").select("title").eq("id", item.product_id).maybeSingle();
        title = prod?.title ?? null;
      }
      let token: string | null = null;
      if (o.status === "PAID" && item) {
        const { data: dt } = await admin
          .from("download_tokens")
          .select("token")
          .eq("order_item_id", item.id)
          .maybeSingle();
        token = dt?.token ?? null;
      }
      out.push({ id: o.id, status: o.status, title, price: o.total, token });
    }
    return NextResponse.json({ orders: out });
  } catch (err) {
    return serverError(err);
  }
}

// POST /api/orders → l'acheteur commande un produit et déclare un paiement { productId, method, reference }.
export async function POST(req: Request) {
  const e = envError();
  if (e) return e;
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const body = await req.json().catch(() => null);
    const productId = String(body?.productId ?? "");
    const method = String(body?.method ?? "");
    const reference = String(body?.reference ?? "").trim();
    if (!productId || !METHODS.includes(method) || !reference) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: product } = await admin
      .from("products")
      .select("id,price,status")
      .eq("id", productId)
      .eq("status", "APPROVED")
      .maybeSingle();
    if (!product) return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });

    const { data: order, error: oe } = await admin
      .from("orders")
      .insert({ buyer_id: user.id, total: product.price, status: "PENDING", payment_method: method, reference })
      .select("id")
      .single();
    if (oe) return NextResponse.json({ error: "ORDER_CREATE_FAILED", message: oe.message }, { status: 500 });

    const { error: ie } = await admin
      .from("order_items")
      .insert({ order_id: order.id, product_id: product.id, price: product.price });
    if (ie) return NextResponse.json({ error: "ORDER_ITEM_FAILED", message: ie.message }, { status: 500 });

    return NextResponse.json({ ok: true, orderId: order.id, status: "PENDING" });
  } catch (err) {
    return serverError(err);
  }
}
