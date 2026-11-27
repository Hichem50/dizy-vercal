import { NextResponse } from "next/server";
import { checkAdminPassword, adminToken, isAdminConfigured, ADMIN_COOKIE } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

// POST { password } → pose le cookie de session admin si le mot de passe est correct.
export async function POST(req: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "ADMIN_NOT_CONFIGURED" }, { status: 500 });
  }
  const body = await req.json().catch(() => null);
  const password = String(body?.password ?? "");
  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "BAD_PASSWORD" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, adminToken(password), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}

// DELETE → déconnexion admin.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
