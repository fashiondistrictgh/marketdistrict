import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import type { Order } from "@/shared";
import { formatCurrency, formatDate } from "@/shared";

import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderCard({ order }: { order: Order }) {
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Pressable
      onPress={() => router.push(`/orders/${order.id}`)}
      className="mb-3 rounded-2xl border border-gray-100 bg-white p-4 active:opacity-90"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-gray-900">{order.orderNumber}</Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text className="mt-1 text-xs text-gray-400">{formatDate(order.createdAt)}</Text>

      {order.items.length > 0 ? (
        <Text numberOfLines={1} className="mt-2 text-sm text-gray-500">
          {order.items.map((i) => `${i.quantity}× ${i.productName}`).join(", ")}
        </Text>
      ) : null}

      <View className="mt-3 flex-row items-center justify-between border-t border-gray-100 pt-3">
        <Text className="text-sm text-gray-500">
          {itemCount} item{itemCount === 1 ? "" : "s"}
        </Text>
        <View className="flex-row items-center gap-1">
          <Text className="text-base font-extrabold text-primary">
            {formatCurrency(order.total)}
          </Text>
          <ChevronRight size={18} color="#9ca3af" />
        </View>
      </View>
    </Pressable>
  );
}
