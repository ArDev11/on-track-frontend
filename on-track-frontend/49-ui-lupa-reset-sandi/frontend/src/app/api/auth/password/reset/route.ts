import { NextResponse } from "next/server";
import { backendFetch, forwardError, problemResponse, serviceUnavailable } from "@/lib/api/backend";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { token?: unknown; new_password?: unknown }
    | null;
  if (typeof body?.token !== "string" || typeof body.new_password !== "string") {
    return problemResponse(400, "Data tidak valid", "Token dan kata sandi baru wajib diisi.");
  }

  try {
    const response = await backendFetch("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ token: body.token, new_password: body.new_password }),
    });
    if (!response.ok) return forwardError(response);
  } catch {
    return serviceUnavailable();
  }

  return new NextResponse(null, { status: 204 });
}
