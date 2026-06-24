"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

/** Auto sign-out after this many minutes with no user interaction. */
const TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click"];

/**
 * Signs the admin out after TIMEOUT_MS of inactivity and redirects to
 * /login?reason=inactivity. Activity on any tab is shared via localStorage so
 * multiple open tabs stay in sync.
 */
export function InactivityProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Don't run the timer on public auth pages (nothing to protect there).
  const active = !pathname.startsWith("/login") && !pathname.startsWith("/forgot-password");

  const logout = useCallback(async () => {
    await createClient().auth.signOut();
    router.replace("/login?reason=inactivity");
    router.refresh();
  }, [router]);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!active) return;
    // Share the last-activity timestamp across tabs.
    try {
      localStorage.setItem("md.lastActivity", String(Date.now()));
    } catch {
      /* ignore */
    }
    timer.current = setTimeout(logout, TIMEOUT_MS);
  }, [active, logout]);

  useEffect(() => {
    if (!active) {
      if (timer.current) clearTimeout(timer.current);
      return;
    }

    reset();
    const handler = () => reset();
    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, handler, { passive: true }));

    // If another tab logs out, or this tab returns after being hidden past the
    // timeout, enforce it here too.
    function onStorage(e: StorageEvent) {
      if (e.key === "md.lastActivity") reset();
    }
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      const last = Number(localStorage.getItem("md.lastActivity") ?? Date.now());
      if (Date.now() - last >= TIMEOUT_MS) logout();
      else reset();
    }
    window.addEventListener("storage", onStorage);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, handler));
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active, reset, logout]);

  return <>{children}</>;
}
