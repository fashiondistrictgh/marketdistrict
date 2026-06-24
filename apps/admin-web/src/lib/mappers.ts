// Maps snake_case Supabase rows to the camelCase domain types the UI uses.
import type {
  Product,
  Category,
  Order,
  OrderItem,
  Customer,
  Payment,
  ProductRow,
  CategoryRow,
  OrderRow,
  OrderItemRow,
  ProfileRow,
  PaymentRow,
} from "@/shared";

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    categoryId: row.category_id,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    unit: row.unit,
    stockQuantity: row.stock_quantity,
    imageUrls: row.image_urls ?? [],
    status: row.status,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCustomer(row: ProfileRow): Customer {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

export function mapPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    orderId: row.order_id,
    provider: row.provider,
    method: row.method,
    status: row.status,
    amount: Number(row.amount),
    currency: row.currency,
    reference: row.reference,
    paidAt: row.paid_at,
    createdAt: row.created_at,
  };
}

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

export function mapOrderItem(row: OrderItemRow): OrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productName: row.product_name,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total),
  };
}

export function mapOrder(row: OrderRow & { items?: OrderItemRow[] }): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    status: row.status,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    discount: Number(row.discount),
    total: Number(row.total),
    addressId: row.address_id,
    deliveryNotes: row.delivery_notes,
    items: (row.items ?? []).map(mapOrderItem),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
