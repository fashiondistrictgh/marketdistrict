import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge-safe auth gate.
 *
 * We intentionally do NOT import @supabase/ssr / @supabase/supabase-js here —
 * those use Node APIs (process.version) that crash Vercel's Edge runtime
 * (MIDDLEWARE_INVOCATION_FAILED). Instead we just check for the presence of a
 * Supabase auth cookie to decide redirects. Real token validation happens in
 * Server Components / route handlers via the server client.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

  // Supabase stores the session in cookies named like "sb-<ref>-auth-token"
  // (often chunked: ...auth-token.0, .1). Presence ⇒ a session likely exists.
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"));

  // Not signed in + private route -> login
  if (!hasSession && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Signed in + on login -> dashboard
  if (hasSession && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
