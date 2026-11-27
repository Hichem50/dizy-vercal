import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { registerSchema } from "@/lib/validation";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    const body = await req.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "INVALID_INPUT", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { fullName, email, password, phone, accountType } = parsed.data;

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      return NextResponse.json({ error: "SIGNUP_FAILED", message: error?.message ?? "" }, { status: 400 });
    }

    const role = accountType === "seller" ? "SELLER" : "BUYER";

    const admin = createAdminClient();
    const { error: dbErr } = await admin.from("users").upsert(
      {
        id: data.user.id,
        email,
        full_name: fullName,
        phone: phone || null,
        role,
        email_verified: Boolean(data.user.email_confirmed_at),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (dbErr) {
      return NextResponse.json(
        {
          error: "DB_WRITE_FAILED",
          message: dbErr.message + " — exécutez supabase/schema.sql (et les GRANT) sur CE projet Supabase.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, role, needsEmailConfirmation: !data.session });
  } catch (e) {
    return serverError(e);
  }
}
