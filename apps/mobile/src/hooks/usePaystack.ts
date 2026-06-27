import { useState } from "react";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "@/lib/supabase";

export interface PaystackResult {
  status: "paid" | "failed" | "cancelled";
  reference: string | null;
}

const RETURN_URL = "marketdistrict://payment-callback";

/**
 * Drives a Paystack card / mobile-money payment:
 * 1. initialize-payment edge fn (server holds secret) -> authorization_url + reference
 * 2. open Paystack checkout; openAuthSessionAsync auto-closes the browser the
 *    moment Paystack redirects to our return URL (works in Expo Go AND standalone)
 * 3. verify-payment edge fn confirms the final status
 */
export function usePaystack() {
  const [isPaying, setIsPaying] = useState(false);

  async function pay({
    orderId,
    email,
    amount,
  }: {
    orderId: string;
    email: string;
    amount: number;
  }): Promise<PaystackResult> {
    setIsPaying(true);
    try {
      const { data: init, error: initErr } = await supabase.functions.invoke(
        "initialize-payment",
        { body: { orderId, email, amount } },
      );
      if (initErr || !init?.authorizationUrl || !init?.reference) {
        throw new Error(init?.error ?? "Could not start payment.");
      }

      // Auto-closes when Paystack redirects to RETURN_URL.
      const result = await WebBrowser.openAuthSessionAsync(init.authorizationUrl, RETURN_URL);

      // User backed out without finishing.
      if (result.type === "cancel") {
        return { status: "cancelled", reference: init.reference };
      }

      // Verify with the server (authoritative).
      const { data: verify } = await supabase.functions.invoke("verify-payment", {
        body: { reference: init.reference, provider: "paystack" },
      });

      return {
        status: verify?.status === "paid" ? "paid" : "failed",
        reference: init.reference,
      };
    } finally {
      setIsPaying(false);
    }
  }

  return { pay, isPaying };
}
