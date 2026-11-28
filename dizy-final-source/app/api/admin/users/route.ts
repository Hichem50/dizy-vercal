import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/server/admin-auth";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

// GET /api/admin/users → liste des utilisateurs inscrits.
export async function GET() {
  const e = envError();
  if (e) return e;
  try {
    if (!isAdmin()) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    const db = createAdminClient();
    const { data, error } = await db
      .from("users")
      .select("id,email,full_name,role,created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    const users = (data ?? []).map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name,
      role: u.role,
      createdAt: u.created_at,
    }));
    return NextResponse.json({ users });
  } catch (err) {
    return serverError(err);
  }
}
