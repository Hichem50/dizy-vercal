import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/server/admin-auth";
import { toApiProduct, PRODUCT_SELECT } from "@/lib/server/products";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

// GET /api/admin/products → produits en attente de validation.
export async function GET() {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    if (!isAdmin()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const db = createAdminClient();
    const { data, error } = await db
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products: (data ?? []).map(toApiProduct) });
  } catch (e) {
    return serverError(e);
  }
}

// POST /api/admin/products → { id, action: "approve" | "reject" }
export async function POST(req: Request) {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    if (!isAdmin()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const body = await req.json().catch(() => null);
    const id = String(body?.id ?? "");
    const action = String(body?.action ?? "");
    if (!id || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }
    const db = createAdminClient();
    const status = action === "approve" ? "APPROVED" : "REJECTED";
    const { error } = await db
      .from("products")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    return serverError(e);
  }
}
