"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { NAV_ITEMS } from "@/constants/nav-items";
import { useSignOut } from "@/hooks/useSignOut";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, isSigningOut } = useSignOut();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-card md:flex md:flex-col">
      <div className="flex h-20 shrink-0 items-center justify-center border-b px-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-full.png"
          alt="Market District"
          className="h-16 w-auto max-w-full object-contain"
        />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t p-3">
        <button
          type="button"
          onClick={signOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {isSigningOut ? "Logging out…" : "Log out"}
        </button>
      </div>
    </aside>
  );
}
