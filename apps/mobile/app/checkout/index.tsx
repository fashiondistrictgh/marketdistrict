import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Banknote, MapPin } from "lucide-react-native";
import { formatCurrency } from "@/shared";

import { useCartStore } from "@/store/cart-store";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";

const DELIVERY_FEE = 8;
const FREE_DELIVERY_THRESHOLD = 100;

export default function CheckoutScreen() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const placeOrder = usePlaceOrder();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  async function onPlaceOrder() {
    if (address.trim().length < 6) return setError("Please enter a full delivery address.");
    if (phone.trim().length < 7) return setError("Please enter a valid phone number.");
    setError(null);
    try {
      await placeOrder.mutateAsync({
        items,
        subtotal,
        deliveryFee,
        deliveryAddress: address.trim(),
        phone: phone.trim(),
        paymentMethod: "cash_on_delivery",
      });
      clear();
      router.replace("/checkout/success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place order. Try again.");
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="flex-row items-center gap-3 px-4 pb-3 pt-2">
          <Pressable onPress={() => router.back()} hitSlop={8}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">Checkout</Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Delivery address */}
          <View className="rounded-2xl bg-white p-4">
            <View className="mb-3 flex-row items-center gap-2">
              <MapPin size={18} color={colors.primary} />
              <Text className="text-base font-bold text-gray-900">Delivery address</Text>
            </View>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="House number, street, area, city"
              placeholderTextColor="#9ca3af"
              multiline
              className="min-h-12 rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900"
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              className="mt-3 h-12 rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
            />
          </View>

          {/* Payment method */}
          <View className="mt-4 rounded-2xl bg-white p-4">
            <Text className="mb-3 text-base font-bold text-gray-900">Payment method</Text>
            <View className="flex-row items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 p-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Banknote size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900">Cash on delivery</Text>
                <Text className="text-xs text-gray-500">Pay when your order arrives</Text>
              </View>
              <View className="h-5 w-5 items-center justify-center rounded-full bg-primary">
                <View className="h-2 w-2 rounded-full bg-white" />
              </View>
            </View>
            <Text className="mt-2 text-xs text-gray-400">
              Card & mobile money payments coming soon.
            </Text>
          </View>

          {/* Summary */}
          <View className="mt-4 rounded-2xl bg-white p-4">
            <Text className="mb-2 text-base font-bold text-gray-900">Order summary</Text>
            <Row label={`Items (${items.length})`} value={formatCurrency(subtotal)} />
            <Row
              label="Delivery"
              value={deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}
            />
            <View className="my-3 h-px bg-gray-100" />
            <View className="flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">Total</Text>
              <Text className="text-xl font-extrabold text-primary">{formatCurrency(total)}</Text>
            </View>
          </View>

          {error ? <Text className="mt-3 text-sm text-red-500">{error}</Text> : null}
        </ScrollView>

        <SafeAreaView edges={["bottom"]} className="border-t border-gray-100 bg-white">
          <View className="px-5 py-3">
            <Pressable
              onPress={onPlaceOrder}
              disabled={placeOrder.isPending}
              className="h-14 items-center justify-center rounded-2xl bg-primary active:opacity-90"
            >
              <Text className="text-base font-bold text-white">
                {placeOrder.isPending ? "Placing order…" : `Place order · ${formatCurrency(total)}`}
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
