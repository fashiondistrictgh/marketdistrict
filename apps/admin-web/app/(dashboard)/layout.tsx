import { DashboardShell } from "@/components/layout/DashboardShell";
import { InactivityProvider } from "@/components/auth/InactivityProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InactivityProvider>
      <DashboardShell>{children}</DashboardShell>
    </InactivityProvider>
  );
}
