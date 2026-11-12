import { NextResponse } from "next/server";
import { backendFetch, forwardError, problemResponse, serviceUnavailable } from "@/lib/api/backend";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: unknown } | null;
  if (typeof body?.email !== "string") {
    return problemResponse(400, "Data tidak valid", "Email wajib diisi.");
  }

  try {
    const response = await backendFetch("/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email: body.email }),
    });
    if (!response.ok) return forwardError(response);
  } catch {
    return serviceUnavailable();
  }

  return new NextResponse(null, { status: 202 });
}
