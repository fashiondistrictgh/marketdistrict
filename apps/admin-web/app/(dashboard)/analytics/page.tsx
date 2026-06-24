"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useRevenueAnalytics } from "@/hooks/useRevenueAnalytics";
import { formatCurrency } from "@/lib/formatters";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const revenueConfig = {
  revenue: { label: "Revenue", color: "hsl(120 100% 20%)" },
} satisfies ChartConfig;

const productConfig = {
  revenue: { label: "Revenue", color: "hsl(120 100% 20%)" },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const { data, isLoading } = useRevenueAnalytics();

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader title="Revenue & Analytics" description="Sales performance and revenue insights." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-6 h-80 rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Revenue & Analytics"
        description="Sales performance and revenue insights."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total revenue" value={formatCurrency(data.totalRevenue)} delta={14} hint="all time" />
        <MetricCard label="Paid revenue" value={formatCurrency(data.paidRevenue)} delta={11} hint="confirmed+" />
        <MetricCard label="Total orders" value={String(data.totalOrders)} delta={8} />
        <MetricCard label="Avg. order value" value={formatCurrency(data.avgOrderValue)} delta={3} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Revenue over time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueConfig} className="h-72 w-full">
            <AreaChart data={data.series} margin={{ top: 5, right: 8, left: -4, bottom: 0 }}>
              <defs>
                <linearGradient id="revAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                tickFormatter={(v) => `₵${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(v) => formatCurrency(Number(v))} />}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                fill="url(#revAnalytics)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top products by revenue</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No sales yet.
            </p>
          ) : (
            <ChartContainer config={productConfig} className="h-72 w-full">
              <BarChart
                data={data.topProducts}
                layout="vertical"
                margin={{ top: 5, right: 16, left: 8, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `₵${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={120}
                  fontSize={12}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(v) => formatCurrency(Number(v))} />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} maxBarSize={28} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
