import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check } from "lucide-react-native";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS, formatCurrency, formatDateTime } from "@/shared";

import { useOrder } from "@/hooks/useOrders";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { colors } from "@/constants/colors";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">Order not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-semibold text-primary">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const cancelled = order.status === "cancelled";
  const currentStep = ORDER_STATUS_FLOW.indexOf(order.status);

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">{order.orderNumber}</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      >
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</Text>
          <OrderStatusBadge status={order.status} />
        </View>

        {/* Status timeline */}
        {!cancelled ? (
          <View className="mb-4 rounded-2xl bg-white p-4">
            <Text className="mb-4 text-base font-bold text-gray-900">Order status</Text>
            {ORDER_STATUS_FLOW.map((step, i) => {
              const done = i <= currentStep;
              const isLast = i === ORDER_STATUS_FLOW.length - 1;
              return (
                <View key={step} className="flex-row">
                  <View className="items-center">
                    <View
                      className={`h-7 w-7 items-center justify-center rounded-full ${
                        done ? "bg-primary" : "bg-gray-200"
                      }`}
                    >
                      {done ? <Check size={14} color="#fff" strokeWidth={3} /> : null}
                    </View>
                    {!isLast ? (
                      <View className={`h-8 w-0.5 ${i < currentStep ? "bg-primary" : "bg-gray-200"}`} />
                    ) : null}
                  </View>
                  <Text
                    className={`ml-3 ${isLast ? "" : "pb-2"} text-sm ${
                      done ? "font-semibold text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {ORDER_STATUS_LABELS[step]}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* Items */}
        <View className="mb-4 rounded-2xl bg-white p-4">
          <Text className="mb-3 text-base font-bold text-gray-900">Items</Text>
          {order.items.map((it) => (
            <View key={it.id} className="flex-row items-center justify-between py-1.5">
              <Text className="flex-1 text-sm text-gray-700">
                {it.quantity}× {it.productName}
              </Text>
              <Text className="text-sm font-semibold text-gray-900">
                {formatCurrency(it.lineTotal)}
              </Text>
            </View>
          ))}

          <View className="my-3 h-px bg-gray-100" />
          <Row label="Subtotal" value={formatCurrency(order.subtotal)} />
          <Row label="Delivery" value={order.deliveryFee === 0 ? "Free" : formatCurrency(order.deliveryFee)} />
          {order.discount > 0 ? (
            <Row label="Discount" value={`− ${formatCurrency(order.discount)}`} />
          ) : null}
          <View className="mt-2 flex-row items-center justify-between">
            <Text className="text-base font-bold text-gray-900">Total</Text>
            <Text className="text-lg font-extrabold text-primary">
              {formatCurrency(order.total)}
            </Text>
          </View>
        </View>

        {/* Delivery info */}
        {order.deliveryNotes ? (
          <View className="rounded-2xl bg-white p-4">
            <Text className="mb-1 text-base font-bold text-gray-900">Delivery details</Text>
            <Text className="text-sm text-gray-500">{order.deliveryNotes}</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </View>
  );
}
