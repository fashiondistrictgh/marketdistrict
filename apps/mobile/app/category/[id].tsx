import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { colors } from "@/constants/colors";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: products = [], isLoading } = useProducts({ categoryId: id });
  const { data: categories = [] } = useCategories();

  const category = categories.find((c) => c.id === id);

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: true, title: category?.name ?? "Category" }} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base font-semibold text-gray-900">No products yet</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            Items in this category will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        >
          <View className="flex-row flex-wrap justify-between">
            {products.map((p) => (
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
