import { PRODUCT_STATUS_LABELS, type ProductStatus } from "@/shared";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONE: Record<ProductStatus, string> = {
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  draft: "bg-gray-100 text-gray-700 hover:bg-gray-100",
  out_of_stock: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  archived: "bg-red-100 text-red-700 hover:bg-red-100",
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant="secondary" className={cn("font-medium", TONE[status])}>
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}
