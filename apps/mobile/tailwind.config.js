/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006400",
          dark: "#004d00",
          light: "#0a8f3c",
          foreground: "#ffffff",
        },
        accent: "#f59e0b",
        muted: "#6b7280",
      },
    },
  },
  plugins: [],
};
