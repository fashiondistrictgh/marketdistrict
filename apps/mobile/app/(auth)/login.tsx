import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AuthHeader } from "@/components/common/AuthHeader";
import { ScreenWrapper } from "@/components/common/ScreenWrapper";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/helpers";
import { isEmail } from "@/shared";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isEmail(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    setError(null);
    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);
    if (authError) return setError(getErrorMessage(authError));
    router.replace("/(tabs)/home");
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Pressable onPress={() => router.back()} hitSlop={8} className="py-2">
          <ArrowLeft size={24} color="#111827" />
        </Pressable>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AuthHeader title="Welcome back" subtitle="Sign in to continue shopping" />

          <AppInput
            label="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          <AppInput
            label="Password"
            password
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
          />

          <View className="mb-4 items-end">
            <Link href="/(auth)/forgot-password" className="text-sm font-medium text-primary">
              Forgot password?
            </Link>
          </View>

          {error ? <Text className="mb-3 text-sm text-red-500">{error}</Text> : null}

          <AppButton label="Sign in" loading={loading} onPress={onSubmit} />

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-sm text-gray-500">New here? </Text>
            <Link href="/(auth)/register" className="text-sm font-bold text-primary">
              Create an account
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
