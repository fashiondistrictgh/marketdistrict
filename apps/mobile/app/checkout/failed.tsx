import { View } from "react-native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import { AppButton } from "@/components/common/AppButton";

export default function CheckoutFailedScreen() {
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center px-8">
          <Animated.View
            entering={ZoomIn.duration(500).springify()}
            className="h-28 w-28 items-center justify-center rounded-full bg-red-50"
          >
            <View className="h-20 w-20 items-center justify-center rounded-full bg-red-500">
              <X size={44} color="#fff" strokeWidth={3} />
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(250).duration(600)}
            className="mt-8 text-2xl font-bold text-gray-900"
          >
            Payment failed
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(450).duration(600)}
            className="mt-2 text-center text-base text-gray-500"
          >
            Your payment didn&apos;t go through. Your order is saved as pending — you can try
            paying again from your orders.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeIn.delay(700).duration(500)} className="gap-3 px-8 pb-10">
          <AppButton label="View my orders" onPress={() => router.replace("/orders" as never)} />
          <AppButton
            label="Back to home"
            variant="outline"
            onPress={() => router.replace("/(tabs)/home")}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
