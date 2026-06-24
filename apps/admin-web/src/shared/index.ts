// Barrel export for the shared package.
// Both the mobile app and the admin dashboard import from "@market-district/shared".

// Types
export * from "./types/database";
export * from "./types/product";
export * from "./types/order";
export * from "./types/customer";
export * from "./types/payment";
export * from "./types/delivery";
export * from "./types/user";

// Constants
export * from "./constants/order-status";
export * from "./constants/payment-status";
export * from "./constants/product-status";
export * from "./constants/user-roles";
export * from "./constants/categories";

// Schemas
export * from "./schemas/product.schema";
export * from "./schemas/order.schema";
export * from "./schemas/customer.schema";
export * from "./schemas/payment.schema";
export * from "./schemas/address.schema";

// Utils
export * from "./utils/currency";
export * from "./utils/date";
export * from "./utils/text";
export * from "./utils/validation";
