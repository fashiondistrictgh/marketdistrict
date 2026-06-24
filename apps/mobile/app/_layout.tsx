import "../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/lib/query-client";
import { useAuth } from "@/hooks/useAuth";

function AuthSync() {
  // Keeps the auth store in sync with Supabase sessions. Renders nothing.
  useAuth();
  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <AuthSync />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 250,
            }}
          >
            <Stack.Screen name="index" options={{ animation: "fade" }} />
            <Stack.Screen name="(auth)" options={{ animation: "fade_from_bottom" }} />
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="product/[id]" options={{ headerShown: true, title: "Product" }} />
            <Stack.Screen name="category/[id]" options={{ headerShown: true, title: "Category" }} />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="profile" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
