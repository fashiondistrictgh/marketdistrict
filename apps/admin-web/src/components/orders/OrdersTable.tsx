"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Order } from "@/shared";

import { ADMIN_ROUTES } from "@/constants/routes";
import { formatCurrency, formatDate } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow
              key={o.id}
              onClick={() => router.push(ADMIN_ROUTES.orderDetail(o.id))}
              className="cursor-pointer"
            >
              <TableCell className="font-medium text-primary">{o.orderNumber}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(o.createdAt)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={o.status} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(o.total)}
              </TableCell>
              <TableCell>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
