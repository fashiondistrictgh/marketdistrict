import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, MailCheck } from "lucide-react-native";

import { AppButton } from "@/components/common/AppButton";
import { AppInput } from "@/components/common/AppInput";
import { AuthHeader } from "@/components/common/AuthHeader";
import { ScreenWrapper } from "@/components/common/ScreenWrapper";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/helpers";
import { isEmail } from "@/shared";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit() {
    if (!isEmail(email)) return setError("Please enter a valid email address.");
    setLoading(true);
    setError(null);
    const { error: authError } = await resetPassword(email.trim());
    setLoading(false);
    if (authError) return setError(getErrorMessage(authError));
    setSent(true);
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

        <View className="flex-1 justify-center">
          {sent ? (
            <View className="items-center">
              <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <MailCheck size={36} color="#006400" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">Check your email</Text>
              <Text className="mt-2 text-center text-base text-gray-500">
                We sent a password reset link to{"\n"}
                <Text className="font-medium text-gray-700">{email}</Text>
              </Text>
              <View className="mt-8 w-full">
                <AppButton label="Back to sign in" onPress={() => router.replace("/(auth)/login")} />
              </View>
            </View>
          ) : (
            <>
              <AuthHeader
                title="Reset password"
                subtitle="Enter your email and we'll send you a reset link"
              />
              <AppInput
                label="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
              />
              {error ? <Text className="mb-3 text-sm text-red-500">{error}</Text> : null}
              <AppButton label="Send reset link" loading={loading} onPress={onSubmit} />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
