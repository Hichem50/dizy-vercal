import { redirect } from "next/navigation";
import { LangProvider } from "@/components/LangProvider";
import { getCurrentUser } from "@/lib/auth/session";

// Garde serveur : l'espace vendeur n'est accessible qu'à un vendeur connecté.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch {
    user = null;
  }
  if (!user) redirect("/login");
  if (user.role !== "SELLER" && user.role !== "ADMIN") redirect("/");
  return <LangProvider>{children}</LangProvider>;
}
