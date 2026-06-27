import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Heart, Plus } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Product } from "@/shared";
import { discountPercent, formatCurrency } from "@/shared";

import { productImageUrl } from "@/lib/product-image";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ProductCardProps {
  product: Product;
  width?: number;
  /** Index for a staggered entrance animation in grids. */
  index?: number;
}

export function ProductCard({ product, width, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const wishlisted = useWishlistStore((s) => s.ids.includes(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const outOfStock = product.stockQuantity <= 0;

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(Math.min(index, 8) * 60).duration(380)}
      onPress={() => router.push(`/product/${product.id}`)}
      style={width ? { width } : undefined}
      className="mb-3 rounded-3xl border border-gray-100 bg-white p-2.5"
    >
      {/* Image with overlapping add button */}
      <View className="relative">
        <View className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
          <Image
            source={{ uri: productImageUrl(product.imageUrls, product.name, 300) }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          {discount > 0 ? (
            <View className="absolute left-2 top-2 rounded-lg bg-accent px-2 py-0.5">
              <Text className="text-[11px] font-bold text-white">-{discount}%</Text>
            </View>
          ) : null}

          {/* Wishlist heart */}
          <Pressable
            onPress={() => toggleWishlist(product.id)}
            hitSlop={6}
            className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-white/90"
          >
            <Heart
              size={16}
              color={wishlisted ? "#dc2626" : "#9ca3af"}
              fill={wishlisted ? "#dc2626" : "transparent"}
              strokeWidth={2.4}
            />
          </Pressable>

          {outOfStock ? (
            <View className="absolute inset-0 items-center justify-center bg-white/55">
              <Text className="rounded-full bg-gray-900/80 px-3 py-1 text-[11px] font-semibold text-white">
                Out of stock
              </Text>
            </View>
          ) : null}
        </View>

        {/* Add button overlaps the image's bottom-right corner */}
        {!outOfStock ? (
          <Pressable
            onPress={() =>
              addItem(
                {
                  productId: product.id,
                  name: product.name,
                  unitPrice: product.price,
                  imageUrl: product.imageUrls[0] ?? null,
                },
                1,
              )
            }
            hitSlop={6}
            className="absolute -bottom-1 right-1 h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-md active:scale-95 active:opacity-90"
          >
            <Plus size={20} color="#fff" strokeWidth={2.8} />
          </Pressable>
        ) : null}
      </View>

      {/* Text */}
      <View className="px-1 pt-3">
        <Text numberOfLines={1} className="text-[15px] font-semibold text-gray-900">
          {product.name}
        </Text>
        <Text className="mt-0.5 text-xs capitalize text-gray-400">per {product.unit}</Text>

        <View className="mt-2 flex-row items-baseline gap-1.5">
          <Text className="text-base font-extrabold text-primary">
            {formatCurrency(product.price)}
          </Text>
          {product.compareAtPrice ? (
            <Text className="text-xs text-gray-400 line-through">
              {formatCurrency(product.compareAtPrice)}
            </Text>
          ) : null}
        </View>
      </View>
    </AnimatedPressable>
  );
}
