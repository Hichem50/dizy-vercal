import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { envError, serverError } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  const envErr = envError();
  if (envErr) return envErr;
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user: user ?? null });
  } catch (e) {
    return serverError(e);
  }
}
