import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/api/backend";
import { SESSION_COOKIE } from "@/lib/auth/constants";

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (token) {
    // Cookie tetap dihapus walau API sedang tidak bisa dihubungi.
    await backendFetch("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }

  const result = NextResponse.json({ ok: true });
  result.cookies.delete(SESSION_COOKIE);
  return result;
}
