import type { OrderItem } from "@/shared";

import { formatCurrency } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrderItemsTable({ items }: { items: OrderItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-center">Qty</TableHead>
          <TableHead className="text-right">Unit price</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((it) => (
          <TableRow key={it.id}>
            <TableCell className="font-medium">{it.productName}</TableCell>
            <TableCell className="text-center">{it.quantity}</TableCell>
            <TableCell className="text-right">{formatCurrency(it.unitPrice)}</TableCell>
            <TableCell className="text-right">{formatCurrency(it.lineTotal)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
