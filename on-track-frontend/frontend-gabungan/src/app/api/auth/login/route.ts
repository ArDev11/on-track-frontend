import { NextResponse } from "next/server";
import {
  backendFetch,
  forwardError,
  problemResponse,
  serviceUnavailable,
} from "@/lib/api/backend";
import type { LoginResponse } from "@/lib/api/schema";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { decodeJwt } from "@/lib/auth/jwt";

interface LoginBody {
  email?: unknown;
  password?: unknown;
  remember?: unknown;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;
  if (typeof body?.email !== "string" || typeof body.password !== "string") {
    return problemResponse(400, "Data tidak valid", "Email dan kata sandi wajib diisi.");
  }

  let response: Response;
  try {
    response = await backendFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
  } catch {
    return serviceUnavailable();
  }

  if (!response.ok) return forwardError(response);

  const data = (await response.json().catch(() => null)) as LoginResponse | null;
  if (!data?.access_token) {
    return problemResponse(502, "Balasan server tidak valid");
  }

  // "Ingat saya" hanya menjaga cookie saat peramban ditutup, tidak memperpanjang masa JWT.
  const exp = decodeJwt(data.access_token)?.exp;
  const maxAge =
    body.remember === true && exp ? Math.max(exp - Math.floor(Date.now() / 1000), 0) : undefined;

  const result = NextResponse.json({ ok: true });
  result.cookies.set(SESSION_COOKIE, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return result;
}
