// Status metadata (labels + badge colors) reused across admin tables and badges.
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  type OrderStatus,
  type PaymentStatus,
} from "@/shared";

type BadgeTone = "default" | "success" | "warning" | "danger" | "info";

export const ORDER_STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.CONFIRMED]: "info",
  [ORDER_STATUS.PREPARING]: "info",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "info",
  [ORDER_STATUS.DELIVERED]: "success",
  [ORDER_STATUS.CANCELLED]: "danger",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, BadgeTone> = {
  [PAYMENT_STATUS.PENDING]: "warning",
  [PAYMENT_STATUS.PROCESSING]: "info",
  [PAYMENT_STATUS.PAID]: "success",
  [PAYMENT_STATUS.FAILED]: "danger",
  [PAYMENT_STATUS.REFUNDED]: "default",
};

export { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS };
export type { BadgeTone };
