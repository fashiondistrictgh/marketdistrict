"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderRow, ProductRow } from "@/shared";

import { createClient } from "@/lib/supabase/client";

export interface DashboardData {
  revenue: number;
  orderCount: number;
  customerCount: number;
  avgOrderValue: number;
  productCount: number;
  categoryCount: number;
  revenueByDay: { label: string; value: number }[];
  ordersByDay: { label: string; value: number }[];
  recentOrders: {
    id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }[];
  isSample: boolean;
}

const SAMPLE: DashboardData = {
  revenue: 12405,
  orderCount: 318,
  customerCount: 94,
  avgOrderValue: 39,
  productCount: 12,
  categoryCount: 12,
  revenueByDay: buildSampleSeries([320, 540, 410, 680, 720, 590, 860]),
  ordersByDay: buildSampleSeries([8, 12, 10, 16, 18, 14, 22]),
  recentOrders: [
    { id: "s1", orderNumber: "MD-000318", total: 6200, status: "pending", createdAt: "2026-06-14T10:30:00Z" },
    { id: "s2", orderNumber: "MD-000317", total: 4100, status: "confirmed", createdAt: "2026-06-14T09:10:00Z" },
    { id: "s3", orderNumber: "MD-000316", total: 8800, status: "delivered", createdAt: "2026-06-13T17:45:00Z" },
  ],
  isSample: true,
};

function buildSampleSeries(values: number[]) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return values.map((value, i) => ({ label: days[i], value }));
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const supabase = createClient();
      const [
        { data: orders },
        { count: productCount },
        { count: customerCount },
        { count: categoryCount },
      ] = await Promise.all([
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "customer"),
        supabase.from("categories").select("*", { count: "exact", head: true }),
      ]);

      const orderRows = (orders ?? []) as OrderRow[];
      if (orderRows.length === 0) {
        // No real orders yet — show sample so the dashboard isn't empty, but
        // reflect the real product/customer/category counts if we have them.
        return {
          ...SAMPLE,
          productCount: productCount ?? SAMPLE.productCount,
          customerCount: customerCount ?? SAMPLE.customerCount,
          categoryCount: categoryCount ?? SAMPLE.categoryCount,
        };
      }

      const revenue = orderRows.reduce((s, o) => s + Number(o.total), 0);
      const orderCount = orderRows.length;
      const avgOrderValue = orderCount ? revenue / orderCount : 0;

      return {
        revenue,
        orderCount,
        customerCount: customerCount ?? 0,
        avgOrderValue,
        productCount: productCount ?? 0,
        categoryCount: categoryCount ?? 0,
        revenueByDay: groupByDay(orderRows, (o) => Number(o.total)),
        ordersByDay: groupByDay(orderRows, () => 1),
        recentOrders: orderRows.slice(0, 6).map((o) => ({
          id: o.id,
          orderNumber: o.order_number,
          total: Number(o.total),
          status: o.status,
          createdAt: o.created_at,
        })),
        isSample: false,
      };
    },
  });
}

/** Buckets rows into the last 7 day-of-week labels, summing `pick`. */
function groupByDay<T extends { created_at: string }>(
  rows: T[],
  pick: (row: T) => number,
) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totals = new Map<string, number>();
  for (const row of rows) {
    const d = new Date(row.created_at);
    const key = days[d.getDay()];
    totals.set(key, (totals.get(key) ?? 0) + pick(row));
  }
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
    label,
    value: totals.get(label) ?? 0,
  }));
}
