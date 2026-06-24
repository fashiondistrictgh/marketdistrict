import {
  BarChart3,
  Boxes,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";

import { ADMIN_ROUTES } from "./routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Primary sidebar navigation for the admin dashboard. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ADMIN_ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Orders", href: ADMIN_ROUTES.orders, icon: ShoppingCart },
  { label: "Products", href: ADMIN_ROUTES.products, icon: Boxes },
  { label: "Categories", href: ADMIN_ROUTES.categories, icon: Tags },
  { label: "Customers", href: ADMIN_ROUTES.customers, icon: Users },
  { label: "Payments", href: ADMIN_ROUTES.payments, icon: CreditCard },
  { label: "Deliveries", href: ADMIN_ROUTES.deliveries, icon: Truck },
  { label: "Analytics", href: ADMIN_ROUTES.analytics, icon: BarChart3 },
  { label: "Settings", href: ADMIN_ROUTES.settings, icon: Settings },
];
