import { Text, View } from "react-native";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/shared";

const TONE: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: "bg-amber-100", text: "text-amber-800" },
  confirmed: { bg: "bg-blue-100", text: "text-blue-800" },
  preparing: { bg: "bg-indigo-100", text: "text-indigo-800" },
  out_for_delivery: { bg: "bg-purple-100", text: "text-purple-800" },
  delivered: { bg: "bg-green-100", text: "text-green-800" },
  cancelled: { bg: "bg-red-100", text: "text-red-700" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const tone = TONE[status];
  return (
    <View className={`self-start rounded-full px-2.5 py-1 ${tone.bg}`}>
      <Text className={`text-xs font-semibold ${tone.text}`}>{ORDER_STATUS_LABELS[status]}</Text>
    </View>
  );
}
