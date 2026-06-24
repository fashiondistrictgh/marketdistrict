import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/shared";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Refreshes the Supabase session on every request and guards dashboard routes.
 * Wire this up from the app's root middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Validate the user with Supabase (authoritative — not just a local cookie
  // read). This guarantees a stale/forged/expired cookie cannot reach the
  // dashboard: access always requires a real, current session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic =
    pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

  // Not signed in + private route -> bounce to login.
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = ""; // drop any stale query (e.g. ?reason=inactivity)
    return NextResponse.redirect(url);
  }

  // Already signed in + on the login page -> send to dashboard.
  if (user && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Prevent the browser from caching authenticated pages, so the back button
  // after logout can't reveal stale dashboard content.
  if (user && !isPublic) {
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  }

  return response;
}
