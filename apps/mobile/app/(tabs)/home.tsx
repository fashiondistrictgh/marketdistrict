import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, MapPin, Search } from "lucide-react-native";

import { ProductCard } from "@/components/products/ProductCard";
import { PromoCarousel } from "@/components/home/PromoCarousel";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useAuthStore } from "@/store/auth-store";
import { colors } from "@/constants/colors";

const CATEGORY_EMOJI: Record<string, string> = {
  "fruits-vegetables": "🥦",
  "meat-seafood": "🐟",
  "dairy-eggs": "🥚",
  bakery: "🥐",
  beverages: "🥤",
  snacks: "🍪",
  pantry: "🌾",
  frozen: "🧊",
  household: "🧴",
  "personal-care": "🧼",
  baby: "🍼",
  pets: "🐾",
};

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  // New arrivals = most recently added products (hook returns newest-first).
  const newArrivals = useMemo(() => products.slice(0, 8), [products]);
  const firstName = (user?.fullName ?? user?.email ?? "there").split(/[\s@]/)[0];

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient colors={[colors.primaryLight, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView edges={["top"]}>
          <View className="px-5 pb-5 pt-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-xs text-white/80">Deliver to</Text>
                <View className="flex-row items-center gap-1">
                  <MapPin size={14} color="#fff" />
                  <Text className="text-base font-semibold text-white">Home</Text>
                </View>
              </View>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <Bell size={20} color="#fff" />
              </Pressable>
            </View>

            <View className="mt-4">
              <Text className="text-sm text-white/80">Hi {firstName} 👋</Text>
              <Text className="mt-0.5 text-2xl font-extrabold leading-7 text-white">
                What&apos;s fresh today?
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/(tabs)/categories")}
              className="mt-4 flex-row items-center gap-2 rounded-2xl bg-white px-4 py-3"
            >
              <Search size={20} color={colors.textMuted} />
              <Text className="text-base text-gray-400">Search for groceries…</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Promo slideshow (above categories) */}
        <View className="mt-5">
          <PromoCarousel />
        </View>

        {/* Categories — pill chips */}
        <View className="mt-6">
          <SectionHeader title="Categories" onPress={() => router.push("/(tabs)/categories")} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 8 }}
            className="mt-2"
          >
            {categories.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/category/${c.id}`)}
                className="flex-row items-center gap-2 rounded-full border border-gray-200 bg-white py-2.5 pl-2.5 pr-4"
              >
                <View className="h-8 w-8 items-center justify-center rounded-full bg-surface">
                  <Text style={{ fontSize: 18 }}>{CATEGORY_EMOJI[c.slug] ?? "🛒"}</Text>
                </View>
                <Text className="text-sm font-semibold text-gray-800">
                  {c.name.split(/ |&/)[0]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* New arrivals (newest first) */}
        {newArrivals.length > 0 ? (
          <View className="mt-7">
            <SectionHeader title="New arrivals" onPress={() => router.push("/(tabs)/categories")} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
              className="mt-3"
            >
              {newArrivals.map((p) => (
                <View key={p.id} style={{ width: 150 }}>
                  <ProductCard product={p} width={150} />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* All / Popular products */}
        <View className="mt-7 px-5">
          <SectionHeader title="Popular near you" inset />
          {isLoading ? (
            <View className="items-center py-12">
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : products.length === 0 ? (
            <View className="mt-3 items-center rounded-2xl bg-white py-12">
              <Text className="text-base font-semibold text-gray-900">No products yet</Text>
              <Text className="mt-1 text-sm text-gray-500">Check back soon.</Text>
            </View>
          ) : (
            <View className="mt-4 flex-row flex-wrap justify-between">
              {products.map((p) => (
                <View key={p.id} style={{ width: "48%" }}>
                  <ProductCard product={p} />
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  title,
  onPress,
  inset,
}: {
  title: string;
  onPress?: () => void;
  inset?: boolean;
}) {
  return (
    <View className={`flex-row items-center justify-between ${inset ? "" : "px-5"}`}>
      <Text className="text-xl font-extrabold tracking-tight text-gray-900">{title}</Text>
      {onPress ? (
        <Pressable onPress={onPress} hitSlop={6}>
          <Text className="text-sm font-semibold text-primary">See all</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
