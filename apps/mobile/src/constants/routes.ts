/** Centralized route paths for Expo Router navigation. */
export const ROUTES = {
  index: "/",

  // Auth
  login: "/(auth)/login",
  register: "/(auth)/register",
  forgotPassword: "/(auth)/forgot-password",
  otpVerification: "/(auth)/otp-verification",

  // Tabs
  home: "/(tabs)/home",
  search: "/(tabs)/categories",
  cart: "/(tabs)/cart",
  wishlist: "/(tabs)/wishlist",
  profile: "/(tabs)/profile",

  // Orders now live outside the tab bar (linked from Profile)
  orders: "/orders",

  // Detail routes
  product: (id: string) => `/product/${id}`,
  category: (id: string) => `/category/${id}`,
  orderDetail: (id: string) => `/orders/${id}`,
  orderTracking: "/orders/tracking",

  // Checkout
  checkout: "/checkout",
  checkoutAddress: "/checkout/address",
  checkoutDelivery: "/checkout/delivery-option",
  checkoutPayment: "/checkout/payment",
  checkoutReview: "/checkout/review",
  checkoutProcessing: "/checkout/processing",
  checkoutSuccess: "/checkout/success",
  checkoutFailed: "/checkout/failed",

  // Profile sub-pages
  savedAddresses: "/profile/saved-addresses",
  paymentMethods: "/profile/payment-methods",
  notifications: "/profile/notifications",
  helpSupport: "/profile/help-support",
  settings: "/profile/settings",
} as const;
