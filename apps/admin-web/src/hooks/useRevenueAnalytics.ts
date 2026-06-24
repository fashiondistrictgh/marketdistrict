"use client";

import { useQuery } from "@tanstack/react-query";
import type { OrderItemRow, OrderRow } from "@/shared";

import { createClient } from "@/lib/supabase/client";

export interface RevenuePoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  paidRevenue: number;
  series: RevenuePoint[];
  topProducts: { name: string; revenue: number; qty: number }[];
  isSample: boolean;
}

const SAMPLE: RevenueAnalytics = {
  totalRevenue: 48250,
  totalOrders: 318,
  avgOrderValue: 152,
  paidRevenue: 41100,
  series: monthsSeries([3200, 4100, 3800, 5200, 6100, 5400, 7300, 6800, 7900, 8200, 9100, 10250]),
  topProducts: [
    { name: "Fresh Bananas", revenue: 9600, qty: 80 },
    { name: "Crate of Eggs", revenue: 8000, qty: 25 },
    { name: "Whole Milk 1L", revenue: 7200, qty: 40 },
    { name: "Brown Bread Loaf", revenue: 4500, qty: 30 },
    { name: "Orange Juice 1L", revenue: 4400, qty: 20 },
  ],
  isSample: true,
};

function monthsSeries(values: number[]): RevenuePoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return values.map((revenue, i) => ({ label: months[i], revenue, orders: Math.round(revenue / 150) }));
}

export function useRevenueAnalytics() {
  return useQuery({
    queryKey: ["revenue-analytics"],
    queryFn: async (): Promise<RevenueAnalytics> => {
      const supabase = createClient();
      const [{ data: orders }, { data: items }] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("order_items").select("*"),
      ]);

      const orderRows = (orders ?? []) as OrderRow[];
      if (orderRows.length === 0) return SAMPLE;

      const totalRevenue = orderRows.reduce((s, o) => s + Number(o.total), 0);
      const totalOrders = orderRows.length;
      const avgOrderValue = totalRevenue / totalOrders;
      const paidRevenue = orderRows
        .filter((o) => o.status !== "cancelled" && o.status !== "pending")
        .reduce((s, o) => s + Number(o.total), 0);

      // Revenue by month
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const byMonth = new Map<string, { revenue: number; orders: number }>();
      for (const o of orderRows) {
        const key = months[new Date(o.created_at).getMonth()];
        const cur = byMonth.get(key) ?? { revenue: 0, orders: 0 };
        cur.revenue += Number(o.total);
        cur.orders += 1;
        byMonth.set(key, cur);
      }
      const series = months.map((label) => ({
        label,
        revenue: byMonth.get(label)?.revenue ?? 0,
        orders: byMonth.get(label)?.orders ?? 0,
      }));

      // Top products by revenue from order_items
      const itemRows = (items ?? []) as OrderItemRow[];
      const byProduct = new Map<string, { revenue: number; qty: number }>();
      for (const it of itemRows) {
        const cur = byProduct.get(it.product_name) ?? { revenue: 0, qty: 0 };
        cur.revenue += Number(it.line_total);
        cur.qty += it.quantity;
        byProduct.set(it.product_name, cur);
      }
      const topProducts = [...byProduct.entries()]
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6);

      return {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        paidRevenue,
        series,
        topProducts,
        isSample: false,
      };
    },
  });
}
