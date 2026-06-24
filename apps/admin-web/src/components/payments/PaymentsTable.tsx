"use client";

import type { Payment } from "@/shared";

import { formatCurrency, formatDateTime } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

const METHOD_LABEL: Record<string, string> = {
  card: "Card",
  transfer: "Transfer",
  cash_on_delivery: "Cash on delivery",
};

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.reference ?? "—"}</TableCell>
              <TableCell className="text-sm">{METHOD_LABEL[p.method] ?? p.method}</TableCell>
              <TableCell className="text-sm capitalize text-muted-foreground">
                {p.provider ?? "—"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(p.createdAt)}
              </TableCell>
              <TableCell>
                <PaymentStatusBadge status={p.status} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(p.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
