import { useEffect, useState } from "react";
import { ImageBackground, Image, Pressable, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useAuthStore } from "@/store/auth-store";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// AI-generated brand hero (groceries / fresh market). True 9:16 portrait at a
// high resolution so it fills phone screens without distortion. Fetched once, cached.
const HERO_IMAGE =
  "https://image.pollinations.ai/prompt/fresh%20colorful%20groceries%20fruits%20and%20vegetables%20in%20baskets%2C%20vibrant%2C%20soft%20natural%20light%2C%20vertical%20composition?width=1080&height=1920&nologo=true&seed=7";

export default function SplashScreen() {
  const user = useAuthStore((s) => s.user);

  // Logo entrance only — springs in once, then stays still.
  const logoScale = useSharedValue(0.6);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 9, stiffness: 90 });
  }, [logoScale]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  if (user) return <Redirect href="/(tabs)/home" />;

  return (
    <View className="flex-1 bg-primary">
      <StatusBar style="light" />
      <ImageBackground
        source={{ uri: HERO_IMAGE }}
        resizeMode="cover"
        style={{ flex: 1 }}
        imageStyle={{ width: "100%", height: "100%" }}
      >
        {/* Dark green gradient overlay keeps the logo + text readable over any photo. */}
        <LinearGradient
          colors={["rgba(0,77,0,0.55)", "rgba(0,77,0,0.75)", "rgba(0,50,0,0.96)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <View className="flex-1 items-center justify-center px-8">
            <Animated.View style={logoStyle} className="items-center">
              <View className="h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-white shadow-lg">
                <Image
                  source={require("@/assets/images/icon.png")}
                  style={{ width: 128, height: 128 }}
                  resizeMode="cover"
                />
              </View>
            </Animated.View>

            <Animated.Text
              entering={FadeInDown.delay(450).duration(700).springify()}
              className="mt-8 text-4xl font-extrabold tracking-tight text-white"
            >
              Market District
            </Animated.Text>

            <Animated.Text
              entering={FadeInDown.delay(700).duration(700)}
              className="mt-3 text-center text-base text-white/90"
            >
              Fresh groceries, delivered to your door.
            </Animated.Text>
          </View>

          <Animated.View entering={FadeIn.delay(1200).duration(600)} className="px-8 pb-14">
            <CTAButton onPress={() => router.push("/(auth)/login")} />
            <Pressable onPress={() => router.push("/(auth)/register")} className="mt-4 py-1">
              <Text className="text-center text-sm font-medium text-white/90">
                New here? <Text className="font-bold text-white">Create an account</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

function CTAButton({ onPress }: { onPress: () => void }) {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withDelay(
      1400,
      withRepeat(withSequence(withTiming(1.03, { duration: 1100 }), withTiming(1, { duration: 1100 })), -1, true),
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={style}
      className="h-14 items-center justify-center rounded-2xl bg-white shadow-lg active:opacity-90"
    >
      <Text className="text-base font-bold text-primary">Get started</Text>
    </AnimatedPressable>
  );
}
