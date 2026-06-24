"use client";


import { usePayments } from "@/hooks/usePayments";
import { PageHeader } from "@/components/layout/PageHeader";
import { PaymentStats } from "@/components/payments/PaymentStats";
import { PaymentsTable } from "@/components/payments/PaymentsTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsPage() {
  const { data, isLoading } = usePayments();
  const payments = data?.payments ?? [];

  return (
    <div>
      <PageHeader title="Payments" description="Review transactions and collections." />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <PaymentStats
          totalCollected={data!.stats.totalCollected}
          pending={data!.stats.pending}
          failed={data!.stats.failed}
        />
      )}

      <div className="mt-6">
        {isLoading ? (
          <Skeleton className="h-64 rounded-xl" />
        ) : payments.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <p className="font-medium">No payments yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Transactions appear here when customers pay for orders.
            </p>
          </div>
        ) : (
          <PaymentsTable payments={payments} />
        )}
      </div>
    </div>
  );
}
