import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type Profile = {
  id: string;
  email: string;
  fullName: string | null;
  role: "BUYER" | "SELLER" | "ADMIN";
};

// Récupère l'utilisateur connecté + son rôle depuis la base (jamais depuis le navigateur).
export async function getCurrentUser(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!data) {
    return { id: user.id, email: user.email ?? "", fullName: null, role: "BUYER" };
  }
  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
  };
}

export async function requireRole(roles: Array<Profile["role"]>) {
  const user = await getCurrentUser();
  if (!user || !roles.includes(user.role)) throw new Error("UNAUTHORIZED");
  return user;
}
