import { decodeJwt } from "./jwt";
import type { JwtClaims } from "./jwt";

/**
 * ASUMSI: nilai role dan rute area belum tertulis di dokumen. "owner" dan "hrd"
 * berasal dari x-rbac di SAD; sisanya menurunkan nama peran di SRS.
 */
const HOME_BY_ROLE: Record<string, string> = {
  super_admin: "/super-admin",
  owner: "/dashboard",
  hrd: "/dashboard",
  team_lead: "/dashboard",
  karyawan: "/karyawan",
  kasir: "/kasir",
};

const ROLES_BY_AREA: Record<string, string[]> = {
  "/dashboard": ["owner", "hrd", "team_lead"],
  "/payroll": ["owner", "hrd"],
  "/super-admin": ["super_admin"],
  "/karyawan": ["karyawan"],
  "/kasir": ["kasir"],
};

export const LOGIN_PATH = "/login";

const PUBLIC_PATHS = [LOGIN_PATH, "/lupa-kata-sandi", "/atur-ulang-kata-sandi"];

function matches(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((path) => matches(pathname, path));
}

/** Mengembalikan klaim hanya bila token terbaca dan belum kedaluwarsa. */
export function readSession(token: string | undefined, nowSeconds: number): JwtClaims | null {
  if (!token) return null;
  const claims = decodeJwt(token);
  if (!claims?.role) return null;
  if (claims.exp !== undefined && claims.exp <= nowSeconds) return null;
  return claims;
}

export function homeForRole(role: string | undefined): string | null {
  return (role && HOME_BY_ROLE[role.toLowerCase()]) || null;
}

export function canAccess(pathname: string, role: string | undefined) {
  const area = Object.keys(ROLES_BY_AREA).find((base) => matches(pathname, base));
  if (!area) return true;
  return Boolean(role) && ROLES_BY_AREA[area].includes((role as string).toLowerCase());
}
