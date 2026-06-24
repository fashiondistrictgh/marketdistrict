import { PageHeader } from "@/components/layout/PageHeader";

export default function Page() {
  return (
    <div>
      <PageHeader title="Reset password" description="Request a password reset link." />
      <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
        Reset password content goes here.
      </div>
    </div>
  );
}
