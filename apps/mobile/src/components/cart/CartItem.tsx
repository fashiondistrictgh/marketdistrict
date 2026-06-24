import { Image, Pressable, Text, View } from "react-native";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import type { CartLine } from "@/shared";
import { formatCurrency } from "@/shared";

import { productImageUrl } from "@/lib/product-image";
import { useCartStore } from "@/store/cart-store";

export function CartItem({ item }: { item: CartLine }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <View className="mb-3 flex-row items-center rounded-2xl border border-gray-100 bg-white p-3">
      <View className="h-20 w-20 overflow-hidden rounded-xl bg-gray-50">
        <Image
          source={{ uri: productImageUrl(item.imageUrl ? [item.imageUrl] : [], item.name, 160) }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 px-3">
        <Text numberOfLines={1} className="text-[15px] font-semibold text-gray-900">
          {item.name}
        </Text>
        <Text className="mt-0.5 text-base font-extrabold text-primary">
          {formatCurrency(item.unitPrice)}
        </Text>

        <View className="mt-2 flex-row items-center gap-3">
          <View className="flex-row items-center gap-3 rounded-full bg-gray-100 px-1.5 py-1">
            <Pressable
              onPress={() => setQuantity(item.productId, item.quantity - 1)}
              className="h-7 w-7 items-center justify-center rounded-full bg-white"
            >
              <Minus size={14} color="#111827" />
            </Pressable>
            <Text className="w-5 text-center text-sm font-bold text-gray-900">{item.quantity}</Text>
            <Pressable
              onPress={() => setQuantity(item.productId, item.quantity + 1)}
              className="h-7 w-7 items-center justify-center rounded-full bg-primary"
            >
              <Plus size={14} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>

      <View className="items-end justify-between self-stretch py-1">
        <Pressable onPress={() => removeItem(item.productId)} hitSlop={8}>
          <Trash2 size={18} color="#dc2626" />
        </Pressable>
        <Text className="text-sm font-bold text-gray-900">
          {formatCurrency(item.unitPrice * item.quantity)}
        </Text>
      </View>
    </View>
  );
}
