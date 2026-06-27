import { useQuery } from "@tanstack/react-query";
import { ORDER_STATUS_LABELS, timeAgo, type OrderStatus } from "@/shared";

import { supabase } from "@/lib/supabase";
import { useNotificationsStore } from "@/store/notifications-store";

export interface ActivityItem {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "placed" | "confirmed" | "delivery" | "delivered" | "cancelled";
}

const KIND_BY_STATUS: Record<OrderStatus, ActivityItem["kind"]> = {
  pending: "placed",
  confirmed: "confirmed",
  preparing: "confirmed",
  out_for_delivery: "delivery",
  delivered: "delivered",
  cancelled: "cancelled",
};

/**
 * Derives a "recent activity" feed from the customer's orders, newest first.
 * (Replace/augment with a real `notifications` table when push is added.)
 */
export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    // Keep the feed fresh so newly placed orders / admin status changes appear
    // without a manual refresh.
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    retry: 2,
    queryFn: async (): Promise<ActivityItem[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, status, total, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error || !data) return [];

      return (
        data as {
          id: string;
          order_number: string;
          status: OrderStatus;
          total: number;
          created_at: string;
          updated_at: string;
        }[]
      ).map((o) => {
        const status = o.status;
        const placed = status === "pending";
        return {
          // id encodes the status so each status change is its own notification.
          id: `${o.id}:${status}`,
          kind: KIND_BY_STATUS[status] ?? "placed",
          title: placed ? "Order placed" : `Order ${ORDER_STATUS_LABELS[status]}`,
          body: placed
            ? `Your order ${o.order_number} has been received.`
            : `Order ${o.order_number} is now ${ORDER_STATUS_LABELS[status].toLowerCase()}.`,
          time: timeAgo(o.updated_at ?? o.created_at),
        };
      });
    },
  });
}

/** Number of activity items the user hasn't seen yet (for the bell badge). */
export function useUnreadCount(): number {
  const { data: activity = [] } = useActivity();
  const seenIds = useNotificationsStore((s) => s.seenIds);
  return activity.filter((a) => !seenIds.includes(a.id)).length;
}
