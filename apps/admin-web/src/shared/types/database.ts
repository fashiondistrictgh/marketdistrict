// Hand-written shape of the Supabase database.
// Replace/augment this with generated types via `npm run generate-types`.

import type { OrderStatus } from "../constants/order-status";
import type { PaymentMethod, PaymentProvider, PaymentStatus } from "../constants/payment-status";
import type { ProductStatus, ProductUnit } from "../constants/product-status";
import type { UserRole } from "../constants/user-roles";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & { name: string; slug: string };
        Update: Partial<CategoryRow>;
      };
      products: {
        Row: ProductRow;
        Insert: Partial<ProductRow> & { name: string; price: number };
        Update: Partial<ProductRow>;
      };
      orders: {
        Row: OrderRow;
        Insert: Partial<OrderRow> & { customer_id: string };
        Update: Partial<OrderRow>;
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Partial<OrderItemRow> & { order_id: string; product_id: string; quantity: number };
        Update: Partial<OrderItemRow>;
      };
      payments: {
        Row: PaymentRow;
        Insert: Partial<PaymentRow> & { order_id: string; amount: number };
        Update: Partial<PaymentRow>;
      };
      deliveries: {
        Row: DeliveryRow;
        Insert: Partial<DeliveryRow> & { order_id: string };
        Update: Partial<DeliveryRow>;
      };
      addresses: {
        Row: AddressRow;
        Insert: Partial<AddressRow> & { customer_id: string; line1: string; city: string };
        Update: Partial<AddressRow>;
      };
      notifications: {
        Row: NotificationRow;
        Insert: Partial<NotificationRow> & { user_id: string; title: string };
        Update: Partial<NotificationRow>;
      };
    };
  };
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  unit: ProductUnit;
  stock_quantity: number;
  image_urls: string[];
  status: ProductStatus;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  customer_id: string;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total: number;
  address_id: string | null;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface PaymentRow {
  id: string;
  order_id: string;
  provider: PaymentProvider | null;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  reference: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface DeliveryRow {
  id: string;
  order_id: string;
  rider_id: string | null;
  status: string;
  estimated_arrival: string | null;
  delivered_at: string | null;
  tracking_lat: number | null;
  tracking_lng: number | null;
  created_at: string;
}

export interface AddressRow {
  id: string;
  customer_id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string | null;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: string | null;
  is_read: boolean;
  created_at: string;
}
