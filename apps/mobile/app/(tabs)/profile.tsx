import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Receipt,
  Settings,
} from "lucide-react-native";
import { initials } from "@/shared";

import { ProfileMenuItem } from "@/components/profile/ProfileMenuItem";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const { signOut } = useAuth();

  const name = user?.fullName ?? "Guest";
  const email = user?.email ?? "";

  async function onLogout() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={[colors.primaryLight, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView edges={["top"]}>
          <View className="items-center px-5 pb-7 pt-4">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
              <Text className="text-2xl font-bold text-primary">{initials(name)}</Text>
            </View>
            <Text className="mt-3 text-xl font-bold text-white">{name}</Text>
            {email ? <Text className="text-sm text-white/85">{email}</Text> : null}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
      >
        {/* Account */}
        <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Account
        </Text>
        <View className="overflow-hidden rounded-2xl bg-white">
          <ProfileMenuItem icon={Receipt} label="My orders" onPress={() => router.push("/orders" as never)} />
          <ProfileMenuItem icon={Heart} label="Wishlist" onPress={() => router.push("/(tabs)/wishlist")} />
          <ProfileMenuItem
            icon={MapPin}
            label="Saved addresses"
            onPress={() => router.push("/profile/saved-addresses")}
          />
          <ProfileMenuItem
            icon={Bell}
            label="Notifications"
            onPress={() => router.push("/profile/notifications")}
          />
        </View>

        {/* Support */}
        <Text className="mb-2 mt-6 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          More
        </Text>
        <View className="overflow-hidden rounded-2xl bg-white">
          <ProfileMenuItem
            icon={Settings}
            label="Settings"
            onPress={() => router.push("/profile/settings")}
          />
          <ProfileMenuItem
            icon={HelpCircle}
            label="Help & support"
            onPress={() => router.push("/profile/help-support")}
          />
        </View>

        {/* Logout */}
        <View className="mt-6 overflow-hidden rounded-2xl bg-white">
          <ProfileMenuItem icon={LogOut} label="Log out" onPress={onLogout} danger />
        </View>

        <Text className="mt-6 text-center text-xs text-gray-400">Market District · v0.1.0</Text>
      </ScrollView>
    </View>
  );
}
