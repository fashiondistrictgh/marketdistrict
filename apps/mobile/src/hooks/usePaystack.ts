import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { supabase } from "@/lib/supabase";

export interface PaystackResult {
  status: "paid" | "failed" | "cancelled";
  reference: string | null;
}

/**
 * Drives a Paystack card / mobile-money payment:
 * 1. initialize-payment edge fn (server holds secret) -> authorization_url + reference
 * 2. open the Paystack checkout in an in-app browser (no system "continue?" prompt)
 * 3. auto-close the browser when Paystack redirects to our deep link
 * 4. verify-payment edge fn confirms the final status
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

    // When Paystack redirects to marketdistrict://payment-callback, dismiss the
    // in-app browser automatically so the user returns to the app hands-free.
    const sub = Linking.addEventListener("url", ({ url }) => {
      if (url.includes("payment-callback")) {
        WebBrowser.dismissBrowser();
      }
    });

    try {
      // 1. Initialize on the server.
      const { data: init, error: initErr } = await supabase.functions.invoke(
        "initialize-payment",
        { body: { orderId, email, amount } },
      );
      if (initErr || !init?.authorizationUrl || !init?.reference) {
        throw new Error(init?.error ?? "Could not start payment.");
      }

      // 2. Open Paystack checkout. openBrowserAsync avoids the iOS
      // "App wants to sign in with paystack.com" consent dialog.
      await WebBrowser.openBrowserAsync(init.authorizationUrl, {
        dismissButtonStyle: "close",
        showInRecents: false,
      });

      // 3. Verify with the server (authoritative — never trust the client alone).
      const { data: verify } = await supabase.functions.invoke("verify-payment", {
        body: { reference: init.reference, provider: "paystack" },
      });

      return {
        status: verify?.status === "paid" ? "paid" : "failed",
        reference: init.reference,
      };
    } finally {
      sub.remove();
      setIsPaying(false);
    }
  }

  return { pay, isPaying };
}
