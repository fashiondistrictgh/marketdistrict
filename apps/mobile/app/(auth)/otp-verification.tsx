import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { AppButton } from "@/components/common/AppButton";
import { AuthHeader } from "@/components/common/AuthHeader";
import { ScreenWrapper } from "@/components/common/ScreenWrapper";

const LENGTH = 6;

export default function OtpVerificationScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);

  function setDigit(index: number, value: string) {
    const v = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      return next;
    });
    if (v && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onKeyPress(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function onVerify() {
    const code = digits.join("");
    if (code.length < LENGTH) return setError("Enter the full 6-digit code.");
    // Wire to supabase.auth.verifyOtp when email/phone OTP is enabled.
    setError(null);
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

        <View className="flex-1 justify-center">
          <AuthHeader
            title="Verify your code"
            subtitle={email ? `Enter the code sent to ${email}` : "Enter the 6-digit code we sent you"}
          />

          <View className="mb-6 flex-row justify-between">
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                value={d}
                onChangeText={(v) => setDigit(i, v)}
                onKeyPress={({ nativeEvent }) => onKeyPress(i, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                className="h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-gray-900"
              />
            ))}
          </View>

          {error ? <Text className="mb-3 text-sm text-red-500">{error}</Text> : null}

          <AppButton label="Verify" onPress={onVerify} />

          <Pressable className="mt-6" onPress={() => setDigits(Array(LENGTH).fill(""))}>
            <Text className="text-center text-sm font-medium text-primary">
              Didn&apos;t get a code? Resend
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
