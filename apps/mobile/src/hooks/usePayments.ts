import { useMutation } from "@tanstack/react-query";
import type { PaymentVerification, VerifyPaymentInput } from "@/shared";

import { supabase } from "@/lib/supabase";

/** Calls the verify-payment edge function after a provider redirect. */
export function useVerifyPayment() {
  return useMutation({
    mutationFn: async (input: VerifyPaymentInput): Promise<PaymentVerification> => {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: input,
      });
      if (error) throw error;
      return data as PaymentVerification;
    },
  });
}
