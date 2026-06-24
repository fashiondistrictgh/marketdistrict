import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart } from "lucide-react-native";

import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useWishlistStore } from "@/store/wishlist-store";
import { colors } from "@/constants/colors";

export default function WishlistScreen() {
  const ids = useWishlistStore((s) => s.ids);
  const { data: products = [], isLoading } = useProducts();

  const saved = useMemo(() => products.filter((p) => ids.includes(p.id)), [products, ids]);

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="bg-white">
        <View className="px-5 pb-3 pt-2">
          <Text className="text-2xl font-bold text-gray-900">Wishlist</Text>
          <Text className="mt-0.5 text-sm text-gray-500">
            {saved.length > 0 ? `${saved.length} saved item(s)` : "Items you love, in one place"}
          </Text>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : saved.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Heart size={36} color={colors.primary} />
          </View>
          <Text className="text-lg font-bold text-gray-900">Your wishlist is empty</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            Tap the heart on any product to save it here.
          </Text>
          <Pressable
            onPress={() => router.push("/(tabs)/home")}
            className="mt-6 h-12 items-center justify-center rounded-2xl bg-primary px-8 active:opacity-90"
          >
            <Text className="font-bold text-white">Browse products</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        >
          <View className="flex-row flex-wrap justify-between">
            {saved.map((p) => (
              <View key={p.id} style={{ width: "48%" }}>
                <ProductCard product={p} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
