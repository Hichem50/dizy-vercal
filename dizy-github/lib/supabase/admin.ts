import { createClient as createAdminBase } from "@supabase/supabase-js";

// ⚠️ SERVEUR UNIQUEMENT. Contourne RLS. Ne jamais importer côté client.
// N'utiliser que dans des Route Handlers / Server Actions après vérification du rôle.
export function createAdminClient() {
  return createAdminBase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
