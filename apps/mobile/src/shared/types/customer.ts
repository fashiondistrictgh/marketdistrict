export interface Address {
  id: string;
  customerId: string;
  label?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  lat?: number | null;
  lng?: number | null;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  addresses?: Address[];
  createdAt: string;
}
