"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";

import { ADMIN_ROUTES } from "@/constants/routes";
import { useCustomer } from "@/hooks/useCustomers";
import { formatCurrency, formatDate, initials } from "@/lib/formatters";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading } = useCustomer(id);
  const customer = data?.customer;
  const orders = data?.orders ?? [];
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <Link
        href={ADMIN_ROUTES.customers}
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      ) : !customer ? (
        <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
          Customer not found.
        </div>
      ) : (
        <>
          <PageHeader title={customer.fullName ?? "Customer"} description="Customer profile and order history." />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-semibold text-primary">
                      {initials(customer.fullName ?? customer.email ?? "?")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{customer.fullName ?? "Unnamed"}</p>
                      <p className="text-xs text-muted-foreground">
                        Joined {formatDate(customer.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" /> {customer.email ?? "—"}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" /> {customer.phone ?? "—"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Total spent</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order history</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {orders.length === 0 ? (
                    <p className="p-8 text-center text-sm text-muted-foreground">
                      No orders yet.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-medium">
                              <Link
                                href={ADMIN_ROUTES.orderDetail(o.id)}
                                className="hover:underline"
                              >
                                {o.orderNumber}
                              </Link>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(o.createdAt)}
                            </TableCell>
                            <TableCell>
                              <OrderStatusBadge status={o.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(o.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
