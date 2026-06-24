// Re-export the shared Database row types so admin code can import table shapes
// from a single local module.
export type {
  Database,
  ProfileRow,
  CategoryRow,
  ProductRow,
  OrderRow,
  OrderItemRow,
  PaymentRow,
  DeliveryRow,
  AddressRow,
  NotificationRow,
} from "@/shared";

/** Generic shape for paginated table queries used across admin tables. */
export interface TableQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface Paginated<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}
