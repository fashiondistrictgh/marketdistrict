export const colors = {
  primary: "#006400",
  primaryDark: "#004d00",
  primaryLight: "#0a8f3c",
  accent: "#f59e0b",
  background: "#ffffff",
  surface: "#f6f7f9",
  border: "#e5e7eb",
  text: "#111827",
  textMuted: "#6b7280",
  danger: "#dc2626",
  success: "#16a34a",
  warning: "#f59e0b",
} as const;

export type ColorName = keyof typeof colors;
