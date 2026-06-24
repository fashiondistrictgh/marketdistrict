"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/formatters";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Skeleton } from "@/components/ui/skeleton";
import type { MetricCardData } from "@/types/admin";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader title="Dashboard" description="An overview of store performance and recent activity." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  const metrics: MetricCardData[] = [
    { label: "Revenue (30d)", value: formatCurrency(data.revenue), delta: 12, hint: "vs last month" },
    { label: "Orders (30d)", value: String(data.orderCount), delta: 8, hint: "vs last month" },
    { label: "Customers", value: String(data.customerCount), delta: 5, hint: "total" },
    {
      label: "Avg. order value",
      value: formatCurrency(data.avgOrderValue),
      delta: 4,
      hint: "vs last month",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of store performance and recent activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <RevenueChart data={data.revenueByDay} />
        <OrdersChart data={data.ordersByDay} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={data.recentOrders} />
        </div>
        <RecentActivity
          productCount={data.productCount}
          customerCount={data.customerCount}
          categoryCount={data.categoryCount}
        />
      </div>
    </div>
  );
}
