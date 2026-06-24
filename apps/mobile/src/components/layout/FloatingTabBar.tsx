import { Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Heart, Home, Search, ShoppingCart, User, type LucideIcon } from "lucide-react-native";

import { colors } from "@/constants/colors";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  categories: Search,
  cart: ShoppingCart,
  wishlist: Heart,
  profile: User,
};

/** A floating, pill-shaped tab bar. Active tab lifts into a filled circle. */
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore((s) => s.count());
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  // Hide the floating bar on screens that have their own bottom action bar
  // (the cart's "Proceed to checkout" button), so it isn't blocked.
  const activeRoute = state.routes[state.index]?.name;
  if (activeRoute === "cart") return null;

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      className="absolute inset-x-0 bottom-0 items-center bg-transparent"
      pointerEvents="box-none"
    >
      <View
        className="flex-row items-center justify-between rounded-full bg-white px-3 py-2.5"
        style={{
          width: "88%",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const Icon = ICONS[route.name] ?? Home;
          const badge =
            route.name === "cart" ? cartCount : route.name === "wishlist" ? wishlistCount : 0;

          function onPress() {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center"
              hitSlop={6}
            >
              <View
                className={`h-11 w-11 items-center justify-center rounded-full ${
                  focused ? "bg-primary" : "bg-transparent"
                }`}
              >
                <Icon
                  size={22}
                  color={focused ? "#fff" : "#9ca3af"}
                  strokeWidth={focused ? 2.6 : 2}
                />
                {badge > 0 ? (
                  <View className="absolute -right-0.5 -top-0.5 h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1">
                    <Text className="text-[10px] font-bold text-white">{badge}</Text>
                  </View>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
