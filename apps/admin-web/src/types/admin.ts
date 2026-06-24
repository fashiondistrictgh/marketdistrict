import type { UserRole } from "@/shared";

export interface AdminUser {
  id: string;
  fullName: string | null;
  email: string;
  role: UserRole;
  lastActiveAt?: string | null;
}

export interface MetricCardData {
  label: string;
  value: string;
  delta?: number; // percentage change vs previous period
  hint?: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}
