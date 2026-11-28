import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/session";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

// GET /api/download/[token] → renvoie le lien du fichier, uniquement à l'acheteur
// qui possède un jeton valide (commande payée, non expiré).
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  const e = envError();
  if (e) return e;
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const admin = createAdminClient();
    const { data: dt } = await admin
      .from("download_tokens")
      .select("id,order_item_id,buyer_id,expires_at,used_count")
      .eq("token", params.token)
      .maybeSingle();
    if (!dt) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 404 });
    if (dt.buyer_id !== user.id) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    if (new Date(dt.expires_at).getTime() < Date.now()) return NextResponse.json({ error: "EXPIRED" }, { status: 410 });

    const { data: item } = await admin.from("order_items").select("product_id").eq("id", dt.order_item_id).maybeSingle();
    if (!item) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
    const { data: product } = await admin.from("products").select("title,file_path").eq("id", item.product_id).maybeSingle();
    if (!product || !product.file_path) return NextResponse.json({ error: "FILE_NOT_AVAILABLE" }, { status: 404 });

    await admin
      .from("download_tokens")
      .update({ used_count: (dt.used_count ?? 0) + 1 })
      .eq("id", dt.id);

    return NextResponse.json({ ok: true, url: product.file_path, title: product.title });
  } catch (err) {
    return serverError(err);
  }
}
