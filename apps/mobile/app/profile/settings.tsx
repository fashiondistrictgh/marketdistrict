import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronRight } from "lucide-react-native";

import { StackHeader } from "@/components/common/StackHeader";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const { signOut } = useAuth();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  async function onLogout() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      <StackHeader title="Settings" />

      <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
        <SectionLabel>Account</SectionLabel>
        <View className="overflow-hidden rounded-2xl bg-white">
          <InfoRow label="Name" value={user?.fullName ?? "—"} />
          <Divider />
          <InfoRow label="Email" value={user?.email ?? "—"} />
          <Divider />
          <InfoRow label="Phone" value={user?.phone ?? "Not set"} />
        </View>

        <SectionLabel className="mt-6">Notifications</SectionLabel>
        <View className="overflow-hidden rounded-2xl bg-white">
          <ToggleRow label="Push notifications" value={pushEnabled} onValueChange={setPushEnabled} />
          <Divider />
          <ToggleRow label="Email updates" value={emailEnabled} onValueChange={setEmailEnabled} />
        </View>

        <SectionLabel className="mt-6">Support</SectionLabel>
        <View className="overflow-hidden rounded-2xl bg-white">
          <LinkRow label="Help & support" onPress={() => router.push("/profile/help-support")} />
          <Divider />
          <LinkRow label="Privacy policy" onPress={() => {}} />
          <Divider />
          <LinkRow label="Terms of service" onPress={() => {}} />
        </View>

        <Pressable
          onPress={onLogout}
          className="mt-6 h-14 items-center justify-center rounded-2xl bg-white active:opacity-80"
        >
          <Text className="font-bold text-red-500">Log out</Text>
        </Pressable>

        <Text className="mt-6 text-center text-xs text-gray-400">Market District · v0.1.0</Text>
      </ScrollView>
    </View>
  );
}

function SectionLabel({ children, className = "" }: { children: string; className?: string }) {
  return (
    <Text className={`mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400 ${className}`}>
      {children}
    </Text>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3.5">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="max-w-[60%] text-sm font-medium text-gray-900" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between px-4 py-2.5">
      <Text className="text-sm font-medium text-gray-900">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: "#d1d5db" }}
        thumbColor="#ffffff"
      />
    </View>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="flex-row items-center justify-between px-4 py-3.5 active:bg-gray-50">
      <Text className="text-sm font-medium text-gray-900">{label}</Text>
      <ChevronRight size={18} color="#9ca3af" />
    </Pressable>
  );
}

function Divider() {
  return <View className="ml-4 h-px bg-gray-100" />;
}
