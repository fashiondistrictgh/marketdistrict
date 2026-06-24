"use client";

import { useQuery } from "@tanstack/react-query";
import { PAYMENT_STATUS, type Payment, type PaymentRow } from "@/shared";

import { createClient } from "@/lib/supabase/client";
import { mapPayment } from "@/lib/mappers";
import { SAMPLE_PAYMENTS } from "@/constants/sample-data";

export interface PaymentsResult {
  payments: Payment[];
  stats: {
    totalCollected: number;
    pending: number;
    failed: number;
    count: number;
  };
  isSample: boolean;
}

function computeStats(payments: Payment[]) {
  return {
    totalCollected: payments
      .filter((p) => p.status === PAYMENT_STATUS.PAID)
      .reduce((s, p) => s + p.amount, 0),
    pending: payments
      .filter((p) => p.status === PAYMENT_STATUS.PENDING || p.status === PAYMENT_STATUS.PROCESSING)
      .reduce((s, p) => s + p.amount, 0),
    failed: payments.filter((p) => p.status === PAYMENT_STATUS.FAILED).length,
    count: payments.length,
  };
}

export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async (): Promise<PaymentsResult> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return { payments: SAMPLE_PAYMENTS, stats: computeStats(SAMPLE_PAYMENTS), isSample: true };
      }
      const payments = (data as PaymentRow[]).map(mapPayment);
      return { payments, stats: computeStats(payments), isSample: false };
    },
  });
}
