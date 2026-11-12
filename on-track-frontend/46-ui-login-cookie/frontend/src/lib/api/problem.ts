import type { ProblemDetails } from "./schema";

/** Membaca error RFC 7807 di peramban; balasan non-JSON tetap menghasilkan objek yang aman. */
export async function readProblem(response: Response): Promise<ProblemDetails> {
  let problem: Partial<ProblemDetails> = {};
  try {
    problem = (await response.json()) as Partial<ProblemDetails>;
  } catch {
    // Biarkan kosong; nilai bawaan di bawah yang dipakai.
  }

  const header = Number(response.headers.get("Retry-After"));
  const retryAfter =
    problem.retry_after ?? (Number.isFinite(header) && header > 0 ? header : undefined);

  return {
    ...problem,
    title: problem.title ?? "Terjadi kesalahan",
    status: problem.status ?? response.status,
    retry_after: retryAfter,
  };
}
