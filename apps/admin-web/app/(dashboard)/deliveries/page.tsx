import { PageHeader } from "@/components/layout/PageHeader";
import { ComingSoon } from "@/components/layout/ComingSoon";

export default function DeliveriesPage() {
  return (
    <div>
      <PageHeader title="Deliveries" description="Assign riders and track deliveries." />
      <ComingSoon feature="Deliveries" />
    </div>
  );
}
