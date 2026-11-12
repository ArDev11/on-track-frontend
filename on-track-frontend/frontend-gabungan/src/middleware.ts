import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LOGIN_PATH,
  canAccess,
  homeForRole,
  isPublicPath,
  readSession,
} from "@/lib/auth/access";
import { SESSION_COOKIE } from "@/lib/auth/constants";

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = readSession(token, Math.floor(Date.now() / 1000));
  const home = homeForRole(session?.role);

  if (isPublicPath(pathname)) {
    // Hanya halaman login yang mengalihkan; reset kata sandi tetap bisa dibuka saat masih masuk.
    if (pathname === LOGIN_PATH && home) return redirectTo(request, home);
    return NextResponse.next();
  }

  if (!session) {
    const response = redirectTo(request, LOGIN_PATH);
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (pathname === "/") return redirectTo(request, home ?? LOGIN_PATH);

  if (!canAccess(pathname, session.role)) return redirectTo(request, LOGIN_PATH);

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
