// Accès admin séparé : une page admin protégée par un mot de passe dédié
// (variable d'environnement ADMIN_PASSWORD), indépendant des comptes utilisateurs.
import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE = "dizy_admin";

export function adminToken(password: string): string {
  return crypto.createHash("sha256").update("dizy::" + password).digest("hex");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function checkAdminPassword(password: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  return Boolean(pw) && password === pw;
}

// Vérifie le cookie de session admin posé après connexion.
export function isAdmin(): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const expected = adminToken(pw);
  const tok = cookies().get(ADMIN_COOKIE)?.value;
  return Boolean(tok) && tok === expected;
}
