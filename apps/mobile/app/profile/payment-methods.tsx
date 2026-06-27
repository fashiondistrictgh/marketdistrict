import { ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Banknote, CreditCard, Smartphone } from "lucide-react-native";

import { StackHeader } from "@/components/common/StackHeader";
import { colors } from "@/constants/colors";

export default function PaymentMethodsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <StackHeader title="Payment methods" />

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text className="mb-3 px-1 text-sm text-gray-500">
          You can pay with any of these at checkout. No need to save card details — payments are
          handled securely by Paystack.
        </Text>

        <View className="overflow-hidden rounded-2xl bg-white">
          <MethodRow
            icon={<CreditCard size={18} color={colors.primary} />}
            title="Debit / Credit card"
            subtitle="Visa, Mastercard via Paystack"
          />
          <Divider />
          <MethodRow
            icon={<Smartphone size={18} color={colors.primary} />}
            title="Mobile money"
            subtitle="MTN, Vodafone, AirtelTigo"
          />
          <Divider />
          <MethodRow
            icon={<Banknote size={18} color={colors.primary} />}
            title="Cash on delivery"
            subtitle="Pay when your order arrives"
          />
        </View>
      </ScrollView>
    </View>
  );
}

function MethodRow({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">{icon}</View>
      <View>
        <Text className="text-sm font-semibold text-gray-900">{title}</Text>
        <Text className="text-xs text-gray-500">{subtitle}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View className="ml-4 h-px bg-gray-100" />;
}
