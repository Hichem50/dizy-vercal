import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { ensureCategories, toApiProduct, PRODUCT_SELECT } from "@/lib/server/products";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

// GET /api/products          → produits APPROVED (catalogue public)
// GET /api/products?mine=1   → produits de la boutique du vendeur connecté (tous statuts)
export async function GET(req: Request) {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    const url = new URL(req.url);
    const mine = url.searchParams.get("mine");
    const admin = createAdminClient();

    if (mine) {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
      const { data: store } = await admin
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!store) return NextResponse.json({ products: [] });
      const { data, error } = await admin
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ products: (data ?? []).map(toApiProduct) });
    }

    const { data, error } = await admin
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "APPROVED")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products: (data ?? []).map(toApiProduct) });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/products → crée un produit pour le vendeur connecté.
export async function POST(req: Request) {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== "SELLER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const title = String(body?.title ?? "").trim();
    const price = Number(body?.price);
    const categoryKey = body?.categoryKey ? String(body.categoryKey) : null;
    const description = body?.description ? String(body.description).trim() : null;

    if (!title || title.length > 120 || !Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const admin = createAdminClient();
    await ensureCategories(admin);

    // Trouver ou créer la boutique du vendeur.
    let { data: store } = await admin
      .from("stores")
      .select("id")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!store) {
      const slug = "store-" + user.id.slice(0, 8);
      const name = user.fullName || user.email.split("@")[0] || "Ma boutique";
      const { data: created, error: sErr } = await admin
        .from("stores")
        .insert({ owner_id: user.id, name, slug, status: "PENDING" })
        .select("id")
        .single();
      if (sErr) {
        return NextResponse.json({ error: "STORE_CREATE_FAILED", message: sErr.message }, { status: 500 });
      }
      store = created;
    }

    let category_id: string | null = null;
    if (categoryKey) {
      const { data: cat } = await admin
        .from("categories")
        .select("id")
        .eq("slug", categoryKey)
        .maybeSingle();
      category_id = cat?.id ?? null;
    }

    // Le produit attend la validation de l'admin avant d'apparaître dans le catalogue.
    const { data: prod, error } = await admin
      .from("products")
      .insert({
        store_id: store.id,
        title,
        price: Math.round(price),
        description,
        category_id,
        status: "PENDING",
      })
      .select(PRODUCT_SELECT)
      .single();
    if (error) {
      return NextResponse.json({ error: "PRODUCT_CREATE_FAILED", message: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, product: toApiProduct(prod) });
  } catch (e) {
    return serverError(e);
  }
}
