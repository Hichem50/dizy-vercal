import { NextResponse } from "next/server";
import { missingEnv } from "@/lib/server/http";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Diagnostic : ouvrez /api/health dans le navigateur pour voir ce qui va / ne va pas.
export async function GET() {
  const miss = missingEnv();
  const out: any = {
    ok: false,
    env: { configured: miss.length === 0, missing: miss },
    db: { ok: false, note: "non testé (variables manquantes)" },
    ts: Date.now(),
  };

  if (miss.length === 0) {
    try {
      const admin = createAdminClient();
      // Teste la connexion + l'accès à la table users (schéma + droits).
      const { error } = await admin.from("users").select("id").limit(1);
      out.db = error
        ? { ok: false, error: error.message, hint: "Exécutez supabase/schema.sql et les GRANT sur CE projet Supabase." }
        : { ok: true };
    } catch (e) {
      out.db = { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }

  out.ok = miss.length === 0 && out.db.ok === true;
  return NextResponse.json(out);
}
