import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";

import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { colors } from "@/constants/colors";

export default function ShopScreen() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    categoryId: activeCategory ?? undefined,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, search]);

  return (
    <View className="flex-1 bg-surface">
      <StatusBar style="dark" />
      <SafeAreaView edges={["top"]} className="border-b border-gray-100 bg-white">
        <View className="px-5 pb-3 pt-3">
          <Text className="mb-3 text-2xl font-bold text-gray-900">Search</Text>

          <View className="h-12 flex-row items-center gap-2 rounded-2xl bg-gray-100 px-4">
            <Search size={20} color={colors.textMuted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search for groceries…"
              placeholderTextColor="#9ca3af"
              className="h-12 flex-1 text-base text-gray-900"
              returnKeyType="search"
            />
            {search ? (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <X size={18} color={colors.textMuted} />
              </Pressable>
            ) : null}
          </View>

          {/* Category filter pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingTop: 12, paddingRight: 8 }}
          >
            <Pill label="All" active={activeCategory === null} onPress={() => setActiveCategory(null)} />
            {categories.map((c) => (
              <Pill
                key={c.id}
                label={c.name}
                active={activeCategory === c.id}
                onPress={() => setActiveCategory(c.id)}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-base font-semibold text-gray-900">No products found</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">
            {search ? "Try a different search." : "Nothing in this category yet."}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
        >
          <View className="flex-row flex-wrap justify-between">
            {filtered.map((p) => (
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

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${active ? "bg-primary" : "bg-gray-100"}`}
    >
      <Text className={`text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`}>
        {label}
      </Text>
    </Pressable>
  );
}
