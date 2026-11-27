import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { toApiProduct, PRODUCT_SELECT } from "@/lib/server/products";

export const dynamic = "force-dynamic";

// GET /api/products/[id] → un produit APPROVED (page produit publique).
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", params.id)
    .eq("status", "APPROVED")
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ product: toApiProduct(data) });
}
