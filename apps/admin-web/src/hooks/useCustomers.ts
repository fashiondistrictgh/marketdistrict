"use client";

import { useQuery } from "@tanstack/react-query";
import type { Customer, Order, OrderRow, OrderItemRow, ProfileRow } from "@/shared";

import { createClient } from "@/lib/supabase/client";
import { mapCustomer, mapOrder } from "@/lib/mappers";
import { SAMPLE_CUSTOMERS, SAMPLE_ORDERS } from "@/constants/sample-data";

export interface CustomersResult {
  customers: Customer[];
  isSample: boolean;
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async (): Promise<CustomersResult> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "customer")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return { customers: SAMPLE_CUSTOMERS, isSample: true };
      }
      return { customers: (data as ProfileRow[]).map(mapCustomer), isSample: false };
    },
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["customer", id],
    enabled: !!id,
    queryFn: async (): Promise<{ customer: Customer | null; orders: Order[] }> => {
      const supabase = createClient();
      const [{ data: profile }, { data: orders }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id!).single(),
        supabase
          .from("orders")
          .select("*, items:order_items(*)")
          .eq("customer_id", id!)
          .order("created_at", { ascending: false }),
      ]);

      if (!profile) {
        const sample = SAMPLE_CUSTOMERS.find((c) => c.id === id) ?? null;
        return {
          customer: sample,
          orders: SAMPLE_ORDERS.filter((o) => o.customerId === id),
        };
      }

      return {
        customer: mapCustomer(profile as ProfileRow),
        orders: ((orders ?? []) as (OrderRow & { items: OrderItemRow[] })[]).map(mapOrder),
      };
    },
  });
}
