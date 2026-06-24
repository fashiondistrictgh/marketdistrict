"use client";

import { useQuery } from "@tanstack/react-query";

import type { ChartPoint } from "@/types/admin";

interface AnalyticsData {
  sales: ChartPoint[];
  ordersByCategory: ChartPoint[];
  customerGrowth: ChartPoint[];
}

/**
 * Loads aggregated analytics. Replace the placeholder with calls to
 * Supabase RPC/views once the reporting queries exist.
 */
export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async (): Promise<AnalyticsData> => {
      return { sales: [], ordersByCategory: [], customerGrowth: [] };
    },
  });
}
