// App-local types that don't belong in the shared package.

export type DeliveryOption = {
  id: string;
  label: string;
  description: string;
  fee: number;
  etaMinutes: number;
};

export type CheckoutStep =
  | "address"
  | "delivery-option"
  | "payment"
  | "review"
  | "processing";
