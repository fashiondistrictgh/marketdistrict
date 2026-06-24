"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DeliveryStatus, Rider } from "@/shared";

import { createClient } from "@/lib/supabase/client";
import { SAMPLE_DELIVERIES, SAMPLE_RIDERS } from "@/constants/sample-data";

export interface DeliveryRow {
  id: string;
  orderId: string;
  orderNumber: string;
  riderId: string | null;
  riderName: string | null;
  status: DeliveryStatus;
  estimatedArrival: string | null;
  createdAt: string;
}

export interface DeliveriesResult {
  deliveries: DeliveryRow[];
  isSample: boolean;
}

const SAMPLE_ROWS: DeliveryRow[] = SAMPLE_DELIVERIES.map((d, i) => ({
  id: d.id,
  orderId: d.orderId,
  orderNumber: `MD-00000${SAMPLE_DELIVERIES.length - i}`,
  riderId: d.riderId ?? null,
  riderName: SAMPLE_RIDERS.find((r) => r.id === d.riderId)?.fullName ?? null,
  status: d.status,
  estimatedArrival: d.estimatedArrival ?? null,
  createdAt: d.createdAt,
}));

export function useDeliveries() {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: async (): Promise<DeliveriesResult> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deliveries")
        .select("*, order:orders(order_number), rider:profiles(full_name)")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return { deliveries: SAMPLE_ROWS, isSample: true };
      }

      const rows: DeliveryRow[] = (data as unknown[]).map((raw) => {
        const d = raw as {
          id: string;
          order_id: string;
          rider_id: string | null;
          status: DeliveryStatus;
          estimated_arrival: string | null;
          created_at: string;
          order?: { order_number: string } | null;
          rider?: { full_name: string | null } | null;
        };
        return {
          id: d.id,
          orderId: d.order_id,
          orderNumber: d.order?.order_number ?? "—",
          riderId: d.rider_id,
          riderName: d.rider?.full_name ?? null,
          status: d.status,
          estimatedArrival: d.estimated_arrival,
          createdAt: d.created_at,
        };
      });
      return { deliveries: rows, isSample: false };
    },
  });
}

export function useRiders() {
  return useQuery({
    queryKey: ["riders"],
    queryFn: async (): Promise<Rider[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone")
        .eq("role", "rider");
      if (error || !data || data.length === 0) return SAMPLE_RIDERS;
      return (data as { id: string; full_name: string | null; phone: string | null }[]).map(
        (r) => ({ id: r.id, fullName: r.full_name ?? "Rider", phone: r.phone, isAvailable: true }),
      );
    },
  });
}

export function useAssignRider() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ deliveryId, riderId }: { deliveryId: string; riderId: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("deliveries")
        .update({ rider_id: riderId, status: "assigned" } as never)
        .eq("id", deliveryId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["deliveries"] }),
  });
}
