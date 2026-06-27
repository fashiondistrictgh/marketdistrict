import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Bell, CheckCircle2, Package, Truck, XCircle } from "lucide-react-native";

import { StackHeader } from "@/components/common/StackHeader";
import { useActivity, type ActivityItem } from "@/hooks/useActivity";
import { colors } from "@/constants/colors";

const ICON: Record<ActivityItem["kind"], React.ComponentType<{ size?: number; color?: string }>> = {
  placed: Package,
  confirmed: CheckCircle2,
  delivery: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
};

export default function NotificationsScreen() {
  const { data: activity = [], isLoading } = useActivity();

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <StackHeader title="Notifications" />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : activity.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bell size={28} color={colors.primary} />
          </View>
          <Text className="text-base font-semibold text-gray-900">No activity yet</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            Order updates and offers will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
          {activity.map((n) => {
            const Icon = ICON[n.kind] ?? Bell;
            const danger = n.kind === "cancelled";
            return (
              <View key={n.id} className="mb-3 flex-row gap-3 rounded-2xl bg-white p-4">
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${
                    danger ? "bg-red-50" : "bg-primary/10"
                  }`}
                >
                  <Icon size={18} color={danger ? "#dc2626" : colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">{n.title}</Text>
                  <Text className="mt-0.5 text-sm text-gray-500">{n.body}</Text>
                  <Text className="mt-1 text-xs text-gray-400">{n.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
