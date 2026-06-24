"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Order, OrderRow, OrderItemRow, OrderStatus } from "@/shared";

import { createClient } from "@/lib/supabase/client";
import { mapOrder } from "@/lib/mappers";
import { SAMPLE_ORDERS } from "@/constants/sample-data";

export interface OrdersResult {
  orders: Order[];
  isSample: boolean;
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<OrdersResult> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return { orders: SAMPLE_ORDERS, isSample: true };
      }
      return {
        orders: (data as (OrderRow & { items: OrderItemRow[] })[]).map(mapOrder),
        isSample: false,
      };
    },
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async (): Promise<Order | null> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", id!)
        .single();
      if (error || !data) {
        return SAMPLE_ORDERS.find((o) => o.id === id) ?? null;
      }
      return mapOrder(data as OrderRow & { items: OrderItemRow[] });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["order"] });
    },
  });
}
