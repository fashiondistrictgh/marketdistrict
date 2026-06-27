import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/** Shimmering placeholder that matches ProductCard's shape while loading. */
export function ProductCardSkeleton({ width }: { width?: number }) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 700 }), withTiming(0.5, { duration: 700 })),
      -1,
      true,
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[width ? { width } : undefined, style]}
      className="mb-3 rounded-3xl border border-gray-100 bg-white p-2.5"
    >
      <View className="aspect-square w-full rounded-2xl bg-gray-200" />
      <View className="px-1 pt-3">
        <View className="h-4 w-3/4 rounded bg-gray-200" />
        <View className="mt-2 h-3 w-1/3 rounded bg-gray-100" />
        <View className="mt-3 h-5 w-1/2 rounded bg-gray-200" />
      </View>
    </Animated.View>
  );
}
