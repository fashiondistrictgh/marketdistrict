"use client";

import Link from "next/link";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";

import { ADMIN_ROUTES } from "@/constants/routes";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSignOut } from "@/hooks/useSignOut";
import { initials } from "@/lib/formatters";
import { MobileSidebar } from "./MobileSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminTopbar() {
  const { signOut, isSigningOut } = useSignOut();
  const { email } = useAdminAuth();

  return (
    <header className="flex h-20 items-center justify-between gap-3 border-b bg-card px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <MobileSidebar />
        <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground">
          <Search className="h-4 w-4 shrink-0" />
          <input
            className="w-28 bg-transparent outline-none placeholder:text-muted-foreground sm:w-40 md:w-64"
            placeholder="Search…"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-md p-2 hover:bg-muted"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary outline-none ring-offset-2 transition hover:bg-primary/25 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {initials(email ?? "Admin")}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate font-normal">
              <span className="text-xs text-muted-foreground">Signed in as</span>
              <div className="truncate font-medium">{email ?? "Admin"}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={ADMIN_ROUTES.settingsProfile}>
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={ADMIN_ROUTES.settings}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={signOut}
              disabled={isSigningOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isSigningOut ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
