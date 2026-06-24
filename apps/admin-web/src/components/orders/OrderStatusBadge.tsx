import { ORDER_STATUS_LABELS, type OrderStatus } from "@/shared";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONE: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  preparing: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  out_for_delivery: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  delivered: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", TONE[status])}>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
