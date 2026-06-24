import { useQuery } from "@tanstack/react-query";
import type { Order, OrderRow, OrderItemRow } from "@/shared";

import { supabase } from "@/lib/supabase";
import { mapOrder } from "@/lib/mappers";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as (OrderRow & { items: OrderItemRow[] })[]).map(mapOrder);
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async (): Promise<Order | null> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", id)
        .single();
      if (error || !data) return null;
      return mapOrder(data as OrderRow & { items: OrderItemRow[] });
    },
  });
}
