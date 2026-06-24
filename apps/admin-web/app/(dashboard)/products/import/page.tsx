import { PageHeader } from "@/components/layout/PageHeader";

export default function Page() {
  return (
    <div>
      <PageHeader title="Import products" description="Bulk import products from a file." />
      <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
        Import products content goes here.
      </div>
    </div>
  );
}
