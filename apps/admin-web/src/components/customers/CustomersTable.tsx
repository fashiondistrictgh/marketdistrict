"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Customer } from "@/shared";

import { ADMIN_ROUTES } from "@/constants/routes";
import { formatDate, initials } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter();
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow
              key={c.id}
              onClick={() => router.push(ADMIN_ROUTES.customerDetail(c.id))}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {initials(c.fullName ?? c.email ?? "?")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.fullName ?? "Unnamed"}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.email ?? "—"}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{c.phone ?? "—"}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(c.createdAt)}
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
