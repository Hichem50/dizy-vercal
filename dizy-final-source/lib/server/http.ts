import { NextResponse } from "next/server";

// Variables d'environnement requises côté serveur.
const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export function missingEnv(): string[] {
  return REQUIRED.filter((k) => !process.env[k]);
}

// Renvoie une réponse 503 claire si des variables manquent, sinon null.
export function envError() {
  const miss = missingEnv();
  if (miss.length === 0) return null;
  return NextResponse.json(
    {
      error: "SERVER_NOT_CONFIGURED",
      missing: miss,
      message: "Variables Supabase manquantes sur le serveur (Vercel) : " + miss.join(", "),
    },
    { status: 503 }
  );
}

// Toute erreur inattendue est renvoyée en JSON (jamais une page HTML qui ferait planter le client).
export function serverError(e: unknown) {
  const message = e instanceof Error ? e.message : String(e);
  return NextResponse.json({ error: "SERVER_ERROR", message }, { status: 500 });
}
