/** Admin dashboard route paths. */
export const ADMIN_ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",

  dashboard: "/dashboard",

  orders: "/orders",
  orderDetail: (id: string) => `/orders/${id}`,

  products: "/products",
  productNew: "/products/new",
  productEdit: (id: string) => `/products/${id}`,
  productImport: "/products/import",

  categories: "/categories",

  customers: "/customers",
  customerDetail: (id: string) => `/customers/${id}`,

  payments: "/payments",
  deliveries: "/deliveries",
  analytics: "/analytics",

  settings: "/settings",
  settingsProfile: "/settings/profile",
  settingsStore: "/settings/store",
  settingsPayments: "/settings/payments",
  settingsNotifications: "/settings/notifications",
  settingsUsers: "/settings/users",
} as const;
