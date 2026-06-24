export const DELIVERY_STATUS = {
  UNASSIGNED: "unassigned",
  ASSIGNED: "assigned",
  PICKED_UP: "picked_up",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  FAILED: "failed",
} as const;

export type DeliveryStatus = (typeof DELIVERY_STATUS)[keyof typeof DELIVERY_STATUS];

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  unassigned: "Unassigned",
  assigned: "Assigned",
  picked_up: "Picked up",
  in_transit: "In transit",
  delivered: "Delivered",
  failed: "Failed",
};

export interface Delivery {
  id: string;
  orderId: string;
  riderId?: string | null;
  status: DeliveryStatus;
  estimatedArrival?: string | null;
  deliveredAt?: string | null;
  trackingLat?: number | null;
  trackingLng?: number | null;
  createdAt: string;
}

export interface Rider {
  id: string;
  fullName: string;
  phone?: string | null;
  isAvailable: boolean;
}
