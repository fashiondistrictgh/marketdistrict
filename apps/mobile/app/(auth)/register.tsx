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

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function normalizePhone(raw: string): string {
    let p = raw.replace(/[\s-()]/g, "");
    if (p.startsWith("+233")) p = "0" + p.slice(4);
    else if (p.startsWith("233")) p = "0" + p.slice(3);
    return p;
  }

  async function onSubmit() {
    if (fullName.trim().length < 2) return setError("Please enter your full name.");
    if (!isEmail(email)) return setError("Please enter a valid email address.");
    const normPhone = normalizePhone(phone);
    if (!/^0\d{9}$/.test(normPhone))
      return setError("Enter a valid Ghana phone number (e.g. 024 123 4567).");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    setLoading(true);
    setError(null);
    const { error: authError } = await signUp(email.trim(), password, fullName.trim(), normPhone);
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
          <AuthHeader title="Create account" subtitle="Join Market District in seconds" />

          <AppInput
            label="Full name"
            autoCapitalize="words"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Ama Mensah"
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
          <AppInput
            label="Phone number"
            autoComplete="tel"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="024 123 4567"
          />
          <AppInput
            label="Password"
            password
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
          />
          <AppInput
            label="Confirm password"
            password
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter password"
          />

          {error ? <Text className="mb-3 text-sm text-red-500">{error}</Text> : null}

          <AppButton label="Create account" loading={loading} onPress={onSubmit} />

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-sm text-gray-500">Already have an account? </Text>
            <Link href="/(auth)/login" className="text-sm font-bold text-primary">
              Sign in
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
