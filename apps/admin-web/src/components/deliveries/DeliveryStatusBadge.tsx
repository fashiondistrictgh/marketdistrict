import { DELIVERY_STATUS_LABELS, type DeliveryStatus } from "@/shared";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONE: Record<DeliveryStatus, string> = {
  unassigned: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  assigned: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  picked_up: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  in_transit: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  failed: "bg-red-100 text-red-700 hover:bg-red-100",
};

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", TONE[status])}>
      {DELIVERY_STATUS_LABELS[status]}
    </Badge>
  );
}
