import type { PaymentMethod, PaymentProvider, PaymentStatus } from "../constants/payment-status";

export interface Payment {
  id: string;
  orderId: string;
  provider?: PaymentProvider | null;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  reference?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

/** Result returned by the verify-payment edge function. */
export interface PaymentVerification {
  reference: string;
  status: PaymentStatus;
  amount: number;
  provider: PaymentProvider;
}
