import { ScrollView, Text, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Bell } from "lucide-react-native";

import { StackHeader } from "@/components/common/StackHeader";
import { colors } from "@/constants/colors";

export default function NotificationsScreen() {
  // Notifications come from the `notifications` table once events are wired up.
  // For now show an empty state so the screen is complete and not a placeholder.
  const notifications: { id: string; title: string; body: string; time: string }[] = [];

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <StackHeader title="Notifications" />

      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Bell size={28} color={colors.primary} />
          </View>
          <Text className="text-base font-semibold text-gray-900">No notifications yet</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            Order updates and offers will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {notifications.map((n) => (
            <View key={n.id} className="mb-3 flex-row gap-3 rounded-2xl bg-white p-4">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bell size={18} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900">{n.title}</Text>
                <Text className="mt-0.5 text-sm text-gray-500">{n.body}</Text>
                <Text className="mt-1 text-xs text-gray-400">{n.time}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
