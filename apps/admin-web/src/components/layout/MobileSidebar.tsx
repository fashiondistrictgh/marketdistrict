"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";

import { NAV_ITEMS } from "@/constants/nav-items";
import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/utils";

/** Slide-over navigation shown on small screens (paired with AdminTopbar). */
export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut, isSigningOut } = useSignOut();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="rounded-md p-2 hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <nav className="relative flex w-64 flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-full.png" alt="Market District" className="h-8 w-auto object-contain" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto p-3">
              {NAV_ITEMS.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t p-3">
              <button
                type="button"
                onClick={signOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isSigningOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
