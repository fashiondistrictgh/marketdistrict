import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

function normalizePhone(raw: string): string {
  let p = raw.replace(/[\s-()]/g, "");
  if (p.startsWith("+233")) p = "0" + p.slice(4);
  else if (p.startsWith("233")) p = "0" + p.slice(3);
  return p;
}

export default function LoginScreen() {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);

  // Resend cooldown countdown.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // `phone` holds only the 9 local digits (after +233). Backend wants 0XXXXXXXXX.
  const localTo0 = (nineDigits: string) => "0" + nineDigits;
  const phoneValid = /^\d{9}$/.test(phone);

  async function onSendOtp() {
    if (!phoneValid) return setError("Enter your 9-digit number after +233.");
    const norm = normalizePhone(localTo0(phone));
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnErr } = await sendOtp(norm);
      if (fnErr || data?.error) {
        // 404 => no account
        if (data?.exists === false) {
          setError("No account found for this number. Please sign up first.");
        } else {
          setError(data?.error ?? "Could not send code. Try again.");
        }
        return;
      }
      setStep("otp");
      setResendIn(RESEND_SECONDS); // start the cooldown
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  function setDigit(i: number, v: string) {
    const cleaned = v.replace(/[^0-9]/g, "");

    // SMS autofill / paste: a whole code lands in one box — spread it across all.
    if (cleaned.length > 1) {
      const next = Array(OTP_LENGTH).fill("");
      cleaned.slice(0, OTP_LENGTH).split("").forEach((c, idx) => (next[idx] = c));
      setDigits(next);
      const last = Math.min(cleaned.length, OTP_LENGTH) - 1;
      inputs.current[last]?.focus();
      return;
    }

    const d = cleaned.slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  async function onVerify() {
    const code = digits.join("");
    if (code.length !== OTP_LENGTH) return setError("Enter the full 6-digit code.");
    setLoading(true);
    setError(null);
    try {
      await verifyOtp(normalizePhone(localTo0(phone)), code);
      router.replace("/(tabs)/home");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Pressable
          onPress={() => (step === "otp" ? setStep("phone") : router.back())}
          hitSlop={8}
          className="py-2"
        >
          <ArrowLeft size={24} color="#111827" />
        </Pressable>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === "phone" ? (
            <>
              <AuthHeader title="Welcome back" subtitle="Sign in with your phone number" />

              <Text className="mb-1.5 text-sm font-medium text-gray-700">Phone number</Text>
              <View className="mb-1 flex-row items-center">
                <View className="h-12 flex-row items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3">
                  <Text className="text-base font-semibold text-gray-700">🇬🇭 +233</Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={(v) => setPhone(v.replace(/\D/g, "").slice(0, 9))}
                  placeholder="24 123 4567"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  autoComplete="tel"
                  maxLength={9}
                  className="h-12 flex-1 rounded-r-xl border border-gray-200 bg-white px-4 text-base text-gray-900"
                />
              </View>
              <Text className="mb-3 text-xs text-gray-400">
                Enter the 9 digits after +233 ({phone.length}/9)
              </Text>

              {error ? <Text className="mb-3 text-sm text-red-500">{error}</Text> : null}
              <AppButton
                label="Send code"
                loading={loading}
                disabled={!phoneValid}
                onPress={onSendOtp}
              />

              <View className="mt-6 flex-row items-center justify-center">
                <Text className="text-sm text-gray-500">New here? </Text>
                <Link href="/(auth)/register" className="text-sm font-bold text-primary">
                  Create an account
                </Link>
              </View>
            </>
          ) : (
            <>
              <AuthHeader
                title="Enter code"
                subtitle={`We sent a 6-digit code to +233 ${phone}`}
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
                    onKeyPress={({ nativeEvent }) => {
                      if (nativeEvent.key === "Backspace" && !digits[i] && i > 0)
                        inputs.current[i - 1]?.focus();
                    }}
                    keyboardType="number-pad"
                    textContentType={i === 0 ? "oneTimeCode" : "none"}
                    autoComplete={i === 0 ? "sms-otp" : "off"}
                    maxLength={i === 0 ? OTP_LENGTH : 1}
                    className="h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-gray-900"
                  />
                ))}
              </View>
              {error ? <Text className="mb-3 text-sm text-red-500">{error}</Text> : null}
              <AppButton label="Verify & sign in" loading={loading} onPress={onVerify} />

              <Pressable
                className="mt-6"
                onPress={onSendOtp}
                disabled={loading || resendIn > 0}
              >
                {resendIn > 0 ? (
                  <Text className="text-center text-sm text-gray-400">
                    Resend code in {Math.floor(resendIn / 60)}:
                    {String(resendIn % 60).padStart(2, "0")}
                  </Text>
                ) : (
                  <Text className="text-center text-sm font-semibold text-primary">
                    Resend code
                  </Text>
                )}
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
