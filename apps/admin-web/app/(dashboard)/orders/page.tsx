"use client";

import { useMemo, useState } from "react";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/shared";

import { useOrders } from "@/hooks/useOrders";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Filter = "all" | OrderStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: ORDER_STATUS_LABELS.pending },
  { value: "confirmed", label: ORDER_STATUS_LABELS.confirmed },
  { value: "preparing", label: ORDER_STATUS_LABELS.preparing },
  { value: "out_for_delivery", label: ORDER_STATUS_LABELS.out_for_delivery },
  { value: "delivered", label: ORDER_STATUS_LABELS.delivered },
  { value: "cancelled", label: ORDER_STATUS_LABELS.cancelled },
];

export default function OrdersPage() {
  const { data, isLoading } = useOrders();
  const [filter, setFilter] = useState<Filter>("all");

  const orders = data?.orders ?? [];

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  return (
    <div>
      <PageHeader title="Orders" description="Manage and track customer orders." />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const count =
            f.value === "all"
              ? orders.length
              : orders.filter((o) => o.status === f.value).length;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                filter === f.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {f.label} {count > 0 ? <span className="opacity-60">({count})</span> : null}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-2 rounded-xl border bg-card p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="font-medium">No orders</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === "all" ? "No orders yet." : `No ${ORDER_STATUS_LABELS[filter as OrderStatus].toLowerCase()} orders.`}
          </p>
        </div>
      ) : (
        <OrdersTable orders={filtered} />
      )}
    </div>
  );
}
