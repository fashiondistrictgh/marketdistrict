"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ADMIN_ROUTES } from "@/constants/routes";
import { useOrder } from "@/hooks/useOrders";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrderItemsTable } from "@/components/orders/OrderItemsTable";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { UpdateOrderStatus } from "@/components/orders/UpdateOrderStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Sample orders use placeholder ids and can't be persisted.
const SAMPLE_IDS = new Set([
  "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  "cccccccc-cccc-cccc-cccc-cccccccccccc",
]);

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  return (
    <div>
      <Link
        href={ADMIN_ROUTES.orders}
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : !order ? (
        <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">
          Order not found.
        </div>
      ) : (
        <>
          <PageHeader
            title={order.orderNumber}
            description={`Placed ${formatDateTime(order.createdAt)}`}
            actions={<OrderStatusBadge status={order.status} />}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <OrderItemsTable items={order.items} />
                  <div className="space-y-1.5 border-t p-5 text-sm">
                    <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
                    <Row label="Delivery fee" value={formatCurrency(order.deliveryFee)} />
                    {order.discount > 0 ? (
                      <Row label="Discount" value={`− ${formatCurrency(order.discount)}`} />
                    ) : null}
                    <div className="flex justify-between border-t pt-2 text-base font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Update status</CardTitle>
                </CardHeader>
                <CardContent>
                  <UpdateOrderStatus
                    orderId={order.id}
                    status={order.status}
                    disabled={SAMPLE_IDS.has(order.id)}
                  />
                </CardContent>
              </Card>

              {order.deliveryNotes ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery notes</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    {order.deliveryNotes}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
