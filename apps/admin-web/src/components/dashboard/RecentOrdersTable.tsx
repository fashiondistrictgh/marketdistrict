import { ORDER_STATUS_LABELS, type OrderStatus } from "@/shared";

import { formatCurrency, timeAgo } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
}

export function RecentOrdersTable({ orders }: { orders: RecentOrder[] }) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <p className="font-semibold">Recent orders</p>
      </div>
      {orders.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.orderNumber}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {ORDER_STATUS_LABELS[o.status as OrderStatus] ?? o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(o.total)}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {timeAgo(o.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
