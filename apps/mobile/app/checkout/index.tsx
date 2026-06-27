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
import { ArrowLeft, Banknote, CreditCard, MapPin } from "lucide-react-native";
import { formatCurrency } from "@/shared";

import { useCartStore } from "@/store/cart-store";
import { usePlaceOrder } from "@/hooks/usePlaceOrder";
import { usePaystack } from "@/hooks/usePaystack";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";

const DELIVERY_FEE = 8;
const FREE_DELIVERY_THRESHOLD = 100;

type PayMethod = "cash_on_delivery" | "card";

export default function CheckoutScreen() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const placeOrder = usePlaceOrder();
  const { pay, isPaying } = usePaystack();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [method, setMethod] = useState<PayMethod>("cash_on_delivery");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  async function onPlaceOrder() {
    if (address.trim().length < 6) return setError("Please enter a full delivery address.");
    if (phone.trim().length < 7) return setError("Please enter a valid phone number.");
    setError(null);
    setBusy(true);
    try {
      const orderId = await placeOrder.mutateAsync({
        items,
        subtotal,
        deliveryFee,
        deliveryAddress: address.trim(),
        phone: phone.trim(),
        paymentMethod: method,
      });

      if (method === "card") {
        const result = await pay({
          orderId,
          email: user?.email ?? "customer@marketdistrict.com",
          amount: total,
        });
        if (result.status === "paid") {
          clear();
          router.replace("/checkout/success");
        } else if (result.status === "cancelled") {
          // Order exists but payment not completed — leave it pending, inform user.
          setError("Payment was cancelled. Your order is saved as pending.");
        } else {
          router.replace("/checkout/failed");
        }
      } else {
        clear();
        router.replace("/checkout/success");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place order. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const working = busy || placeOrder.isPending || isPaying;
  const ctaLabel = isPaying
    ? "Opening payment…"
    : working
      ? "Placing order…"
      : `Place order · ${formatCurrency(total)}`;

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

            <PayOption
              selected={method === "card"}
              onPress={() => setMethod("card")}
              icon={<CreditCard size={20} color={colors.primary} />}
              title="Pay with card"
              subtitle="Card or mobile money via Paystack"
            />
            <View className="h-3" />
            <PayOption
              selected={method === "cash_on_delivery"}
              onPress={() => setMethod("cash_on_delivery")}
              icon={<Banknote size={20} color={colors.primary} />}
              title="Cash on delivery"
              subtitle="Pay when your order arrives"
            />
          </View>

          {/* Summary */}
          <View className="mt-4 rounded-2xl bg-white p-4">
            <Text className="mb-2 text-base font-bold text-gray-900">Order summary</Text>
            <Row label={`Items (${items.length})`} value={formatCurrency(subtotal)} />
            <Row label="Delivery" value={deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)} />
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
              disabled={working}
              className="h-14 items-center justify-center rounded-2xl bg-primary active:opacity-90"
              style={working ? { opacity: 0.7 } : undefined}
            >
              <Text className="text-base font-bold text-white">{ctaLabel}</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

function PayOption({
  selected,
  onPress,
  icon,
  title,
  subtitle,
}: {
  selected: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-3 rounded-xl border-2 p-3 ${
        selected ? "border-primary bg-primary/5" : "border-gray-200 bg-white"
      }`}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-500">{subtitle}</Text>
      </View>
      <View
        className={`h-5 w-5 items-center justify-center rounded-full ${
          selected ? "bg-primary" : "border-2 border-gray-300"
        }`}
      >
        {selected ? <View className="h-2 w-2 rounded-full bg-white" /> : null}
      </View>
    </Pressable>
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
