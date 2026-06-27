import { useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Check, Heart, Leaf, Minus, Plus, Truck } from "lucide-react-native";
import { discountPercent, formatCurrency } from "@/shared";

import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { productImageUrl } from "@/lib/product-image";
import { productRating, productReviewCount, productReviews } from "@/lib/reviews";
import { ProductCard } from "@/components/products/ProductCard";
import { StarRating } from "@/components/products/StarRating";
import { colors } from "@/constants/colors";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.ids.includes(id ?? ""));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // "You may also like" — other active products from the same category.
  const { data: related = [] } = useProducts({ categoryId: product?.categoryId ?? undefined });
  const alsoLike = useMemo(
    () => related.filter((p) => p.id !== id).slice(0, 6),
    [related, id],
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-base text-gray-500">Product not found.</Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="font-semibold text-primary">Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stockQuantity <= 0;
  const lineTotal = product.price * qty;
  const rating = productRating(product.id);
  const reviewCount = productReviewCount(product.id);
  const reviews = productReviews(product.id, 3);

  function onAdd() {
    addItem(
      {
        productId: product!.id,
        name: product!.name,
        unitPrice: product!.price,
        imageUrl: product!.imageUrls[0] ?? null,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Image header */}
        <View className="relative">
          <Image
            source={{ uri: productImageUrl(product.imageUrls, product.name, 700) }}
            style={{ width: "100%", height: 360 }}
            resizeMode="cover"
          />
          <SafeAreaView edges={["top"]} className="absolute left-0 right-0 top-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <IconButton onPress={() => router.back()}>
                <ArrowLeft size={22} color="#111827" />
              </IconButton>
              <IconButton onPress={() => toggleWishlist(product.id)}>
                <Heart
                  size={22}
                  color={wishlisted ? "#dc2626" : "#111827"}
                  fill={wishlisted ? "#dc2626" : "transparent"}
                />
              </IconButton>
            </View>
          </SafeAreaView>
          {discount > 0 ? (
            <View className="absolute bottom-4 left-4 rounded-full bg-accent px-3 py-1">
              <Text className="text-sm font-bold text-white">-{discount}% OFF</Text>
            </View>
          ) : null}
        </View>

        {/* Details */}
        <View className="px-5 pt-5">
          <Text className="text-2xl font-bold text-gray-900">{product.name}</Text>
          <Text className="mt-1 text-sm capitalize text-gray-400">per {product.unit}</Text>

          {/* Rating row */}
          <View className="mt-2 flex-row items-center gap-2">
            <StarRating rating={rating} />
            <Text className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</Text>
            <Text className="text-sm text-gray-400">({reviewCount} reviews)</Text>
          </View>

          <View className="mt-3 flex-row items-end gap-2">
            <Text className="text-3xl font-extrabold text-primary">
              {formatCurrency(product.price)}
            </Text>
            {product.compareAtPrice ? (
              <Text className="mb-1 text-base text-gray-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </Text>
            ) : null}
          </View>

          {/* Detail chips */}
          <View className="mt-4 flex-row gap-3">
            <DetailChip icon={<Truck size={18} color={colors.primary} />} top="Delivery" bottom="30–45 min" />
            <DetailChip
              icon={<Leaf size={18} color={colors.primary} />}
              top="Quality"
              bottom="Farm fresh"
            />
            <DetailChip
              icon={
                <Text className="text-base font-bold text-primary">
                  {outOfStock ? "0" : product.stockQuantity}
                </Text>
              }
              top="Stock"
              bottom={outOfStock ? "Out" : "Available"}
            />
          </View>

          {product.description ? (
            <View className="mt-6">
              <Text className="mb-1.5 text-base font-bold text-gray-900">Description</Text>
              <Text className="text-sm leading-6 text-gray-500">{product.description}</Text>
            </View>
          ) : null}

          {/* Quantity */}
          {!outOfStock ? (
            <View className="mt-6 flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">Quantity</Text>
              <View className="flex-row items-center gap-4 rounded-full bg-gray-100 px-2 py-1.5">
                <Pressable
                  onPress={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 items-center justify-center rounded-full bg-white"
                >
                  <Minus size={16} color="#111827" />
                </Pressable>
                <Text className="w-6 text-center text-base font-bold text-gray-900">{qty}</Text>
                <Pressable
                  onPress={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                  className="h-8 w-8 items-center justify-center rounded-full bg-primary"
                >
                  <Plus size={16} color="#fff" />
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Reviews */}
          <View className="mt-8">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-bold text-gray-900">Reviews</Text>
              <Pressable>
                <Text className="text-sm font-semibold text-primary">See all</Text>
              </Pressable>
            </View>
            {reviews.map((r) => (
              <View key={r.id} className="mb-3 rounded-2xl bg-gray-50 p-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-primary/15">
                      <Text className="text-xs font-bold text-primary">{r.name.charAt(0)}</Text>
                    </View>
                    <Text className="text-sm font-semibold text-gray-900">{r.name}</Text>
                  </View>
                  <Text className="text-xs text-gray-400">{r.date}</Text>
                </View>
                <View className="mt-2">
                  <StarRating rating={r.rating} size={12} />
                </View>
                <Text className="mt-1.5 text-sm leading-5 text-gray-600">{r.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* You may also like */}
        {alsoLike.length > 0 ? (
          <View className="mt-2">
            <Text className="mb-3 px-5 text-base font-bold text-gray-900">You may also like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
            >
              {alsoLike.map((p) => (
                <View key={p.id} style={{ width: 150 }}>
                  <ProductCard product={p} width={150} />
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky add-to-cart bar */}
      {!outOfStock ? (
        <SafeAreaView edges={["bottom"]} className="border-t border-gray-100 bg-white">
          <View className="px-5 py-3">
            <Pressable
              onPress={onAdd}
              className={`h-14 flex-row items-center justify-center gap-2 rounded-2xl ${
                added ? "bg-green-600" : "bg-primary"
              } active:opacity-90`}
            >
              {added ? (
                <>
                  <Check size={20} color="#fff" />
                  <Text className="text-base font-bold text-white">Added to cart</Text>
                </>
              ) : (
                <Text className="text-base font-bold text-white">
                  Add to cart · {formatCurrency(lineTotal)}
                </Text>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      ) : null}
    </View>
  );
}

function IconButton({ onPress, children }: { onPress: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
      }}
    >
      {children}
    </Pressable>
  );
}

function DetailChip({
  icon,
  top,
  bottom,
}: {
  icon: React.ReactNode;
  top: string;
  bottom: string;
}) {
  return (
    <View className="flex-1 items-center rounded-2xl border border-gray-100 bg-white py-3">
      <View className="mb-1 h-8 items-center justify-center">{icon}</View>
      <Text className="text-xs text-gray-400">{top}</Text>
      <Text className="text-xs font-semibold text-gray-800">{bottom}</Text>
    </View>
  );
}
