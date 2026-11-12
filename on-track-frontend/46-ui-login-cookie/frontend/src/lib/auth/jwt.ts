export interface JwtClaims {
  sub?: string;
  tid?: string;
  role?: string;
  exp?: number;
}

/**
 * Hanya membaca isi JWT; tanda tangan tetap diverifikasi oleh API Go.
 * Jangan memakai hasilnya sebagai dasar keamanan di sisi data.
 */
export function decodeJwt(token: string): JwtClaims | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return typeof claims === "object" && claims !== null ? (claims as JwtClaims) : null;
  } catch {
    return null;
  }
}
