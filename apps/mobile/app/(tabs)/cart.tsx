import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShoppingCart } from "lucide-react-native";
import { formatCurrency } from "@/shared";

import { CartItem } from "@/components/cart/CartItem";
import { useCartStore } from "@/store/cart-store";
import { colors } from "@/constants/colors";

const DELIVERY_FEE = 8; // GHS, flat rate for now
const FREE_DELIVERY_THRESHOLD = 100;

export default function CartScreen() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-surface">
        <StatusBar style="dark" />
        <SafeAreaView edges={["top"]} className="bg-white">
          <View className="px-5 pb-3 pt-2">
            <Text className="text-2xl font-bold text-gray-900">Cart</Text>
          </View>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center px-10">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <ShoppingCart size={36} color={colors.primary} />
          </View>
          <Text className="text-lg font-bold text-gray-900">Your cart is empty</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            Add some fresh groceries to get started.
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/home")}
            className="mt-6 h-12 items-center justify-center rounded-2xl bg-primary px-8 active:opacity-90"
          >
            <Text className="font-bold text-white">Start shopping</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center justify-between px-5 pb-3 pt-2">
          <Text className="text-2xl font-bold text-gray-900">
            Cart <Text className="text-base font-medium text-gray-400">({items.length})</Text>
          </Text>
          <Pressable onPress={clear} hitSlop={8}>
            <Text className="text-sm font-medium text-red-500">Clear all</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
      >
        {items.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}

        {/* Summary */}
        <View className="mt-2 rounded-2xl bg-white p-4">
          <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
          <SummaryRow
            label="Delivery fee"
            value={deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
            highlight={deliveryFee === 0}
          />
          {subtotal < FREE_DELIVERY_THRESHOLD ? (
            <Text className="mt-1 text-xs text-gray-400">
              Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery
            </Text>
          ) : null}
          <View className="my-3 h-px bg-gray-100" />
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-gray-900">Total</Text>
            <Text className="text-xl font-extrabold text-primary">{formatCurrency(total)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout bar */}
      <SafeAreaView edges={["bottom"]} className="border-t border-gray-100 bg-white">
        <View className="px-5 py-3">
          <Pressable
            onPress={() => router.push("/checkout")}
            className="h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-primary active:opacity-90"
          >
            <Text className="text-base font-bold text-white">
              Proceed to checkout · {formatCurrency(total)}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className={`text-sm font-semibold ${highlight ? "text-primary" : "text-gray-900"}`}>
        {value}
      </Text>
    </View>
  );
}
