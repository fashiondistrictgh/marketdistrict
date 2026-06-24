import type { OrderStatus } from "../constants/order-status";
import type { Address } from "./customer";
import type { Payment } from "./payment";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  addressId?: string | null;
  address?: Address | null;
  deliveryNotes?: string | null;
  items: OrderItem[];
  payment?: Payment | null;
  createdAt: string;
  updatedAt: string;
}

/** Item held in the cart before an order is placed. */
export interface CartLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string | null;
}
