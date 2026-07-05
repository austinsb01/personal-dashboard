// Access gate (Next.js Proxy): every app route requires a valid signed session
// cookie. Requests without one are redirected to /login; valid sessions get a
// sliding refresh. The pathname is forwarded to the root layout so /login can
// render without the dashboard shell. Next internals and public PWA/static
// assets are excluded.

import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "@/features/auth/constants";
import {
  createSessionToken,
  verifySessionToken,
} from "@/features/auth/session";

const REFRESH_THRESHOLD_MS = (SESSION_MAX_AGE / 2) * 1000;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  const pass = () => NextResponse.next({ request: { headers: requestHeaders } });

  if (pathname === "/login") return pass();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const now = Date.now();

  if (!token || !(await verifySessionToken(token, env.AUTH_SECRET, now))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const response = pass();
  const expiresAtMs = Number(token.split(".")[0]);
  if (expiresAtMs - now < REFRESH_THRESHOLD_MS) {
    const fresh = await createSessionToken(
      env.AUTH_SECRET,
      now + SESSION_MAX_AGE * 1000,
    );
    response.cookies.set(SESSION_COOKIE, fresh, cookieOptions);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/|favicon\\.ico|manifest\\.webmanifest|sw\\.js|swe-worker-|icon|apple-icon).*)",
  ],
};
