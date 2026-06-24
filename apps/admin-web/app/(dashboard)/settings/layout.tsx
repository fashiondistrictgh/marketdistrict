"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_ROUTES } from "@/constants/routes";
import { PageHeader } from "@/components/layout/PageHeader";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Profile", href: ADMIN_ROUTES.settingsProfile },
  { label: "Store", href: ADMIN_ROUTES.settingsStore },
  { label: "Payments", href: ADMIN_ROUTES.settingsPayments },
  { label: "Notifications", href: ADMIN_ROUTES.settingsNotifications },
  { label: "Users", href: ADMIN_ROUTES.settingsUsers },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <PageHeader title="Settings" description="Configure your store and account." />

      <div className="mb-6 flex flex-wrap gap-1.5 border-b">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
