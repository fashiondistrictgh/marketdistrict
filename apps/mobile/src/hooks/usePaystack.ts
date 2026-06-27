import { useState } from "react";
import * as WebBrowser from "expo-web-browser";

import { supabase } from "@/lib/supabase";

export interface PaystackResult {
  status: "paid" | "failed" | "cancelled";
  reference: string | null;
}

/**
 * Drives a Paystack card/mobile-money payment:
 * 1. initialize-payment edge fn (server holds secret) -> authorization_url + reference
 * 2. open the Paystack checkout in an in-app browser
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
      // 1. Initialize on the server.
      const { data: init, error: initErr } = await supabase.functions.invoke(
        "initialize-payment",
        { body: { orderId, email, amount } },
      );
      if (initErr || !init?.authorizationUrl || !init?.reference) {
        throw new Error(init?.error ?? "Could not start payment.");
      }

      // 2. Open Paystack checkout; resolves when the browser is closed/redirected.
      const result = await WebBrowser.openAuthSessionAsync(
        init.authorizationUrl,
        "marketdistrict://payment-callback",
      );

      if (result.type !== "success" && result.type !== "dismiss") {
        return { status: "cancelled", reference: init.reference };
      }

      // 3. Verify with the server (authoritative — don't trust the redirect alone).
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
