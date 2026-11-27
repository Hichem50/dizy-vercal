import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? "LOGIN_FAILED" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: prof } = await admin.from("users").select("role").eq("id", data.user.id).single();

  return NextResponse.json({ ok: true, role: prof?.role ?? "BUYER" });
}
