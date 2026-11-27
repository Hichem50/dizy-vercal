import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema } from "@/lib/validation";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    const body = await req.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      const m = error?.message ?? "LOGIN_FAILED";
      const code = /confirm/i.test(m) ? "EMAIL_NOT_CONFIRMED" : "INVALID_CREDENTIALS";
      return NextResponse.json({ error: code, message: m }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: prof } = await admin.from("users").select("role").eq("id", data.user.id).maybeSingle();

    return NextResponse.json({ ok: true, role: prof?.role ?? "BUYER" });
  } catch (e) {
    return serverError(e);
  }
}
