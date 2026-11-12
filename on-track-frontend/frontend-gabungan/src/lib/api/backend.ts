import { NextResponse } from "next/server";
import type { ProblemDetails } from "./schema";

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8080";

/** Dipanggil hanya dari Route Handler agar alamat API tidak terbuka ke peramban. */
export function backendFetch(path: string, init: RequestInit): Promise<Response> {
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...init.headers },
  });
}

export function problemResponse(status: number, title: string, detail?: string) {
  const body: ProblemDetails = { title, status, detail };
  return NextResponse.json(body, {
    status,
    headers: { "Content-Type": "application/problem+json" },
  });
}

export function serviceUnavailable() {
  return problemResponse(503, "Layanan belum tersedia", "Coba lagi beberapa saat.");
}

/** Meneruskan balasan error API apa adanya, termasuk header Retry-After. */
export async function forwardError(response: Response) {
  const headers = new Headers({
    "Content-Type": response.headers.get("Content-Type") ?? "application/problem+json",
  });
  const retryAfter = response.headers.get("Retry-After");
  if (retryAfter) headers.set("Retry-After", retryAfter);
  return new NextResponse(await response.text(), { status: response.status, headers });
}
