import { PAYMENT_STATUS_LABELS, type PaymentStatus } from "@/shared";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONE: Record<PaymentStatus, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  paid: "bg-green-100 text-green-800 hover:bg-green-100",
  failed: "bg-red-100 text-red-700 hover:bg-red-100",
  refunded: "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", TONE[status])}>
      {PAYMENT_STATUS_LABELS[status]}
    </Badge>
  );
}
