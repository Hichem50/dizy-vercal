import { NextResponse } from "next/server";
import { isAdmin, isAdminConfigured } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

// GET → état de la session admin (connecté ? mot de passe configuré ?).
export async function GET() {
  return NextResponse.json({ admin: isAdmin(), configured: isAdminConfigured() });
}
