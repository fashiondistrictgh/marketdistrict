import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronDown, Mail, MessageCircle, Phone } from "lucide-react-native";
import { useState } from "react";

import { StackHeader } from "@/components/common/StackHeader";
import { colors } from "@/constants/colors";

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Browse products, tap the + to add them to your cart, then go to the Cart tab and tap Proceed to checkout.",
  },
  {
    q: "What payment methods are available?",
    a: "You can pay with card or mobile money via Paystack, or choose cash on delivery.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders are delivered within 30–45 minutes, depending on your location.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled while they are still pending. Contact support for help.",
  },
];

export default function HelpSupportScreen() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <StackHeader title="Help & support" />

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <Text className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Contact us
        </Text>
        <View className="overflow-hidden rounded-2xl bg-white">
          <ContactRow
            icon={<Phone size={18} color={colors.primary} />}
            label="Call us"
            value="+233 20 000 0000"
            onPress={() => Linking.openURL("tel:+233200000000")}
          />
          <Divider />
          <ContactRow
            icon={<MessageCircle size={18} color={colors.primary} />}
            label="WhatsApp"
            value="Chat with support"
            onPress={() => Linking.openURL("https://wa.me/233200000000")}
          />
          <Divider />
          <ContactRow
            icon={<Mail size={18} color={colors.primary} />}
            label="Email"
            value="support@marketdistrict.com"
            onPress={() => Linking.openURL("mailto:support@marketdistrict.com")}
          />
        </View>

        <Text className="mb-3 mt-6 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Frequently asked
        </Text>
        <View className="overflow-hidden rounded-2xl bg-white">
          {FAQS.map((f, i) => (
            <View key={i}>
              {i > 0 ? <Divider /> : null}
              <Pressable
                onPress={() => setOpen(open === i ? null : i)}
                className="px-4 py-3.5 active:bg-gray-50"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="flex-1 pr-3 text-sm font-semibold text-gray-900">{f.q}</Text>
                  <ChevronDown
                    size={18}
                    color="#9ca3af"
                    style={{ transform: [{ rotate: open === i ? "180deg" : "0deg" }] }}
                  />
                </View>
                {open === i ? (
                  <Text className="mt-2 text-sm leading-5 text-gray-500">{f.a}</Text>
                ) : null}
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center gap-3 px-4 py-3.5 active:bg-gray-50">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">{icon}</View>
      <View>
        <Text className="text-sm font-semibold text-gray-900">{label}</Text>
        <Text className="text-xs text-gray-500">{value}</Text>
      </View>
    </Pressable>
  );
}

function Divider() {
  return <View className="ml-4 h-px bg-gray-100" />;
}
