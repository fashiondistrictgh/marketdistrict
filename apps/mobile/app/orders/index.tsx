import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Receipt } from "lucide-react-native";

import { OrderCard } from "@/components/orders/OrderCard";
import { useOrders } from "@/hooks/useOrders";
import { colors } from "@/constants/colors";

export default function OrdersScreen() {
  const { data: orders = [], isLoading } = useOrders();

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">My orders</Text>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Receipt size={36} color={colors.primary} />
          </View>
          <Text className="text-lg font-bold text-gray-900">No orders yet</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            When you place an order, it will show up here.
          </Text>
          <Pressable
            onPress={() => router.replace("/(tabs)/home")}
            className="mt-6 h-12 items-center justify-center rounded-2xl bg-primary px-8 active:opacity-90"
          >
            <Text className="font-bold text-white">Start shopping</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        >
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
