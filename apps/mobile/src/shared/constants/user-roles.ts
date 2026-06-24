export const USER_ROLE = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  MANAGER: "manager",
  RIDER: "rider",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  admin: "Administrator",
  manager: "Manager",
  rider: "Delivery rider",
};

/** Roles allowed to access the admin dashboard. */
export const ADMIN_ROLES: UserRole[] = [USER_ROLE.ADMIN, USER_ROLE.MANAGER];
