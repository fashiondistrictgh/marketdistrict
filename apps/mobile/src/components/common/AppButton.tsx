import { ActivityIndicator, Pressable, Text } from "react-native";

type Variant = "primary" | "secondary" | "outline";

interface AppButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<Variant, { container: string; text: string }> = {
  primary: { container: "bg-primary", text: "text-white" },
  secondary: { container: "bg-gray-100", text: "text-gray-900" },
  outline: { container: "border border-primary bg-transparent", text: "text-primary" },
};

export function AppButton({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: AppButtonProps) {
  const styles = VARIANT_STYLES[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      className={`h-12 items-center justify-center rounded-xl px-4 ${styles.container} ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#16a34a"} />
      ) : (
        <Text className={`text-base font-semibold ${styles.text}`}>{label}</Text>
      )}
    </Pressable>
  );
}
