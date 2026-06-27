import { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/colors";

/** A smooth branded spinning ring. */
export function Spinner({ size = 36 }: { size?: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: Math.max(3, size / 12),
          borderColor: "#e5e7eb",
          borderTopColor: colors.primary,
        },
        style,
      ]}
    />
  );
}

/** Full-screen centered loader with an optional message. */
export function Loader({ message }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <Spinner />
      {message ? <Text className="mt-3 text-sm text-gray-500">{message}</Text> : null}
    </View>
  );
}
